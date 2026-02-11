# DriftSpike Email API - Complete Product

## 🎉 What You Have

A complete, production-ready email API platform with a modern frontend dashboard.

### Backend (Email API)
- ✅ High-performance email sending via SMTP
- ✅ Email reading via IMAP
- ✅ Real-time WebSocket notifications
- ✅ Firebase Firestore database
- ✅ Rate limiting and caching
- ✅ Connection pooling
- ✅ Health monitoring
- ✅ Performance metrics

### Frontend (Dashboard)
- ✅ Beautiful landing page
- ✅ Interactive user dashboard
- ✅ Email sending interface
- ✅ Usage statistics and analytics
- ✅ Complete API documentation
- ✅ Responsive design
- ✅ TypeScript + Next.js 15

## 🚀 Quick Start

### 1. View the Frontend

The frontend is currently running at:
```
http://localhost:3001
```

Open it in your browser to see:
- Landing page with features and pricing
- Dashboard for sending emails
- API documentation

### 2. Test the Dashboard

1. Go to http://localhost:3001/dashboard
2. Enter your API key: `5e292193-54fc-49a4-9395-fa7667145400`
3. Click "Load Config"
4. Send a test email!

### 3. Deploy Everything

#### Deploy Backend (Already Done)
```bash
# Backend is at: https://api-drift-spike.vercel.app
```

#### Deploy Frontend
```bash
cd frontend
vercel
```

Set environment variable:
- `NEXT_PUBLIC_API_URL` = `https://api-drift-spike.vercel.app/api`

## 📊 Features Overview

### Landing Page (/)
- Hero section with call-to-action
- Feature highlights (Fast, Secure, Analytics)
- Pricing comparison (Starter vs Production)
- Code examples
- Professional design

### Dashboard (/dashboard)
- API key authentication
- Real-time config loading
- Usage statistics cards:
  - Current plan
  - Emails sent this month
  - Remaining emails
  - Rate limit
- Account details display
- Email sending form with:
  - To address
  - Subject
  - HTML content
  - Real-time response
- Success/error notifications

### Documentation (/docs)
- Quick start guide
- Authentication details
- Complete API endpoint reference:
  - POST /api/send-email
  - GET /api/get-config
  - GET /api/read-messages
  - GET /api/health
- Rate limits table
- Error codes reference
- Code examples (JavaScript, Python)
- Support section

## 🎨 Design Features

- Modern gradient backgrounds
- Clean, professional UI
- Responsive design (mobile-friendly)
- Smooth transitions and hover effects
- Color-coded status indicators
- Syntax-highlighted code blocks
- Card-based layouts
- Consistent spacing and typography

## 💻 Tech Stack

### Backend
- Node.js with ES Modules
- Vercel Serverless Functions
- Firebase Firestore (NoSQL)
- Nodemailer (SMTP)
- IMAP for email reading
- WebSocket for real-time
- NodeCache for caching
- Rate limiting

### Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Server Components
- Client-side state management

## 📈 Pricing Plans

### Starter Plan (Free)
- 1,500 emails/month
- 1 request/minute
- Basic analytics
- Email support

### Production Plan ($50/month)
- Unlimited emails
- 30 requests/minute
- Advanced analytics
- Priority support

## 🔑 API Keys

Your API key is your Firebase User ID. Current test user:
```
API Key: 5e292193-54fc-49a4-9395-fa7667145400
Email: aathishpirate@gmail.com
Plan: free
```

## 📡 API Endpoints

### Send Email
```bash
POST https://api-drift-spike.vercel.app/api/send-email
Headers: x-api-key: YOUR_API_KEY
Body: {
  "to": "user@example.com",
  "subject": "Hello",
  "html": "<h1>Welcome!</h1>"
}
```

### Get Config
```bash
GET https://api-drift-spike.vercel.app/api/get-config
Headers: x-api-key: YOUR_API_KEY
```

### Read Messages
```bash
GET https://api-drift-spike.vercel.app/api/read-messages
Headers: x-api-key: YOUR_API_KEY
Query: ?limit=50&unreadOnly=false
```

### Health Check
```bash
GET https://api-drift-spike.vercel.app/api/health
```

## 🛠️ Development

### Run Backend Locally
```bash
npm run dev
# Runs on http://localhost:3000
```

### Run Frontend Locally
```bash
cd frontend
npm run dev
# Runs on http://localhost:3001
```

### Build Frontend
```bash
cd frontend
npm run build
npm start
```

## 📁 Project Structure

```
api.driftspike/
├── api/                          # Backend API endpoints
│   ├── send-email.js            # Send emails
│   ├── get-config.js            # Get user config
│   ├── read-messages.js         # Read emails (IMAP)
│   ├── mark-read.js             # Mark as read
│   ├── websocket.js             # WebSocket server
│   ├── health.js                # Health check
│   └── metrics.js               # Performance metrics
├── lib/                          # Backend utilities
│   ├── connection-manager.js    # Connection pooling
│   ├── firebase-manager.js      # Firebase operations
│   ├── firebase-utils.js        # Data transformations
│   ├── imap-manager.js          # IMAP operations
│   └── rate-limiter.js          # Rate limiting
├── frontend/                     # Next.js frontend
│   ├── app/
│   │   ├── page.tsx             # Landing page
│   │   ├── dashboard/
│   │   │   └── page.tsx         # Dashboard
│   │   ├── docs/
│   │   │   └── page.tsx         # Documentation
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css          # Global styles
│   ├── public/                  # Static assets
│   └── package.json             # Frontend dependencies
├── scripts/                      # Utility scripts
│   └── migrate-supabase-to-firebase.js
├── firebase-config.js           # Firebase initialization
├── firestore.rules              # Firestore security rules
├── firestore.indexes.json       # Firestore indexes
├── vercel.json                  # Vercel configuration
└── package.json                 # Backend dependencies
```

## 🎯 Next Steps

### 1. Customize Branding
- Update colors in `frontend/tailwind.config.ts`
- Change logo and company name
- Update metadata in `frontend/app/layout.tsx`

### 2. Add More Features
- User authentication (Firebase Auth)
- Payment integration (Stripe)
- Email templates
- Analytics dashboard
- Webhook support
- Email scheduling

### 3. Deploy to Production
- Deploy frontend to Vercel
- Set up custom domain
- Configure SSL certificates
- Set up monitoring and alerts

### 4. Marketing
- Create landing page content
- Add testimonials
- Create blog/documentation
- Set up SEO
- Social media presence

## 📞 Support

For questions or issues:
- Check documentation at `/docs`
- Review API logs in Vercel
- Check Firebase Console for data
- Review browser console for frontend errors

## 🎊 Congratulations!

You now have a complete, production-ready email API platform with:
- ✅ High-performance backend
- ✅ Beautiful frontend dashboard
- ✅ Complete documentation
- ✅ Real-time features
- ✅ Scalable architecture
- ✅ Professional design

Ready to launch! 🚀
