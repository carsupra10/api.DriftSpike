'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                DriftSpike
              </span>
            </div>
            <div className="flex gap-6 items-center">
              <Link href="/docs" className="text-gray-600 hover:text-gray-900 transition">
                Docs
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 transition">
                Login
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6">
            Email API for
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Modern Developers
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Send transactional emails at scale with our lightning-fast API. 
            Built on Firebase, optimized for performance, designed for simplicity.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Start Free Trial
            </Link>
            <Link
              href="/docs"
              className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold border-2 border-gray-200 hover:border-gray-300 transition"
            >
              View Documentation
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">99.9%</div>
              <div className="text-gray-600 mt-2">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">&lt;100ms</div>
              <div className="text-gray-600 mt-2">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">1M+</div>
              <div className="text-gray-600 mt-2">Emails Sent</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Why Choose DriftSpike?</h2>
            <p className="mt-4 text-xl text-gray-600">Everything you need to send emails at scale</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl mb-4">
                ⚡
              </div>
              <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-gray-600">
                Sub-100ms response times with intelligent caching, connection pooling, and edge optimization
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl mb-4">
                🔒
              </div>
              <h3 className="text-xl font-bold mb-3">Secure & Reliable</h3>
              <p className="text-gray-600">
                Enterprise-grade security with Firebase backend, rate limiting, and 99.9% uptime guarantee
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl mb-4">
                📊
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Analytics</h3>
              <p className="text-gray-600">
                Track delivery rates, monitor performance, and get actionable insights in real-time
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl mb-4">
                🚀
              </div>
              <h3 className="text-xl font-bold mb-3">Easy Integration</h3>
              <p className="text-gray-600">
                Simple REST API with comprehensive documentation. Get started in minutes, not hours
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl mb-4">
                📧
              </div>
              <h3 className="text-xl font-bold mb-3">SMTP & IMAP</h3>
              <p className="text-gray-600">
                Send emails via SMTP and read incoming messages via IMAP with WebSocket notifications
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl mb-4">
                💰
              </div>
              <h3 className="text-xl font-bold mb-3">Transparent Pricing</h3>
              <p className="text-gray-600">
                Start free with 1,500 emails/month. Scale to unlimited with our production plan
              </p>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-xl text-gray-600">Choose the plan that fits your needs</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-10 rounded-2xl shadow-lg border-2 border-gray-200 hover:border-indigo-300 transition">
              <div className="text-sm font-semibold text-indigo-600 mb-2">STARTER</div>
              <div className="text-5xl font-bold text-gray-900 mb-2">
                $0<span className="text-xl text-gray-500">/mo</span>
              </div>
              <p className="text-gray-600 mb-8">Perfect for getting started</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>1,500 emails/month</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>1 request/minute</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Basic analytics</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Email support</span>
                </li>
              </ul>
              
              <Link
                href="/signup"
                className="block w-full py-3 bg-gray-100 text-gray-900 rounded-xl font-semibold text-center hover:bg-gray-200 transition"
              >
                Get Started Free
              </Link>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-10 rounded-2xl shadow-2xl relative transform hover:scale-105 transition">
              <div className="absolute -top-4 right-8 bg-yellow-400 text-indigo-900 px-4 py-1 rounded-full text-sm font-bold">
                POPULAR
              </div>
              <div className="text-sm font-semibold mb-2">PRODUCTION</div>
              <div className="text-5xl font-bold mb-2">
                $50<span className="text-xl opacity-75">/mo</span>
              </div>
              <p className="opacity-90 mb-8">For growing businesses</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-300 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Unlimited emails</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-300 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>30 requests/minute</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-300 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-300 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-300 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>99.9% SLA</span>
                </li>
              </ul>
              
              <Link
                href="/signup"
                className="block w-full py-3 bg-white text-indigo-600 rounded-xl font-semibold text-center hover:bg-gray-50 transition"
              >
                Start Production Trial
              </Link>
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-12 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6">Get Started in Seconds</h2>
            <pre className="bg-black/50 p-6 rounded-xl overflow-x-auto text-sm">
              <code className="text-green-400">{`curl -X POST https://api-drift-spike.vercel.app/api/send-email \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "user@example.com",
    "subject": "Hello World",
    "html": "<h1>Welcome to DriftSpike!</h1>"
  }'`}</code>
            </pre>
            <div className="mt-6 flex gap-4">
              <Link
                href="/docs"
                className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                View Full Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-32 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">DriftSpike</h3>
              <p className="text-gray-400">
                Ultra-fast email API for modern developers
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/docs" className="hover:text-white transition">Documentation</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
                <li><Link href="/" className="hover:text-white transition">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2026 DriftSpike. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
