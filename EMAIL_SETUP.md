# Email Setup Guide for GrowButtler

## Current Status
✅ Email templates created (booking confirmations, expert notifications, etc.)
✅ Mock mode working (emails log to console when API key is missing)
⏳ Resend API key needed for actual email delivery

## Quick Setup (5 minutes)

### Step 1: Get Resend API Key

1. **Sign up at Resend**: https://resend.com/signup
2. **Create API Key**:
   - Go to Dashboard → API Keys
   - Click "Create API Key"
   - Name it "GrowButtler Production"
   - Copy the key (starts with `re_`)

### Step 2: Add to Environment Variables

Add to `/workspace/group/growbuttler-landing/.env.local`:

```bash
# Resend Email Configuration
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=GrowButtler <onboarding@resend.dev>
```

**Note**: Free tier uses `onboarding@resend.dev` as sender. To use your own domain, see "Domain Verification" below.

### Step 3: Restart Dev Server

```bash
npm run dev
```

### Step 4: Test

Create a booking or expert application - you should receive actual emails!

---

## Domain Verification (Optional - For Custom Sender)

To send emails from `noreply@felixseeger.de` instead of `onboarding@resend.dev`:

1. **Add Domain in Resend**:
   - Dashboard → Domains → Add Domain
   - Enter: `felixseeger.de`

2. **Add DNS Records**:
   Copy the DNS records provided by Resend and add them to your domain's DNS settings (wherever you manage `felixseeger.de`).

3. **Wait for Verification**:
   Usually takes 5-15 minutes for DNS to propagate.

4. **Update .env.local**:
   ```bash
   EMAIL_FROM=GrowButtler <noreply@felixseeger.de>
   ```

---

## Email Templates Implemented

### 1. **Booking Confirmation (Customer)**
- Sent to customer after booking
- Includes: date, time, expert name, notes
- CTA: "View Dashboard"

### 2. **Booking Notification (Expert)**
- Sent to expert when someone books them
- Includes: customer contact info, date, time, notes
- Action: Contact customer to confirm

### 3. **Booking Notification (Admin)**
- Sent to felix@felixseeger.de for all bookings
- Includes: all booking details
- Link to WordPress admin

### 4. **Expert Application Received**
- Sent to applicant confirming application received
- Next step: video interview

### 5. **Expert Application (Admin)**
- Sent to felix@felixseeger.de for new applications
- Includes: applicant details, portfolio
- Link to WordPress admin

### 6. **Expert Approved**
- Sent when expert application is approved
- Link to their live profile

### 7. **Welcome Email**
- Sent to new users on signup
- CTA: "Go to Dashboard"

---

## Testing Emails

### Current Mock Mode (No API Key)
When `RESEND_API_KEY` is not set, emails are logged to server console:

```
--- EMAIL MOCK (NO API KEY) ---
To: customer@example.com
Subject: Booking Confirmed: Consultation with John Doe
------------------------------
```

Check the terminal/logs to see email content.

### With API Key
Emails are actually sent via Resend. Check your inbox!

---

## Troubleshooting

### Emails not arriving?
1. **Check spam folder**
2. **Verify API key** is correct in `.env.local`
3. **Check Resend dashboard** → Logs for delivery status
4. **Free tier limits**: 100 emails/day, 3,000/month

### Want to test without real emails?
Keep `RESEND_API_KEY` unset - all emails will be mocked and logged to console.

### Need to see email HTML?
Check server logs - the mock mode shows the full email content.

---

## Environment Variables Reference

```bash
# Required for actual email sending
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Optional - defaults shown
EMAIL_FROM=GrowButtler <onboarding@resend.dev>  # Or use custom domain after verification
NEXT_PUBLIC_BASE_URL=https://growbuttler.felixseeger.de  # For email links
BACKEND_URL=https://growbuttler-back.felixseeger.de  # For admin links in emails
```

---

## Next Steps

1. ✅ Get Resend API key
2. ✅ Add to `.env.local`
3. ✅ Test booking flow
4. ⏳ (Optional) Verify domain for custom sender
5. ⏳ (Optional) Set up email templates in Resend dashboard for easier editing
