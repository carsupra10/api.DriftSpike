# DriftSpike Email API - Complete Setup Guide

## Project Structure

```
api.driftspike/
├── api/                    # Backend API endpoints (Vercel serverless)
├── lib/                    # Backend utilities
├── frontend/               # Next.js frontend dashboard
├── scripts/                # Migration and utility scripts
└── docs/                   # Documentation
```

## Backend (Email API)

The backend is a high-performance email API built with:
- Vercel Serverless Functions
- Firebase Firestore
- SMTP connection pooling
- Rate limiting and caching

### Backend Deployment

1. **Set Vercel Environment Variables:**
   ```bash
   vercel env add FIREBASE_PROJECT_ID production
   vercel env add FIREBASE_CLIENT_EMAIL production
   vercel env add FIREBASE_PRIVATE_KEY production
   vercel env add ADMIN_KEY production
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **API will be available at:**
   ```
   https://api-drift-spike.vercel.app/api
   ```

## Frontend (Dashboard)

The frontend is a modern Next.js application with:
- User dashboard
- Email sending interface
- API documentation
- Usage analytics

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   
   Create `frontend/.env.local`:
   ```bash
   # For local development (if running API locally)
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   
   # For production (using deployed API)
   NEXT_PUBLIC_API_URL=https://api-drift-spike.vercel.app/api
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```
   
   Frontend will be available at: http://localhost:3001

5. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

### Frontend Deployment

Deploy to Vercel:

```bash
cd frontend
vercel
```

Set environment variable in Vercel dashboard:
- `NEXT_PUBLIC_API_URL` = `https://api-drift-spike.vercel.app/api`

## Complete Development Workflow

### 1. Run Backend Locally (Optional)

```bash
# In root directory
npm run dev
```

Backend runs on: http://localhost:3000

### 2. Run Frontend

```bash
# In frontend directory
cd frontend
npm run dev
```

Frontend runs on: http://localhost:3001

### 3. Test the Integration

1. Open http://localhost:3001
2. Go to Dashboard
3. Enter your API Key (Firebase User ID)
4. Send test emails

## API Keys

Your API key is your Firebase User ID. You can find it:
1. In Firebase Console → Firestore → users collection
2. Or by querying your user in the database

Example API Key: `5e292193-54fc-49a4-9395-fa7667145400`

## Features

### Backend Features
- ✅ Send emails via SMTP
- ✅ Read emails via IMAP
- ✅ WebSocket real-time notifications
- ✅ Rate limiting (1 req/min starter, 30 req/min production)
- ✅ Connection pooling
- ✅ Multi-layer caching
- ✅ Health monitoring
- ✅ Performance metrics

### Frontend Features
- ✅ Beautiful landing page
- ✅ Interactive dashboard
- ✅ Send test emails
- ✅ View usage statistics
- ✅ API documentation
- ✅ Responsive design
- ✅ Real-time updates

## Tech Stack

### Backend
- Node.js + ES Modules
- Vercel Serverless Functions
- Firebase Firestore
- Nodemailer (SMTP)
- IMAP for email reading
- WebSocket for real-time
- NodeCache for caching

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Server Components

## Pricing Plans

### Starter (Free)
- 1,500 emails/month
- 1 request/minute
- Basic analytics
- Email support

### Production ($50/month)
- Unlimited emails
- 30 requests/minute
- Advanced analytics
- Priority support

## API Endpoints

### Send Email
```bash
POST /api/send-email
Headers: x-api-key: YOUR_API_KEY
Body: { to, subject, html, attachments? }
```

### Get Config
```bash
GET /api/get-config
Headers: x-api-key: YOUR_API_KEY
```

### Read Messages
```bash
GET /api/read-messages?limit=50&unreadOnly=false
Headers: x-api-key: YOUR_API_KEY
```

### Health Check
```bash
GET /api/health
```

### Metrics (Admin)
```bash
GET /api/metrics
Headers: x-admin-key: YOUR_ADMIN_KEY
```

## Troubleshooting

### Backend Issues

**"User not found"**
- Check your API key is correct
- Verify user exists in Firebase Firestore

**"Rate limit exceeded"**
- Wait 1 minute (starter plan)
- Upgrade to production plan

**"SMTP connection failed"**
- Verify SMTP credentials in Firestore
- Check SMTP host and port

### Frontend Issues

**"Failed to fetch config"**
- Check NEXT_PUBLIC_API_URL is set correctly
- Verify API is running and accessible
- Check CORS settings

**Blank dashboard**
- Enter valid API key
- Check browser console for errors

## Support

For issues or questions:
- Check documentation: http://localhost:3001/docs
- Review API logs in Vercel dashboard
- Check Firebase Firestore for data

## License

MIT
