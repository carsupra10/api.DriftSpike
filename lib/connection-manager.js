import { firestore } from '../lib/firebase-manager.js';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import nodemailer from 'nodemailer';
import NodeCache from 'node-cache';

// Global connection pools
const smtpPool = new Map();
const cache = new NodeCache({ 
  stdTTL: 300, // 5 minutes cache
  checkperiod: 60, // Check for expired keys every minute
  useClones: false // Better performance
});

// Firebase Firestore connection (managed by firebase-manager)
export function getFirestoreClient() {
  return firestore;
}

// Helper functions for Firestore operations
export async function getFirestoreUser(userId) {
  const userRef = doc(firestore, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    return null;
  }
  
  return { id: userSnap.id, ...userSnap.data() };
}

export async function updateFirestoreUser(userId, data) {
  const userRef = doc(firestore, 'users', userId);
  await updateDoc(userRef, data);
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
}