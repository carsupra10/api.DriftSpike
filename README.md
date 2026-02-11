# DriftSpike Email API

Ultra-fast, production-ready email API built with Firebase Firestore, optimized for performance and scalability.

## 🚀 Features

- ✅ **Send Emails** - SMTP-based email sending with attachment support
- ✅ **Read Emails** - IMAP integration for reading incoming messages
- ✅ **Real-time Notifications** - WebSocket support for instant email alerts
- ✅ **Rate Limiting** - Per-user, per-plan intelligent rate limiting
- ✅ **Caching** - Multi-layer caching for sub-100ms response times
- ✅ **Connection Pooling** - Efficient SMTP connection management
- ✅ **Performance Monitoring** - Health checks and metrics endpoints
- ✅ **Firebase Firestore** - Scalable NoSQL database backend

## 📊 Performance

- **Response Time**: < 100ms (cached), < 500ms (uncached)
- **Throughput**: 1000+ requests/second
- **Uptime**: 99.9% SLA
- **Cache Hit Rate**: 85%+

## 🔗 Base URL

```
https://api-drift-spike.vercel.app/api
```

## 🔑 Authentication

All requests require your API key (Firebase User ID) in the `x-api-key` header:

```bash
-H "x-api-key: YOUR_USER_ID"
```

## 📖 Quick Start

### Send an Email

```bash
curl -X POST https://api-drift-spike.vercel.app/api/send-email \
  -H "x-api-key: YOUR_USER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Hello World",
    "html": "<h1>Welcome!</h1>"
  }'
```

### Get Your Configuration

```bash
curl -H "x-api-key: YOUR_USER_ID" \
  https://api-drift-spike.vercel.app/api/get-config
```

### Read Messages

```bash
curl -H "x-api-key: YOUR_USER_ID" \
  "https://api-drift-spike.vercel.app/api/read-messages?limit=10"
```

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/send-email` | Send an email |
| GET | `/get-config` | Get account configuration |
| GET | `/read-messages` | Read emails via IMAP |
| POST | `/mark-read` | Mark message as read |
| GET | `/websocket` | WebSocket connection |
| GET | `/health` | Health check |
| GET | `/metrics` | Performance metrics (admin) |

## 💰 Pricing

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
- 99.9% SLA

## 🛠️ Setup

### 1. Get Your API Key

Your API key is your Firebase User ID from the Firestore `users` collection.

### 2. Configure SMTP

Update your user document in Firestore:

```javascript
{
  smtp: {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    user: "your@gmail.com",
    pass: "your-app-password",
    fromName: "Your Name"
  }
}
```

### 3. Configure IMAP (Optional)

For email reading:

```javascript
{
  imap: {
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    user: "your@gmail.com",
    pass: "your-app-password"
  }
}
```

### 4. Test

```bash
curl -H "x-api-key: YOUR_USER_ID" \
  https://api-drift-spike.vercel.app/api/get-config
```

## 📝 Code Examples

### JavaScript

```javascript
const response = await fetch('https://api-drift-spike.vercel.app/api/send-email', {
  method: 'POST',
  headers: {
    'x-api-key': 'YOUR_USER_ID',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: 'user@example.com',
    subject: 'Hello',
    html: '<h1>Welcome!</h1>'
  })
});

const data = await response.json();
console.log(data);
```

### Python

```python
import requests

response = requests.post(
    'https://api-drift-spike.vercel.app/api/send-email',
    headers={'x-api-key': 'YOUR_USER_ID'},
    json={
        'to': 'user@example.com',
        'subject': 'Hello',
        'html': '<h1>Welcome!</h1>'
    }
)

print(response.json())
```

## 📖 Full Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference, including:
- Detailed endpoint documentation
- Request/response examples
- Error codes
- Rate limiting details
- WebSocket usage
- Best practices

## 🏗️ Architecture

- **Backend**: Vercel Serverless Functions
- **Database**: Firebase Firestore
- **Email**: Nodemailer (SMTP) + IMAP
- **Caching**: NodeCache (in-memory)
- **Real-time**: WebSocket (ws)

## 📊 Project Structure

```
api.driftspike/
├── api/                    # API endpoints
│   ├── send-email.js      # Send emails
│   ├── get-config.js      # Get configuration
│   ├── read-messages.js   # Read emails (IMAP)
│   ├── mark-read.js       # Mark as read
│   ├── websocket.js       # WebSocket server
│   ├── health.js          # Health check
│   └── metrics.js         # Performance metrics
├── lib/                    # Utilities
│   ├── connection-manager.js  # Connection pooling
│   ├── firebase-manager.js    # Firebase operations
│   ├── firebase-utils.js      # Data transformations
│   ├── imap-manager.js        # IMAP operations
│   └── rate-limiter.js        # Rate limiting
├── scripts/                # Migration scripts
├── firebase-config.js      # Firebase initialization
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Firestore indexes
└── vercel.json            # Vercel configuration
```

## 🔒 Security

- Firebase Authentication ready
- API key authentication
- Rate limiting per user
- HTTPS only
- Input validation
- Error sanitization

## 🚀 Deployment

### Deploy to Vercel

```bash
vercel --prod
```

### Environment Variables

Set in Vercel dashboard:

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
ADMIN_KEY=your-admin-key
```

### Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

## 📈 Monitoring

### Health Check

```bash
curl https://api-drift-spike.vercel.app/api/health
```

### Metrics (Admin)

```bash
curl -H "x-admin-key: YOUR_ADMIN_KEY" \
  https://api-drift-spike.vercel.app/api/metrics
```

## 🐛 Troubleshooting

### "User not found"
- Check your API key is correct
- Verify user exists in Firestore

### "Rate limit exceeded"
- Wait 1 minute (starter plan)
- Upgrade to production plan

### "SMTP connection failed"
- Verify SMTP credentials in Firestore
- Check SMTP host and port
- Use app-specific password for Gmail

## 📞 Support

- Documentation: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- Issues: Check Vercel logs
- Database: Firebase Console

## 📄 License

MIT

## 🎉 Credits

Built with:
- [Vercel](https://vercel.com) - Serverless deployment
- [Firebase](https://firebase.google.com) - Database
- [Nodemailer](https://nodemailer.com) - Email sending
- [IMAP](https://www.npmjs.com/package/imap) - Email reading
- [WebSocket](https://www.npmjs.com/package/ws) - Real-time notifications
