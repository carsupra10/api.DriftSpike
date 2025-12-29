import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import NodeCache from 'node-cache';

// Global connection pools
const supabasePool = new Map();
const smtpPool = new Map();
const cache = new NodeCache({ 
  stdTTL: 300, // 5 minutes cache
  checkperiod: 60, // Check for expired keys every minute
  useClones: false // Better performance
});

// Supabase connection with pooling
export function getSupabaseClient() {
  const key = `${process.env.SUPABASE_URL}_${process.env.SUPABASE_SERVICE_KEY}`;
  
  if (!supabasePool.has(key)) {
    const client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        },
        db: {
          schema: 'public'
        },
        global: {
          headers: {
            'Connection': 'keep-alive'
          }
        }
      }
    );
    supabasePool.set(key, client);
  }
  
  return supabasePool.get(key);
}

// SMTP connection pooling with reuse
export function getSmtpTransporter(smtpConfig) {
  const key = `${smtpConfig.smtp_host}_${smtpConfig.smtp_port}_${smtpConfig.smtp_user}`;
  
  if (!smtpPool.has(key)) {
    const transporter = nodemailer.createTransport({
      host: smtpConfig.smtp_host,
      port: smtpConfig.smtp_port,
      secure: smtpConfig.smtp_secure,
      auth: {
        user: smtpConfig.smtp_user,
        pass: smtpConfig.smtp_pass
      },
      pool: true, // Enable connection pooling
      maxConnections: 10, // Max concurrent connections
      maxMessages: 100, // Max messages per connection
      rateLimit: 50, // Max 50 emails per second
      rateDelta: 1000, // Per 1 second
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 60000 // 60 seconds
    });
    
    smtpPool.set(key, transporter);
  }
  
  return smtpPool.get(key);
}

// Cache operations
export const cacheGet = (key) => cache.get(key);
export const cacheSet = (key, value, ttl = 300) => cache.set(key, value, ttl);
export const cacheDel = (key) => cache.del(key);

// Cleanup function for graceful shutdown
export function cleanup() {
  // Close SMTP connections
  for (const [key, transporter] of smtpPool) {
    transporter.close();
  }
  smtpPool.clear();
  
  // Clear cache
  cache.flushAll();
  
  // Clear Supabase connections
  supabasePool.clear();
}