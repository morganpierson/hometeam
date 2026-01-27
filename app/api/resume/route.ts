import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/utils/db'
import { put } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'
import pdfParse from 'pdf-parse'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'],
})

interface ParsedExperience {
  title: string
  company: string
  startDate: string | null
  endDate: string | null
  isCurrent: boolean
  description: string | null
  highlights: string[]
  location: string | null
}

interface ParsedResume {
  summary: string
  lookingFor: string
  experiences: ParsedExperience[]
}

async function parseResumeWithAI(text: string, firstName: string): Promise<ParsedResume> {
  const systemPrompt = `You are an expert resume parser. Extract structured information from the resume text provided. Return a JSON object with:
- summary: A 2-3 sentence professional summary of ${firstName}'s background written in third person
- lookingFor: A 1-2 sentence statement about what kind of role/opportunity ${firstName} is looking for (infer from resume content)
- experiences: An array of work experiences, each with:
  - title: Job title
  - company: Company name
  - startDate: Start date in ISO format (YYYY-MM-DD) or null if not found
  - endDate: End date in ISO format (YYYY-MM-DD) or null if current/not found
  - isCurrent: Boolean, true if this is current job
  - description: Brief description of the role (1-2 sentences) or null
  - highlights: Array of 3-6 key achievements/responsibilities as bullet points
  - location: City, State or "Remote" or null if not found

Return ONLY valid JSON, no markdown code blocks or explanation.`

  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Parse this resume:\n\n${text}`
      }
    ],
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('No text response from AI')
  }

  // Clean up the response in case it has markdown code blocks
  let jsonText = content.text.trim()
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.slice(7)
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.slice(3)
  }
  if (jsonText.endsWith('```')) {
    jsonText = jsonText.slice(0, -3)
  }

  return JSON.parse(jsonText.trim()) as ParsedResume
}

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer)
  return data.text
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const employee = await prisma.employee.findUnique({
      where: { clerkId: userId },
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('resume') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const blob = await put(`resumes/${uuidv4()}-${file.name}`, fileBuffer, {
      access: 'public',
    })

    // Parse PDF directly from buffer
    const resumeText = await extractTextFromPDF(fileBuffer)

    // Log extracted text for debugging
    console.log('Extracted resume text length:', resumeText.length)
    console.log('Extracted resume text preview:', resumeText.substring(0, 500))

    // Check if we got any meaningful text
    if (!resumeText || resumeText.trim().length < 50) {
      console.error('PDF text extraction failed or returned minimal content')
      return NextResponse.json(
        { error: 'Could not extract text from PDF. Please ensure the PDF contains selectable text.' },
        { status: 400 }
      )
    }

    // Parse with AI
    const parsed = await parseResumeWithAI(resumeText, employee.firstName || 'the candidate')

    // Delete existing work experiences
    await prisma.workExperience.deleteMany({
      where: { employeeId: employee.id },
    })

    // Create new work experiences
    const workExperiences = await Promise.all(
      parsed.experiences.map((exp, index) =>
        prisma.workExperience.create({
          data: {
            title: exp.title,
            company: exp.company,
            startDate: exp.startDate ? new Date(exp.startDate) : null,
            endDate: exp.endDate ? new Date(exp.endDate) : null,
            isCurrent: exp.isCurrent,
            description: exp.description,
            highlights: exp.highlights,
            location: exp.location,
            sortOrder: index,
            employeeId: employee.id,
          },
        })
      )
    )

    // Update employee with resume URL and summary
    await prisma.employee.update({
      where: { id: employee.id },
      data: {
        resume: blob.url,
        resumeSummary: parsed.summary,
        lookingFor: parsed.lookingFor,
      },
    })

    return NextResponse.json({
      success: true,
      resumeUrl: blob.url,
      summary: parsed.summary,
      lookingFor: parsed.lookingFor,
      experienceCount: workExperiences.length,
    })
  } catch (error) {
    console.error('Error processing resume:', error)

    // Check for rate limit or quota errors
    if (error instanceof Error && (error.message.includes('rate') || error.message.includes('quota'))) {
      return NextResponse.json(
        { error: 'AI service is busy. Please try again in a moment.' },
        { status: 503 }
      )
    }

    // Check for JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Failed to parse resume data. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process resume. Please try again.' },
      { status: 500 }
    )
  }
}
