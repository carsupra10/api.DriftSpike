# Vercel Email API Service

A simplified Vercel-based API service that sends emails with Supabase user verification and rate limiting.

## Features

- ✅ User verification via Supabase user ID (as API key)
- ✅ Premium/Free plan checking  
- ✅ Free user email limit (3000/month), Premium users unlimited
- ✅ One SMTP configuration per user (stored in database)
- ✅ Email attachments support
- ✅ Simple authentication using user ID

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a new Supabase project
   - Run the SQL in `supabase-schema.sql` to create the users table
   - Get your Supabase URL and anon key

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase credentials.

4. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

## API Endpoints

### Send Email
**Endpoint:** `POST /api/email/send`

**Headers:**
- `x-api-key`: Supabase user ID
- `Content-Type`: application/json

**Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Your subject",
  "html": "<h1>Your HTML content</h1>",
  "attachments": [
    {
      "filename": "document.pdf",
      "content": "base64-encoded-content",
      "contentType": "application/pdf"
    }
  ]
}
```

### Get User SMTP Config
**Endpoint:** `GET /api/smtp/config`

**Headers:**
- `x-api-key`: Supabase user ID

**Returns user info and SMTP configuration (password excluded for security)**

## Example Usage

### Send Simple Email
```bash
curl -X POST https://your-vercel-app.vercel.app/api/email/send \
  -H "x-api-key: 5e292193-54fc-49a4-9395-fa7667145400" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "aathishpirate@gmail.com",
    "subject": "Hello from API",
    "html": "<h1>Hello!</h1><p>This email was sent via API.</p>"
  }'
```

### Send Email with Attachment
```bash
curl -X POST https://your-vercel-app.vercel.app/api/email/send \
  -H "x-api-key: 5e292193-54fc-49a4-9395-fa7667145400" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "aathishpirate@gmail.com",
    "subject": "Email with Attachment",
    "html": "<h1>Hello!</h1><p>This email has an attachment.</p>",
    "attachments": [
      {
        "filename": "hello.txt",
        "content": "SGVsbG8gV29ybGQh",
        "contentType": "text/plain"
      }
    ]
  }'
```

### Get User SMTP Configuration
```bash
curl -H "x-api-key: 5e292193-54fc-49a4-9395-fa7667145400" \
  "https://your-vercel-app.vercel.app/api/smtp/config"
```

## Response Format

**Success:**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "user": {
    "id": "5e292193-54fc-49a4-9395-fa7667145400",
    "email": "aathishpirate@gmail.com",
    "plan": "free", 
    "emails_sent": 1,
    "smtp_from": "Company No-Reply"
  }
}
```

**Error Responses:**
- `401`: Missing or invalid API key (user ID)
- `404`: User not found
- `429`: Email limit exceeded (free users only)
- `500`: Server error

## Sample User IDs (API Keys)

For testing, use these user IDs as x-api-key:

- **Free User:** `5e292193-54fc-49a4-9395-fa7667145400` (aathishpirate@gmail.com)
- **Premium User:** `6f3a2194-65gd-50b5-a406-gb8778256511` (premium@example.com)  
- **Limit Reached:** `7g4b3295-76he-61c6-b517-hc9889367622` (limit@example.com)# Updated Mon Dec 29 17:53:39 IST 2025
# Updated Mon Dec 29 17:59:17 IST 2025
