import { getSupabaseClient, getSmtpTransporter, cacheGet, cacheSet } from '../lib/connection-manager.js';
import { checkRateLimit, releaseRequest, validateEmailRequest } from '../lib/rate-limiter.js';

// Response compression
const compress = (data) => JSON.stringify(data);

export default async function handler(req, res) {
  // Set performance headers
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = req.headers['x-api-key'];
  let startTime = Date.now();
  
  try {
    // Fast validation
    if (!userId || typeof userId !== 'string' || userId.length !== 36) {
      return res.status(401).json({ error: 'Invalid API key format' });
    }

    // Validate request body
    const validation = validateEmailRequest(req.body);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const { to, subject, html, attachments } = req.body;

    // Check cache for user data first
    const cacheKey = `user_${userId}`;
    let user = cacheGet(cacheKey);
    
    if (!user) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('users')
        .select('id, email, plan_type, emails_sent_this_month, smtp_host, smtp_port, smtp_secure, smtp_user, smtp_pass, from_name')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      user = data;
      // Cache user data for 5 minutes
      cacheSet(cacheKey, user, 300);
    }

    // Rate limiting check
    const rateCheck = checkRateLimit(userId, user.plan_type);
    if (!rateCheck.allowed) {
      return res.status(429).json({ 
        error: rateCheck.error,
        retryAfter: rateCheck.retryAfter
      });
    }

    const isPremium = user.plan_type === 'premium';
    
    // Email limit check for free users
    if (!isPremium && user.emails_sent_this_month >= 3000) {
      releaseRequest(userId);
      return res.status(429).json({ 
        error: 'Monthly email limit exceeded (3000/month)' 
      });
    }

    // Get SMTP transporter from pool
    const transporter = getSmtpTransporter({
      smtp_host: user.smtp_host,
      smtp_port: user.smtp_port,
      smtp_secure: user.smtp_secure,
      smtp_user: user.smtp_user,
      smtp_pass: user.smtp_pass
    });

    // Prepare email options
    const mailOptions = {
      from: `"${user.from_name}" <${user.smtp_user}>`,
      to,
      subject,
      html,
      messageId: `${Date.now()}.${userId}@api-drift-spike.vercel.app`
    };

    // Process attachments efficiently
    if (attachments?.length > 0) {
      mailOptions.attachments = attachments.map(({ filename, content, contentType, encoding = 'base64' }) => ({
        filename,
        content,
        encoding,
        contentType
      }));
    }

    // Send email with timeout
    const emailPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Email timeout')), 30000)
    );
    
    await Promise.race([emailPromise, timeoutPromise]);

    // Update email count asynchronously for free users
    if (!isPremium) {
      // Don't await this - fire and forget for better performance
      const supabase = getSupabaseClient();
      supabase
        .from('users')
        .update({ emails_sent_this_month: user.emails_sent_this_month + 1 })
        .eq('id', userId)
        .then(() => {
          // Invalidate cache after update
          const cacheKey = `user_${userId}`;
          cacheSet(cacheKey, { ...user, emails_sent_this_month: user.emails_sent_this_month + 1 }, 300);
        })
        .catch(() => {}); // Silent fail for performance
    }

    // Release rate limit
    releaseRequest(userId);

    const responseTime = Date.now() - startTime;
    
    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan_type,
        emails_sent: isPremium ? 'unlimited' : user.emails_sent_this_month + 1
      },
      performance: {
        responseTime: `${responseTime}ms`,
        cached: !!cacheGet(cacheKey)
      }
    });

  } catch (error) {
    releaseRequest(userId);
    
    // Enhanced error handling
    const errorResponse = {
      error: 'Email sending failed',
      details: error.message,
      performance: {
        responseTime: `${Date.now() - startTime}ms`
      }
    };

    // Different status codes for different errors
    if (error.message.includes('timeout')) {
      return res.status(408).json(errorResponse);
    } else if (error.message.includes('authentication')) {
      return res.status(401).json(errorResponse);
    } else if (error.message.includes('quota')) {
      return res.status(429).json(errorResponse);
    }
    
    return res.status(500).json(errorResponse);
  }
}