import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM_EMAIL = 'notifications@send.workbench.careers'

interface NewApplicationEmailParams {
  employerEmail: string
  employerId: string
  employerName: string
  candidateName: string
  jobTitle: string
  jobId: string
}

interface ApplicationAcceptedEmailParams {
  candidateEmail: string
  candidateName: string
  employerName: string
  jobTitle: string
  conversationId: string
}

/**
 * Sends an email to the employer when a candidate applies to their job posting.
 * Fire-and-forget: errors are logged but don't block the main flow.
 */
export async function sendNewApplicationEmail({
  employerEmail,
  employerId,
  employerName,
  candidateName,
  jobTitle,
  jobId,
}: NewApplicationEmailParams): Promise<void> {
  if (!resend) {
    console.warn('Resend not configured, skipping email notification')
    return
  }

  if (!employerEmail) {
    console.warn('No employer email provided, skipping notification')
    return
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: employerEmail,
      subject: `New Application: ${candidateName} applied for ${jobTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">New Application Received</h2>
          <p>Hi ${employerName || 'there'},</p>
          <p><strong>${candidateName}</strong> has applied for the <strong>${jobTitle}</strong> position.</p>
          <p>Log in to your dashboard to review their application and connect with them.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/org/${employerId}/jobs/${jobId}/applicants"
             style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
            Review Application
          </a>
          <p style="color: #666; margin-top: 24px; font-size: 14px;">
            You're receiving this email because you have job postings on our platform.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend API error:', error)
      return
    }

    console.log(`New application email sent to ${employerEmail}, id: ${data?.id}`)
  } catch (error) {
    console.error('Failed to send new application email:', error)
  }
}

/**
 * Sends an email to the candidate when an employer accepts their application.
 * Fire-and-forget: errors are logged but don't block the main flow.
 */
export async function sendApplicationAcceptedEmail({
  candidateEmail,
  candidateName,
  employerName,
  jobTitle,
  conversationId,
}: ApplicationAcceptedEmailParams): Promise<void> {
  if (!resend) {
    console.warn('Resend not configured, skipping email notification')
    return
  }

  if (!candidateEmail) {
    console.warn('No candidate email provided, skipping notification')
    return
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: candidateEmail,
      subject: `Good news! ${employerName} wants to connect about ${jobTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">Great News!</h2>
          <p>Hi ${candidateName || 'there'},</p>
          <p><strong>${employerName}</strong> has reviewed your application for the <strong>${jobTitle}</strong> position and wants to connect with you!</p>
          <p>They've started a conversation with you. Log in to your dashboard to view their message and continue the discussion.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/messages/${conversationId}"
             style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
            View Conversation
          </a>
          <p style="color: #666; margin-top: 24px; font-size: 14px;">
            You're receiving this email because you applied for a job on our platform.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend API error:', error)
      return
    }

    console.log(`Application accepted email sent to ${candidateEmail}, id: ${data?.id}`)
  } catch (error) {
    console.error('Failed to send application accepted email:', error)
  }
}
