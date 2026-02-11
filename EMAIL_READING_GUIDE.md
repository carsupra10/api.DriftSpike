# Email Reading & Real-Time Notifications Guide

## 🚀 Overview

This system allows you to:
1. **Read emails** from your inbox via IMAP
2. **Mark messages as read**
3. **Receive real-time notifications** via WebSocket when new emails arrive

---

## 📋 Prerequisites

### 1. Configure IMAP Settings in Database

Update your user record with IMAP credentials:

```sql
UPDATE users 
SET 
  imap_host = 'imap.gmail.com',
  imap_port = 993,
  imap_secure = true,
  imap_user = 'your-email@gmail.com',
  imap_pass = 'your-app-password'
WHERE id = 'your-user-id';
```

### 2. Gmail App Password Setup

For Gmail users:
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Generate an App Password
4. Use this password for `imap_pass`

---

## 📧 API Endpoints

### 1. Read Messages

**GET** `/api/read-messages`

Fetch emails from your inbox.

**Headers:**
- `x-api-key`: Your user ID

**Query Parameters:**
- `limit` (optional): Number of messages to fetch (default: 50)
- `unreadOnly` (optional): true/false (default: false)
- `mailbox` (optional): Mailbox name (default: INBOX)

**Example:**
```bash
curl -H "x-api-key: 5e292193-54fc-49a4-9395-fa7667145400" \
  "https://api-drift-spike.vercel.app/api/read-messages?limit=10&unreadOnly=true"
```

**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "id": 12345,
      "seqno": 1,
      "flags": ["\\Seen"],
      "date": "2025-12-29T10:00:00Z",
      "from": "sender@example.com",
      "to": "you@example.com",
      "subject": "Hello World",
      "text": "Email body text...",
      "html": "<p>Email body HTML...</p>",
      "attachments": [
        {
          "filename": "document.pdf",
          "contentType": "application/pdf",
          "size": 12345
        }
      ],
      "unread": false
    }
  ],
  "count": 10,
  "mailbox": "INBOX",
  "performance": {
    "responseTime": "1234ms",
    "cached": false
  }
}
```

---

### 2. Mark Message as Read

**POST** `/api/mark-read`

Mark a specific message as read.

**Headers:**
- `x-api-key`: Your user ID
- `Content-Type`: application/json

**Body:**
```json
{
  "messageId": 12345
}
```

**Example:**
```bash
curl -X POST https://api-drift-spike.vercel.app/api/mark-read \
  -H "x-api-key: 5e292193-54fc-49a4-9395-fa7667145400" \
  -H "Content-Type: application/json" \
  -d '{"messageId": 12345}'
```

**Response:**
```json
{
  "success": true,
  "message": "Message marked as read",
  "messageId": 12345,
  "performance": {
    "responseTime": "456ms"
  }
}
```

---

## 🔌 WebSocket Real-Time Notifications

### Connection

Connect to WebSocket for real-time email notifications:

**WebSocket URL:** `wss://api-drift-spike.vercel.app/ws?userId=YOUR_USER_ID`

**Alternative:** Send `x-api-key` header instead of query parameter

### JavaScript Example

```javascript
// Connect to WebSocket
const ws = new WebSocket('wss://api-drift-spike.vercel.app/ws?userId=YOUR_USER_ID');

// Connection opened
ws.onopen = () => {
  console.log('Connected to email notifications');
};

// Listen for messages
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'connected') {
    console.log('Successfully connected!');
  }
  
  if (data.type === 'new_messages') {
    console.log(`${data.count} new messages received!`);
    data.messages.forEach(msg => {
      console.log(`From: ${msg.from}`);
      console.log(`Subject: ${msg.subject}`);
      console.log(`Body: ${msg.text}`);
    });
    
    // Show browser notification
    if (Notification.permission === 'granted') {
      new Notification('New Email', {
        body: `${data.count} new message(s)`,
        icon: '/email-icon.png'
      });
    }
  }
};

// Keep connection alive with ping
setInterval(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'ping' }));
  }
}, 30000);

// Handle errors
ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

// Handle disconnection
ws.onclose = () => {
  console.log('Disconnected from email notifications');
  // Implement reconnection logic here
};
```

### Message Types

**1. Connected Message**
```json
{
  "type": "connected",
  "message": "WebSocket connected successfully",
  "userId": "your-user-id"
}
```

**2. New Messages Notification**
```json
{
  "type": "new_messages",
  "count": 2,
  "messages": [
    {
      "id": 12345,
      "from": "sender@example.com",
      "subject": "New Email",
      "text": "Email body...",
      "unread": true
    }
  ],
  "timestamp": "2025-12-29T10:00:00Z"
}
```

**3. Pong Response**
```json
{
  "type": "pong",
  "timestamp": 1735473600000
}
```

---

## 🎯 Complete Workflow Example

### 1. Initial Setup

```javascript
// Initialize WebSocket connection
const userId = '5e292193-54fc-49a4-9395-fa7667145400';
const ws = new WebSocket(`wss://api-drift-spike.vercel.app/ws?userId=${userId}`);

ws.onopen = () => {
  console.log('✅ Connected to real-time notifications');
  
  // Fetch initial messages
  fetchMessages();
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'new_messages') {
    handleNewMessages(data.messages);
  }
};
```

### 2. Fetch Messages

```javascript
async function fetchMessages() {
  const response = await fetch(
    'https://api-drift-spike.vercel.app/api/read-messages?limit=20&unreadOnly=true',
    {
      headers: {
        'x-api-key': userId
      }
    }
  );
  
  const data = await response.json();
  displayMessages(data.messages);
}
```

### 3. Handle New Messages

```javascript
function handleNewMessages(messages) {
  messages.forEach(msg => {
    // Display notification
    showNotification(msg);
    
    // Add to message list
    addMessageToUI(msg);
    
    // Play sound
    playNotificationSound();
  });
}
```

### 4. Mark as Read

```javascript
async function markAsRead(messageId) {
  const response = await fetch(
    'https://api-drift-spike.vercel.app/api/mark-read',
    {
      method: 'POST',
      headers: {
        'x-api-key': userId,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messageId })
    }
  );
  
  const data = await response.json();
  console.log('Marked as read:', data);
}
```

---

## 🔧 Advanced Features

### Auto-Reconnection

```javascript
let ws;
let reconnectInterval = 5000;

function connect() {
  ws = new WebSocket(`wss://api-drift-spike.vercel.app/ws?userId=${userId}`);
  
  ws.onopen = () => {
    console.log('Connected');
    reconnectInterval = 5000; // Reset interval
  };
  
  ws.onclose = () => {
    console.log('Disconnected, reconnecting...');
    setTimeout(connect, reconnectInterval);
    reconnectInterval = Math.min(reconnectInterval * 2, 60000); // Exponential backoff
  };
  
  ws.onmessage = handleMessage;
}

connect();
```

### Browser Notifications

```javascript
// Request permission
if (Notification.permission === 'default') {
  Notification.requestPermission();
}

// Show notification
function showNotification(message) {
  if (Notification.permission === 'granted') {
    new Notification('New Email', {
      body: `From: ${message.from}\n${message.subject}`,
      icon: '/email-icon.png',
      badge: '/badge-icon.png',
      tag: message.id,
      requireInteraction: false
    });
  }
}
```

### Message Filtering

```javascript
// Fetch only unread messages from specific sender
async function fetchFilteredMessages() {
  const response = await fetch(
    'https://api-drift-spike.vercel.app/api/read-messages?unreadOnly=true&limit=50',
    {
      headers: { 'x-api-key': userId }
    }
  );
  
  const data = await response.json();
  
  // Filter by sender
  const filtered = data.messages.filter(msg => 
    msg.from.includes('important@example.com')
  );
  
  return filtered;
}
```

---

## 📊 Performance Tips

1. **Caching**: Messages are cached for 5 minutes. Subsequent requests within this window are instant.

2. **Rate Limiting**: 
   - Starter: 1 request/minute
   - Production: 30 requests/minute

3. **WebSocket Keep-Alive**: Send ping every 30 seconds to maintain connection.

4. **Batch Operations**: Fetch multiple messages at once instead of individual requests.

5. **Unread Only**: Use `unreadOnly=true` to reduce data transfer.

---

## 🛠️ Troubleshooting

### Connection Issues

**Problem**: WebSocket won't connect

**Solutions**:
- Check if IMAP is configured in database
- Verify user ID is correct
- Check firewall/proxy settings
- Ensure WebSocket protocol is allowed

### IMAP Authentication Failed

**Problem**: "IMAP not configured" or authentication errors

**Solutions**:
- Verify IMAP credentials in database
- For Gmail: Use App Password, not regular password
- Check if IMAP is enabled in email provider settings
- Verify host and port are correct

### No New Message Notifications

**Problem**: WebSocket connected but no notifications

**Solutions**:
- Check if IMAP listener is running
- Verify email provider supports IDLE command
- Check server logs for errors
- Try disconnecting and reconnecting

---

## 🔐 Security Notes

1. **API Keys**: Never expose your API key in client-side code
2. **HTTPS/WSS**: Always use secure connections
3. **App Passwords**: Use app-specific passwords, not main account passwords
4. **Rate Limiting**: Respect rate limits to avoid being blocked
5. **Data Privacy**: Email content is not stored on our servers

---

## 📱 Mobile App Integration

### React Native Example

```javascript
import { useEffect, useState } from 'react';

function useEmailNotifications(userId) {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(`wss://api-drift-spike.vercel.app/ws?userId=${userId}`);

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_messages') {
        setMessages(prev => [...data.messages, ...prev]);
      }
    };

    return () => ws.close();
  }, [userId]);

  return { messages, connected };
}
```

---

## 🎉 Complete Example

See `examples/websocket-client.html` for a complete working example with UI.

To use:
1. Open the HTML file in a browser
2. Enter your User ID
3. Click "Connect"
4. Receive real-time notifications when new emails arrive!

---

## 📞 Support

For issues or questions:
- Check API health: `GET /api/health`
- View metrics: `GET /api/metrics` (admin only)
- Review logs in Vercel dashboard