import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user ID from API key header
    const userId = req.headers['x-api-key'];
    if (!userId) {
      return res.status(401).json({ error: 'Missing x-api-key header (user ID required)' });
    }

    const { to, subject, html, attachments } = req.body;

    // Validate required fields
    if (!to || !subject || !html) {
      return res.status(400).json({ 
        error: 'Missing required fields: to, subject, html' 
      });
    }

    // Get user data and SMTP config by user ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, plan_type, emails_sent_this_month, smtp_host, smtp_port, smtp_secure, smtp_user, smtp_pass, from_name')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found with provided API key' });
    }

    // Check if user is premium or free
    const isPremium = user.plan_type === 'premium';
    
    // If free user, check if they've exceeded 3000 emails (premium users have no limit)
    if (!isPremium && user.emails_sent_this_month >= 3000) {
      return res.status(429).json({ 
        error: 'Free plan email limit exceeded (3000/month). Upgrade to premium for unlimited emails.' 
      });
    }

    // Create nodemailer transporter with user's SMTP config
    const transporter = nodemailer.createTransport({
      host: user.smtp_host,
      port: user.smtp_port,
      secure: user.smtp_secure,
      auth: {
        user: user.smtp_user,
        pass: user.smtp_pass
      }
    });

    // Send email
    const mailOptions = {
      from: `"${user.from_name}" <${user.smtp_user}>`,
      to: to,
      subject: subject,
      html: html
    };

    // Add attachments if provided
    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      mailOptions.attachments = attachments.map(attachment => {
        // Support both base64 content and file paths
        if (attachment.content) {
          return {
            filename: attachment.filename,
            content: attachment.content,
            encoding: attachment.encoding || 'base64',
            contentType: attachment.contentType
          };
        } else if (attachment.path) {
          return {
            filename: attachment.filename,
            path: attachment.path,
            contentType: attachment.contentType
          };
        }
        return attachment;
      });
    }

    await transporter.sendMail(mailOptions);

    // Update user's email count (only for free users)
    if (!isPremium) {
      await supabase
        .from('users')
        .update({ emails_sent_this_month: user.emails_sent_this_month + 1 })
        .eq('id', user.id);
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan_type,
        emails_sent: isPremium ? 'unlimited' : user.emails_sent_this_month + 1,
        smtp_from: user.from_name
      }
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ 
      error: 'Failed to send email', 
      details: error.message 
    });
  }
}