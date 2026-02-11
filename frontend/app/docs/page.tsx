'use client';

import Link from 'next/link';

export default function Docs() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">DriftSpike</span>
              <span className="ml-2 text-sm text-gray-500">Documentation</span>
            </Link>
            <div className="flex gap-4">
              <Link href="/" className="text-gray-700 hover:text-indigo-600">
                Home
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">API Documentation</h1>

        {/* Quick Start */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
          <p className="text-gray-600 mb-4">
            Get started with DriftSpike Email API in minutes. All you need is your API key.
          </p>
          <div className="bg-gray-900 text-white p-6 rounded-lg">
            <pre className="overflow-x-auto">
              <code>{`curl -X POST https://api-drift-spike.vercel.app/api/send-email \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "user@example.com",
    "subject": "Hello World",
    "html": "<h1>Welcome!</h1>"
  }'`}</code>
            </pre>
          </div>
        </section>

        {/* Authentication */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Authentication</h2>
          <p className="text-gray-600 mb-4">
            All API requests require authentication using your API key in the <code className="bg-gray-200 px-2 py-1 rounded">x-api-key</code> header.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="text-sm">
              <strong>Your API Key:</strong> This is your Firebase user ID. You can find it in your dashboard.
            </p>
          </div>
        </section>

        {/* Endpoints */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">API Endpoints</h2>

          {/* Send Email */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded font-mono text-sm font-bold">
                POST
              </span>
              <code className="text-lg">/api/send-email</code>
            </div>
            <p className="text-gray-600 mb-4">Send an email using your configured SMTP settings.</p>
            
            <h4 className="font-bold mb-2">Request Body:</h4>
            <div className="bg-gray-900 text-white p-4 rounded mb-4">
              <pre className="text-sm overflow-x-auto">
                <code>{`{
  "to": "recipient@example.com",
  "subject": "Email subject",
  "html": "<h1>HTML content</h1>",
  "attachments": [  // Optional
    {
      "filename": "file.pdf",
      "content": "base64_encoded_content",
      "contentType": "application/pdf"
    }
  ]
}`}</code>
              </pre>
            </div>

            <h4 className="font-bold mb-2">Response:</h4>
            <div className="bg-gray-900 text-white p-4 rounded">
              <pre className="text-sm overflow-x-auto">
                <code>{`{
  "success": true,
  "message": "Email sent successfully",
  "user": {
    "id": "user-id",
    "email": "your@email.com",
    "plan": "starter",
    "emails_sent": 1
  },
  "performance": {
    "responseTime": "87ms",
    "cached": true
  }
}`}</code>
              </pre>
            </div>
          </div>

          {/* Get Config */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded font-mono text-sm font-bold">
                GET
              </span>
              <code className="text-lg">/api/get-config</code>
            </div>
            <p className="text-gray-600 mb-4">Get your account configuration and usage statistics.</p>
            
            <h4 className="font-bold mb-2">Response:</h4>
            <div className="bg-gray-900 text-white p-4 rounded">
              <pre className="text-sm overflow-x-auto">
                <code>{`{
  "user": {
    "id": "user-id",
    "email": "your@email.com",
    "plan_type": "starter",
    "emails_sent_this_month": 150
  },
  "smtp_config": {
    "smtp_host": "smtp.gmail.com",
    "smtp_port": 587,
    "from_name": "Your Name"
  },
  "limits": {
    "monthly_emails": 1500,
    "remaining_emails": 1350,
    "requests_per_minute": 1
  }
}`}</code>
              </pre>
            </div>
          </div>

          {/* Read Messages */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded font-mono text-sm font-bold">
                GET
              </span>
              <code className="text-lg">/api/read-messages</code>
            </div>
            <p className="text-gray-600 mb-4">Read emails from your inbox via IMAP.</p>
            
            <h4 className="font-bold mb-2">Query Parameters:</h4>
            <ul className="list-disc list-inside mb-4 text-gray-600">
              <li><code>limit</code> - Number of messages to fetch (default: 50)</li>
              <li><code>unreadOnly</code> - Only fetch unread messages (default: false)</li>
              <li><code>mailbox</code> - Mailbox to read from (default: INBOX)</li>
            </ul>
          </div>

          {/* Health Check */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded font-mono text-sm font-bold">
                GET
              </span>
              <code className="text-lg">/api/health</code>
            </div>
            <p className="text-gray-600">Check API health and performance metrics.</p>
          </div>
        </section>

        {/* Rate Limits */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Rate Limits</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Plan</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Requests/Min</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Monthly Emails</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-6 py-4">Starter</td>
                  <td className="px-6 py-4">1</td>
                  <td className="px-6 py-4">1,500</td>
                  <td className="px-6 py-4 font-bold">Free</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Production</td>
                  <td className="px-6 py-4">30</td>
                  <td className="px-6 py-4">Unlimited</td>
                  <td className="px-6 py-4 font-bold">$50/mo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Error Codes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Error Codes</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Code</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-6 py-4 font-mono">400</td>
                  <td className="px-6 py-4">Bad Request - Invalid parameters</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-mono">401</td>
                  <td className="px-6 py-4">Unauthorized - Invalid API key</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-mono">404</td>
                  <td className="px-6 py-4">Not Found - User not found</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-mono">429</td>
                  <td className="px-6 py-4">Too Many Requests - Rate limit exceeded</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-mono">500</td>
                  <td className="px-6 py-4">Internal Server Error</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SDKs */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Code Examples</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold mb-2">JavaScript / Node.js</h3>
              <div className="bg-gray-900 text-white p-4 rounded">
                <pre className="text-sm overflow-x-auto">
                  <code>{`const response = await fetch('https://api-drift-spike.vercel.app/api/send-email', {
  method: 'POST',
  headers: {
    'x-api-key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: 'user@example.com',
    subject: 'Hello',
    html: '<h1>Welcome!</h1>'
  })
});

const data = await response.json();
console.log(data);`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-2">Python</h3>
              <div className="bg-gray-900 text-white p-4 rounded">
                <pre className="text-sm overflow-x-auto">
                  <code>{`import requests

response = requests.post(
    'https://api-drift-spike.vercel.app/api/send-email',
    headers={'x-api-key': 'YOUR_API_KEY'},
    json={
        'to': 'user@example.com',
        'subject': 'Hello',
        'html': '<h1>Welcome!</h1>'
    }
)

print(response.json())`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Support */}
        <section className="bg-indigo-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-4">
            If you have questions or need assistance, we're here to help!
          </p>
          <div className="flex gap-4">
            <a href="mailto:support@driftspike.com" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700">
              Contact Support
            </a>
            <Link href="/dashboard" className="px-6 py-2 bg-white text-indigo-600 rounded-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50">
              Go to Dashboard
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
