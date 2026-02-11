'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
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
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<UserConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(false);
  
  // Email form
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [html, setHtml] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchConfig(currentUser.uid);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchConfig = async (userId: string) => {
    setConfigLoading(true);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-config`, {
        headers: {
          'x-api-key': userId
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (err) {
      console.error('Failed to fetch config:', err);
    } finally {
      setConfigLoading(false);
    }
  };

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSending(true);
    setSendResult(null);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send-email`, {
        method: 'POST',
        headers: {
          'x-api-key': user.uid,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ to, subject, html })
      });
      
      const data = await res.json();
      setSendResult(data);
      
      if (res.ok) {
        fetchConfig(user.uid);
        // Clear form on success
        setTo('');
        setSubject('');
        setHtml('');
      }
    } catch (err: any) {
      setSendResult({ error: err.message });
    } finally {
      setSending(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                DriftSpike
              </span>
            </Link>
            <div className="flex gap-6 items-center">
              <Link href="/docs" className="text-gray-600 hover:text-gray-900 transition">
                Docs
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your email API and send messages</p>
        </div>

        {configLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your configuration...</p>
          </div>
        ) : config ? (
          <>
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Plan</div>
                    <div className="text-2xl font-bold text-indigo-600 capitalize">
                      {config.user.plan_type}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💎</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Emails Sent</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {config.user.emails_sent_this_month}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📧</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Remaining</div>
                    <div className="text-2xl font-bold text-green-600">
                      {config.limits.remaining_emails}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Rate Limit</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {config.limits.requests_per_minute}/min
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Account Details */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-bold mb-4">Account Details</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-semibold">{config.user.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">API Key (User ID)</div>
                    <div className="font-mono text-sm bg-gray-50 p-2 rounded border border-gray-200">
                      {config.user.id}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">SMTP Host</div>
                    <div className="font-semibold">{config.smtp_config.smtp_host || 'Not configured'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">From Name</div>
                    <div className="font-semibold">{config.smtp_config.from_name || 'Not configured'}</div>
                  </div>
                </div>
              </div>

              {/* Send Email Form */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                      placeholder="<h1>Hello World</h1>"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
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
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold mb-2">Configuration Not Found</h3>
            <p className="text-gray-600">
              Please configure your SMTP settings in Firebase Firestore
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
