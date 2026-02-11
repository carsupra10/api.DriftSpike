# DriftSpike Email API - Frontend

Modern Next.js dashboard for the DriftSpike Email API.

## Features

- 🎨 Beautiful, responsive UI with Tailwind CSS
- 📊 Real-time dashboard with usage statistics
- 📧 Send test emails directly from the browser
- 📖 Complete API documentation
- ⚡ Built with Next.js 15 and TypeScript

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
# For production: https://api-drift-spike.vercel.app/api
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## Pages

- **Home** (`/`) - Landing page with features and pricing
- **Dashboard** (`/dashboard`) - User dashboard for sending emails and viewing stats
- **Docs** (`/docs`) - Complete API documentation

## Usage

1. Go to the Dashboard page
2. Enter your API Key (Firebase User ID)
3. Click "Load Config" to fetch your account details
4. Send test emails using the form

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Set the environment variable:
- `NEXT_PUBLIC_API_URL` - Your API URL

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- React 19

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx           # Landing page
│   ├── dashboard/
│   │   └── page.tsx       # Dashboard
│   ├── docs/
│   │   └── page.tsx       # Documentation
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── public/                # Static assets
└── .env.local            # Environment variables
```

## API Integration

The frontend connects to your DriftSpike Email API:

- `GET /api/get-config` - Fetch user configuration
- `POST /api/send-email` - Send emails

All requests require the `x-api-key` header with your Firebase User ID.

## Customization

### Update API URL

Edit `.env.local`:

```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

### Styling

The app uses Tailwind CSS. Customize colors in `tailwind.config.ts`.

## License

MIT
