'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">DriftSpike</span>
              <span className="ml-2 text-sm text-gray-500">Email API</span>
            </div>
            <div className="flex gap-4">
              <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600">
                Dashboard
              </Link>
              <Link href="/docs" className="text-gray-700 hover:text-indigo-600">
                Docs
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl">
            Ultra-Fast Email API
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Send emails at scale with our high-performance API. Built with Firebase, 
            optimized for speed, and designed for developers.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Get Started
            </Link>
            <Link
              href="/docs"
              className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition"
            >
              View Docs
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Sub-100ms response times with intelligent caching and connection pooling
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-2">Secure & Reliable</h3>
            <p className="text-gray-600">
              Enterprise-grade security with Firebase backend and rate limiting
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Real-time Analytics</h3>
            <p className="text-gray-600">
              Track email delivery, monitor performance, and get insights
            </p>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <div className="text-4xl font-bold text-indigo-600 mb-4">$0<span className="text-lg text-gray-500">/mo</span></div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  1,500 emails/month
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  1 request/minute
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Basic analytics
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Email support
                </li>
              </ul>
              <button className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition">
                Get Started
              </button>
            </div>

            <div className="bg-indigo-600 text-white p-8 rounded-xl shadow-md relative">
              <div className="absolute top-4 right-4 bg-yellow-400 text-indigo-900 px-3 py-1 rounded-full text-sm font-bold">
                Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Production</h3>
              <div className="text-4xl font-bold mb-4">$50<span className="text-lg opacity-75">/mo</span></div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Unlimited emails
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  30 requests/minute
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Priority support
                </li>
              </ul>
              <button className="w-full py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div className="mt-24 bg-gray-900 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
          <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
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
      </div>

      {/* Footer */}
      <footer className="bg-white mt-24 py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>© 2026 DriftSpike Email API. Built with Next.js and Firebase.</p>
        </div>
      </footer>
    </div>
  );
}
