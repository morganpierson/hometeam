import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

// Log whether Resend is configured (helps debug production issues)
console.log(`[Email] Resend configured: ${resend !== null}`)

const FROM_EMAIL = 'notifications@workbench.careers'

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

interface NewMessageEmailParams {
  recipientEmail: string
  recipientName: string
  senderName: string
  messagePreview: string
  conversationId: string
  isEmployerRecipient: boolean
  employerId?: string
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
  console.log(`[Email] sendNewApplicationEmail called - to: ${employerEmail}, job: ${jobTitle}`)

  if (!resend) {
    console.warn('[Email] Resend not configured (RESEND_API_KEY missing), skipping email notification')
    return
  }

  if (!employerEmail) {
    console.warn('[Email] No employer email provided, skipping notification')
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
      console.error('[Email] Resend API error:', error)
      return
    }

    console.log(`[Email] New application email sent to ${employerEmail}, id: ${data?.id}`)
  } catch (error) {
    console.error('[Email] Failed to send new application email:', error)
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
  console.log(`[Email] sendApplicationAcceptedEmail called - to: ${candidateEmail}, job: ${jobTitle}`)

  if (!resend) {
    console.warn('[Email] Resend not configured (RESEND_API_KEY missing), skipping email notification')
    return
  }

  if (!candidateEmail) {
    console.warn('[Email] No candidate email provided, skipping notification')
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
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/inbox/${conversationId}"
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
      console.error('[Email] Resend API error:', error)
      return
    }

    console.log(`[Email] Application accepted email sent to ${candidateEmail}, id: ${data?.id}`)
  } catch (error) {
    console.error('[Email] Failed to send application accepted email:', error)
  }
}

/**
 * Sends an email notification when a new message is received in a conversation.
 * Fire-and-forget: errors are logged but don't block the main flow.
 */
export async function sendNewMessageEmail({
  recipientEmail,
  recipientName,
  senderName,
  messagePreview,
  conversationId,
  isEmployerRecipient,
  employerId,
}: NewMessageEmailParams): Promise<void> {
  console.log(`[Email] sendNewMessageEmail called - to: ${recipientEmail}, from: ${senderName}`)

  if (!resend) {
    console.warn('[Email] Resend not configured (RESEND_API_KEY missing), skipping email notification')
    return
  }

  if (!recipientEmail) {
    console.warn('[Email] No recipient email provided, skipping notification')
    return
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const viewUrl = isEmployerRecipient
    ? `${baseUrl}/org/${employerId}/inbox/${conversationId}`
    : `${baseUrl}/dashboard/inbox/${conversationId}`

  const truncatedPreview = messagePreview.length > 150
    ? messagePreview.slice(0, 150) + '...'
    : messagePreview

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: `New message from ${senderName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">New Message</h2>
          <p>Hi ${recipientName || 'there'},</p>
          <p><strong>${senderName}</strong> sent you a message:</p>
          <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0; color: #333;">"${truncatedPreview}"</p>
          </div>
          <a href="${viewUrl}"
             style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
            View Conversation
          </a>
          <p style="color: #666; margin-top: 24px; font-size: 14px;">
            You're receiving this email because you have an active conversation on our platform.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('[Email] Resend API error:', error)
      return
    }

    console.log(`[Email] New message email sent to ${recipientEmail}, id: ${data?.id}`)
  } catch (error) {
    console.error('[Email] Failed to send new message email:', error)
  }
}
