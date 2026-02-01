This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Email Notifications (Resend)

Email notifications are sent for:
- **New applications** - Employer receives email when a candidate applies
- **Application accepted** - Candidate receives email when employer accepts their application

### Development Setup
Add to `.env.local`:
```
RESEND_API_KEY=re_xxxxxxxxxxxx
```

**Note:** With Resend's test domain (`notifications@resend.dev`), emails can only be sent to the email address associated with your Resend account. To test emails to other recipients, you must verify a domain first.

### Production Checklist
Before going to production with email:

1. **Verify your domain** in [Resend dashboard](https://resend.com/domains) (e.g., `yourdomain.com`)
2. **Add DNS records** - SPF, DKIM, and DMARC records as provided by Resend
3. **Update `FROM_EMAIL`** in `utils/email.ts` from `notifications@resend.dev` to `notifications@yourdomain.com`
4. **Set `NEXT_PUBLIC_APP_URL`** environment variable to your production URL (ensures email links work correctly)
5. **Use production API key** - Replace test key with production key in environment variables

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
