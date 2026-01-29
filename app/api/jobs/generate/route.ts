import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
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

const CERTIFICATIONS = [
  'Licensed Journeyman',
  'Licensed Master',
  'OSHA 10',
  'OSHA 30',
  'EPA Certification',
  'CDL License',
  'First Aid/CPR',
  'Confined Space',
  'Fall Protection',
  'Forklift Certified',
  'Welding Certification',
  'Backflow Prevention',
  'Fire Alarm License',
  'Low Voltage License',
]

const BENEFITS = [
  'Health Insurance',
  'Dental Insurance',
  'Vision Insurance',
  '401(k)',
  '401(k) Matching',
  'Paid Time Off',
  'Paid Holidays',
  'Flexible Schedule',
  'Tools Provided',
  'Company Vehicle',
  'Gas Allowance',
  'Training & Development',
  'Safety Equipment Provided',
  'Overtime Pay',
  'Performance Bonuses',
]

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const systemPrompt = `You are a helpful assistant that generates job posting details for skilled trade positions.
Given a brief description of the ideal candidate, extract ONLY the information that is explicitly mentioned or strongly implied.

You must respond with a valid JSON object containing these fields:
- title: A professional job title based on the trade mentioned (e.g., "Journeyman Electrician", "Senior HVAC Technician")
- description: A detailed job description (2-3 paragraphs) that includes responsibilities and what you're looking for
- primaryTrade: One of these exact values: ${TRADE_CATEGORIES.join(', ')}
- jobType: One of: FULL_TIME, PART_TIME, CONTRACT, TEMPORARY (use FULL_TIME as default if not specified)
- minYearsExperience: A number ONLY if years of experience is explicitly mentioned, otherwise null
- maxYearsExperience: A number ONLY if a max is explicitly mentioned, otherwise null
- requiredCertifications: An array of certifications from this list ONLY if certifications are mentioned or strongly implied by the role (e.g., "journeyman" implies "Licensed Journeyman"): ${CERTIFICATIONS.join(', ')}
- city: The city ONLY if explicitly mentioned, otherwise null
- state: The state abbreviation ONLY if explicitly mentioned, otherwise null
- payType: ONLY set if pay information is mentioned, otherwise null
- payRangeMin: A number ONLY if pay/salary/rate is explicitly mentioned, otherwise null
- payRangeMax: A number ONLY if pay/salary/rate is explicitly mentioned, otherwise null
- benefits: An empty array [] - do NOT assume benefits unless explicitly mentioned

Also include a "needsAttention" array listing which sections need employer review because info was NOT provided:
- Include "compensation" if no pay information was mentioned
- Include "benefits" if no benefits were mentioned
- Include "location" if no city/state was mentioned
- Include "requirements" if no experience or certifications were mentioned

Respond ONLY with the JSON object, no additional text or markdown formatting.`

    const message = await anthropic.messages.create({
      // Using Haiku for cost efficiency - job generation is straightforward extraction
      model: 'claude-3-haiku-20240307',
      max_tokens: 1500,
      messages: [
        { role: 'user', content: prompt },
      ],
      system: systemPrompt,
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from AI')
    }

    // Parse the JSON response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from AI')
    }

    const jobData = JSON.parse(jsonMatch[0])

    // Validate and sanitize the response
    const sanitizedData = {
      title: jobData.title || '',
      description: jobData.description || '',
      primaryTrade: TRADE_CATEGORIES.includes(jobData.primaryTrade)
        ? jobData.primaryTrade
        : '',
      jobType: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY'].includes(
        jobData.jobType
      )
        ? jobData.jobType
        : 'FULL_TIME',
      minYearsExperience: jobData.minYearsExperience?.toString() || '',
      maxYearsExperience: jobData.maxYearsExperience?.toString() || '',
      requiredCertifications: Array.isArray(jobData.requiredCertifications)
        ? jobData.requiredCertifications.filter((c: string) =>
            CERTIFICATIONS.includes(c)
          )
        : [],
      city: jobData.city || '',
      state: jobData.state || '',
      payType: jobData.payType && ['HOURLY', 'SALARY', 'PROJECT_BASED'].includes(jobData.payType)
        ? jobData.payType
        : '',
      payRangeMin: jobData.payRangeMin?.toString() || '',
      payRangeMax: jobData.payRangeMax?.toString() || '',
      benefits: Array.isArray(jobData.benefits)
        ? jobData.benefits.filter((b: string) => BENEFITS.includes(b))
        : [],
      needsAttention: Array.isArray(jobData.needsAttention)
        ? jobData.needsAttention
        : [],
    }

    return NextResponse.json(sanitizedData)
  } catch (error) {
    console.error('Error generating job posting:', error)
    return NextResponse.json(
      { error: 'Failed to generate job posting' },
      { status: 500 }
    )
  }
}
