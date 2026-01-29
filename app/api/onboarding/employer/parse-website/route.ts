import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
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

interface ParsedCompanyData {
  companyName: string | null
  description: string | null
  contactPhone: string | null
  contactEmail: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  specialties: string[]
  companySize: string | null
}

async function fetchWebsiteContent(url: string): Promise<string> {
  // Ensure URL has protocol
  let fullUrl = url
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    fullUrl = `https://${url}`
  }

  const response = await fetch(fullUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; CompanyParser/1.0)',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch website: ${response.status}`)
  }

  const html = await response.text()

  // Basic HTML to text conversion - strip tags and get text content
  const textContent = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // Limit content to avoid token limits
  return textContent.substring(0, 15000)
}

async function parseWebsiteContent(content: string, websiteUrl: string): Promise<ParsedCompanyData> {
  const systemPrompt = `You are an expert at extracting company information from website content. Extract structured information from the website text provided. Return a JSON object with:

- companyName: The company name, or null if not found
- description: A 2-3 sentence description of what the company does, or null if not found
- contactPhone: Contact phone number in format (XXX) XXX-XXXX, or null if not found
- contactEmail: Contact email address, or null if not found
- city: City where the company is located, or null if not found
- state: State abbreviation (e.g., "CO", "TX"), or null if not found
- zipCode: ZIP code, or null if not found
- specialties: Array of trade categories the company specializes in. Must only include values from this list: ${TRADE_CATEGORIES.join(', ')}. Return empty array if none can be determined.
- companySize: One of "small" (1-10), "med" (11-50), "large" (51-200), or "enterprise" (200+), or null if not determinable

The website URL is: ${websiteUrl}

Return ONLY valid JSON, no markdown code blocks or explanation.`

  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Extract company information from this website content:\n\n${content}`,
      },
    ],
  })

  const responseContent = response.content[0]
  if (responseContent.type !== 'text') {
    throw new Error('No text response from AI')
  }

  let jsonText = responseContent.text.trim()

  // Remove markdown code blocks if present
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.slice(7)
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.slice(3)
  }
  if (jsonText.endsWith('```')) {
    jsonText = jsonText.slice(0, -3)
  }
  jsonText = jsonText.trim()

  // Try to extract JSON object if still not valid
  if (!jsonText.startsWith('{')) {
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      jsonText = jsonMatch[0]
    }
  }

  try {
    return JSON.parse(jsonText) as ParsedCompanyData
  } catch (parseError) {
    console.error('Failed to parse AI response:', jsonText.substring(0, 500))
    throw new Error('Invalid JSON response from AI')
  }
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

    const body = await request.json()
    const { websiteUrl } = body

    if (!websiteUrl) {
      return NextResponse.json(
        { error: 'Website URL is required' },
        { status: 400 }
      )
    }

    // Fetch website content
    let websiteContent: string
    try {
      websiteContent = await fetchWebsiteContent(websiteUrl)
    } catch (fetchError) {
      return NextResponse.json(
        { error: 'Could not access website. Please check the URL and try again.' },
        { status: 400 }
      )
    }

    // Check if we got meaningful content
    if (!websiteContent || websiteContent.length < 100) {
      return NextResponse.json(
        { error: 'Could not extract content from website. Please enter your details manually.' },
        { status: 400 }
      )
    }

    // Parse with AI
    const parsed = await parseWebsiteContent(websiteContent, websiteUrl)

    return NextResponse.json({
      success: true,
      websiteUrl,
      data: {
        companyName: parsed.companyName,
        description: parsed.description,
        contactPhone: parsed.contactPhone,
        contactEmail: parsed.contactEmail,
        city: parsed.city,
        state: parsed.state,
        zipCode: parsed.zipCode,
        specialties: parsed.specialties,
        companySize: parsed.companySize,
      },
    })
  } catch (error) {
    console.error('Error parsing website:', error)

    if (error instanceof Error) {
      if (error.message.includes('rate') || error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'AI service is busy. Please try again in a moment.' },
          { status: 503 }
        )
      }

      if (error.message.includes('Invalid JSON')) {
        return NextResponse.json(
          { error: 'Failed to parse website data. Please try again.' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to process website. Please try again or enter details manually.' },
      { status: 500 }
    )
  }
}
