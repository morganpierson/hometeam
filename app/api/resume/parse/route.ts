import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/utils/db'
import { put } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'
import pdfParse from 'pdf-parse'
import Anthropic from '@anthropic-ai/sdk'

export const dynamic = 'force-dynamic'

const anthropic = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'],
})

const TRADE_CATEGORIES = [
  'ELECTRICIAN',
  'PLUMBER',
  'HVAC',
  'CARPENTER',
  'ROOFER',
  'PAINTER',
  'MASON',
  'WELDER',
  'GENERAL_CONTRACTOR',
  'LANDSCAPER',
  'CONCRETE',
  'DRYWALL',
  'FLOORING',
  'GLAZIER',
  'INSULATION',
  'IRONWORKER',
  'SHEET_METAL',
  'TILE_SETTER',
  'OTHER',
]

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

interface ParsedResumeForOnboarding {
  summary: string
  lookingFor: string
  experiences: ParsedExperience[]
  inferredTradeCategory: string | null
  inferredYearsExperience: number | null
  inferredLocation: string | null
}

async function parseResumeForOnboarding(text: string, firstName: string): Promise<ParsedResumeForOnboarding> {
  const systemPrompt = `You are an expert resume parser for a skilled trades marketplace. Extract structured information from the resume text provided. Return a JSON object with:
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
- inferredTradeCategory: Based on the resume content, infer which trade category best fits. Must be one of: ${TRADE_CATEGORIES.join(', ')}. Return null if cannot be determined.
- inferredYearsExperience: Calculate total years of experience in the trades based on work history dates. Return as integer or null if cannot be determined.
- inferredLocation: The most recent or primary work location (City, State format) or null if not found.

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

  // Remove markdown code blocks
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.slice(7)
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.slice(3)
  }
  if (jsonText.endsWith('```')) {
    jsonText = jsonText.slice(0, -3)
  }
  jsonText = jsonText.trim()

  // If still not valid JSON, try to extract JSON object from the text
  if (!jsonText.startsWith('{')) {
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      jsonText = jsonMatch[0]
    }
  }

  try {
    return JSON.parse(jsonText) as ParsedResumeForOnboarding
  } catch (parseError) {
    console.error('Failed to parse AI response:', jsonText.substring(0, 500))
    throw new Error('Invalid JSON response from AI')
  }
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

    // Check if we got any meaningful text
    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF. Please ensure the PDF contains selectable text.' },
        { status: 400 }
      )
    }

    // Parse with AI - enhanced for onboarding
    const parsed = await parseResumeForOnboarding(resumeText, employee.firstName || 'the candidate')

    // Return parsed data without saving to DB (form submission will save)
    return NextResponse.json({
      success: true,
      resumeUrl: blob.url,
      summary: parsed.summary,
      lookingFor: parsed.lookingFor,
      experiences: parsed.experiences,
      inferredData: {
        tradeCategory: parsed.inferredTradeCategory,
        yearsExperience: parsed.inferredYearsExperience,
        location: parsed.inferredLocation,
        bio: parsed.summary,
      },
    })
  } catch (error) {
    console.error('Error parsing resume:', error)

    if (error instanceof Error) {
      if (error.message.includes('rate') || error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'AI service is busy. Please try again in a moment.' },
          { status: 503 }
        )
      }

      if (error.message.includes('Invalid JSON') || error instanceof SyntaxError) {
        return NextResponse.json(
          { error: 'Failed to parse resume data. Please try again.' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to process resume. Please try again.' },
      { status: 500 }
    )
  }
}
