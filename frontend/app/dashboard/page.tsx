'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserConfig {
  user: {
    id: string;
    email: string;
    plan_type: string;
    emails_sent_this_month: number;
    created_at: string;
  };
  smtp_config: {
    smtp_host: string;
    smtp_port: number;
    smtp_user: string;
    from_name: string;
  };
  limits: {
    monthly_emails: string | number;
    remaining_emails: string | number;
    requests_per_minute: number;
  };
}

export default function Dashboard() {
  const [apiKey, setApiKey] = useState('');
  const [config, setConfig] = useState<UserConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Email form
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [html, setHtml] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<any>(null);

  const fetchConfig = async () => {
    if (!apiKey) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-config`, {
        headers: {
          'x-api-key': apiKey
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch config');
      }
      
      const data = await res.json();
      setConfig(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSendResult(null);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send-email`, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ to, subject, html })
      });
      
      const data = await res.json();
      setSendResult(data);
      
      if (res.ok) {
        // Refresh config to update email count
        fetchConfig();
      }
    } catch (err: any) {
      setSendResult({ error: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">DriftSpike</span>
              <span className="ml-2 text-sm text-gray-500">Dashboard</span>
            </Link>
            <div className="flex gap-4">
              <Link href="/" className="text-gray-700 hover:text-indigo-600">
                Home
              </Link>
              <Link href="/docs" className="text-gray-700 hover:text-indigo-600">
                Docs
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Key Input */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">API Configuration</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter your API Key (User ID)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={fetchConfig}
              disabled={loading || !apiKey}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Load Config'}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>

        {config && (
          <>
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm text-gray-500 mb-1">Plan</div>
                <div className="text-2xl font-bold text-indigo-600 capitalize">
                  {config.user.plan_type}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm text-gray-500 mb-1">Emails Sent</div>
                <div className="text-2xl font-bold">
                  {config.user.emails_sent_this_month}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm text-gray-500 mb-1">Remaining</div>
                <div className="text-2xl font-bold text-green-600">
                  {config.limits.remaining_emails}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm text-gray-500 mb-1">Rate Limit</div>
                <div className="text-2xl font-bold">
                  {config.limits.requests_per_minute}/min
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Account Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-semibold">{config.user.email}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">User ID</div>
                  <div className="font-mono text-sm">{config.user.id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">SMTP Host</div>
                  <div className="font-semibold">{config.smtp_config.smtp_host}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">From Name</div>
                  <div className="font-semibold">{config.smtp_config.from_name}</div>
                </div>
              </div>
            </div>

            {/* Send Email Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Send Test Email</h2>
              <form onSubmit={sendEmail} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To
                  </label>
                  <input
                    type="email"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="recipient@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Email subject"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    HTML Content
                  </label>
                  <textarea
                    value={html}
                    onChange={(e) => setHtml(e.target.value)}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                    placeholder="<h1>Hello World</h1><p>Your email content here...</p>"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {sending ? 'Sending...' : 'Send Email'}
                </button>
              </form>

              {sendResult && (
                <div className={`mt-4 p-4 rounded-lg ${sendResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <pre className="text-sm overflow-x-auto">
                    {JSON.stringify(sendResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </>
        )}

        {!config && !error && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🔑</div>
            <h3 className="text-xl font-bold mb-2">Enter Your API Key</h3>
            <p className="text-gray-600">
              Enter your API key above to view your dashboard and send emails
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
