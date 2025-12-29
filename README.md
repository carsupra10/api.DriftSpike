# Vercel Email API Service

A Vercel-based API service that sends emails with Supabase user verification and rate limiting.

## Features

- ✅ User verification via Supabase
- ✅ Premium/Free plan checking  
- ✅ Free user email limit (3000/month)
- ✅ Dynamic SMTP configuration (inline or stored)
- ✅ Email attachments support
- ✅ API key authentication

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a new Supabase project
   - Run the SQL in `supabase-schema.sql` to create the required tables
   - Get your Supabase URL and anon key

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase credentials and API key.

4. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

## API Endpoints

### Send Email
**Endpoint:** `POST /api/email/send`

**Headers:**
- `x-api-key`: Your API key
- `Content-Type`: application/json

**Body Options:**

**Option 1: Use stored SMTP config by name**
```json
{
  "to": "recipient@example.com",
  "subject": "Your subject",
  "html": "<h1>Your HTML content</h1>",
  "smtpConfigName": "Gmail Default"
}
```

**Option 2: Use default SMTP config (automatic)**
```json
{
  "to": "recipient@example.com",
  "subject": "Your subject", 
  "html": "<h1>Your HTML content</h1>"
}
```

**Option 3: Inline SMTP config**
```json
{
  "to": "recipient@example.com",
  "subject": "Your subject",
  "html": "<h1>Your HTML content</h1>",
  "smtpConfig": {
    "SMTP_HOST": "smtp.gmail.com",
    "SMTP_PORT": 587,
    "SMTP_SECURE": false,
    "SMTP_USER": "your-email@gmail.com", 
    "SMTP_PASS": "your-app-password",
    "FROM_NAME": "Your Company"
  }
}
```

### SMTP Configuration Management
**Endpoint:** `/api/smtp/config`

- `GET ?userEmail=email` - List SMTP configs
- `POST ?userEmail=email` - Create SMTP config
- `PUT ?userEmail=email&configId=id` - Update SMTP config  
- `DELETE ?userEmail=email&configId=id` - Delete SMTP config

## Email Attachments

Add attachments using base64 encoded content:

```json
{
  "to": "recipient@example.com",
  "subject": "Email with attachment",
  "html": "<h1>Hello</h1>",
  "attachments": [
    {
      "filename": "document.pdf",
      "content": "base64-encoded-content",
      "contentType": "application/pdf"
    }
  ]
}
```

## Response Format

**Success:**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "user": {
    "email": "user@example.com",
    "plan": "free", 
    "emails_sent": 1
  }
}
```

**Error Responses:**
- `401`: Invalid API key
- `404`: User not found or SMTP config not found
- `429`: Email limit exceeded (free users)
- `500`: Server error