// Transform Firebase camelCase to snake_case for API compatibility
export function transformFirebaseUser(firebaseUser) {
  if (!firebaseUser) return null;
  
  return {
    id: firebaseUser.id,
    email: firebaseUser.email,
    plan_type: firebaseUser.planType || 'starter',
    emails_sent_this_month: firebaseUser.emailsSentThisMonth || 0,
    total_emails_sent: firebaseUser.totalEmailsSent || 0,
    smtp_host: firebaseUser.smtp?.host,
    smtp_port: firebaseUser.smtp?.port,
    smtp_secure: firebaseUser.smtp?.secure,
    smtp_user: firebaseUser.smtp?.user,
    smtp_pass: firebaseUser.smtp?.pass,
    from_name: firebaseUser.smtp?.fromName,
    imap_host: firebaseUser.imap?.host,
    imap_port: firebaseUser.imap?.port,
    imap_secure: firebaseUser.imap?.secure,
    imap_user: firebaseUser.imap?.user,
    imap_pass: firebaseUser.imap?.pass,
    created_at: firebaseUser.createdAt,
    updated_at: firebaseUser.updatedAt
  };
}
