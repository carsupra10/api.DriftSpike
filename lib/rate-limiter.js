import NodeCache from 'node-cache';

const rateLimitCache = new NodeCache({ 
  stdTTL: 3600, // 1 hour window
  checkperiod: 120 
});

// Rate limiting configuration
const RATE_LIMITS = {
  free: {
    requests_per_hour: 100,
    emails_per_month: 3000,
    concurrent_requests: 5
  },
  premium: {
    requests_per_hour: 1000,
    emails_per_month: Infinity,
    concurrent_requests: 20
  }
};

// Track concurrent requests per user
const concurrentRequests = new Map();

export function checkRateLimit(userId, planType = 'free') {
  const now = Date.now();
  const hourKey = `rate_${userId}_${Math.floor(now / 3600000)}`;
  const concurrentKey = `concurrent_${userId}`;
  
  // Check concurrent requests
  const concurrent = concurrentRequests.get(concurrentKey) || 0;
  if (concurrent >= RATE_LIMITS[planType].concurrent_requests) {
    return {
      allowed: false,
      error: 'Too many concurrent requests',
      retryAfter: 1
    };
  }
  
  // Check hourly rate limit
  const hourlyCount = rateLimitCache.get(hourKey) || 0;
  if (hourlyCount >= RATE_LIMITS[planType].requests_per_hour) {
    return {
      allowed: false,
      error: 'Hourly rate limit exceeded',
      retryAfter: 3600 - (now % 3600000) / 1000
    };
  }
  
  // Increment counters
  rateLimitCache.set(hourKey, hourlyCount + 1);
  concurrentRequests.set(concurrentKey, concurrent + 1);
  
  return { allowed: true };
}

export function releaseRequest(userId) {
  const concurrentKey = `concurrent_${userId}`;
  const current = concurrentRequests.get(concurrentKey) || 0;
  if (current > 0) {
    concurrentRequests.set(concurrentKey, current - 1);
  }
}

// Input validation with performance optimization
export function validateEmailRequest(body) {
  const { to, subject, html, attachments } = body;
  
  // Fast validation checks
  if (!to || typeof to !== 'string' || to.length > 254) {
    return { valid: false, error: 'Invalid recipient email' };
  }
  
  if (!subject || typeof subject !== 'string' || subject.length > 998) {
    return { valid: false, error: 'Invalid subject' };
  }
  
  if (!html || typeof html !== 'string' || html.length > 1048576) { // 1MB limit
    return { valid: false, error: 'Invalid or too large HTML content' };
  }
  
  // Email regex (optimized)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  // Validate attachments
  if (attachments) {
    if (!Array.isArray(attachments) || attachments.length > 10) {
      return { valid: false, error: 'Invalid attachments (max 10)' };
    }
    
    let totalSize = 0;
    for (const attachment of attachments) {
      if (!attachment.filename || !attachment.content) {
        return { valid: false, error: 'Invalid attachment format' };
      }
      
      // Estimate base64 size (rough calculation)
      totalSize += attachment.content.length * 0.75;
      if (totalSize > 25 * 1024 * 1024) { // 25MB total limit
        return { valid: false, error: 'Attachments too large (max 25MB total)' };
      }
    }
  }
  
  return { valid: true };
}