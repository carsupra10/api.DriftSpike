# Supabase to Firebase Migration Guide

## 📋 Overview

This guide will help you migrate your email API from Supabase (PostgreSQL) to Firebase (Firestore).

---

## 🚀 Pre-Migration Checklist

### 1. Backup Your Supabase Data

```bash
# Export users table
supabase db dump --table=users > backup_users.sql

# Export email_logs table
supabase db dump --table=email_logs > backup_email_logs.sql
```

### 2. Install Firebase Dependencies

```bash
npm install firebase firebase-admin
```

### 3. Set Environment Variables

Create `.env.local` with:
```bash
# Supabase (for migration)
SUPABASE_URL=https://gubqqehjdxcymbfovuaw.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# Firebase (already configured in code)
# No additional env vars needed
```

---

## 📊 Data Structure Mapping

### Supabase (PostgreSQL) → Firebase (Firestore)

**Users Table:**
```
Supabase                    Firebase
─────────────────────────────────────────────
users (table)          →    users (collection)
├─ id (UUID)           →    document ID
├─ email               →    email
├─ plan_type           →    planType
├─ emails_sent_month   →    emailsSentThisMonth
├─ smtp_host           →    smtp.host
├─ smtp_port           →    smtp.port
├─ smtp_secure         →    smtp.secure
├─ smtp_user           →    smtp.user
├─ smtp_pass           →    smtp.pass
├─ from_name           →    smtp.fromName
├─ imap_host           →    imap.host
├─ imap_port           →    imap.port
├─ imap_secure         →    imap.secure
├─ imap_user           →    imap.user
├─ imap_pass           →    imap.pass
├─ created_at          →    createdAt
├─ updated_at          →    updatedAt
├─ last_email_sent     →    lastEmailSent
└─ total_emails_sent   →    totalEmailsSent
```

**Email Logs Table:**
```
Supabase                    Firebase
─────────────────────────────────────────────
email_logs (table)     →    emailLogs (collection)
├─ id (BIGSERIAL)      →    auto-generated ID
├─ user_id             →    userId
├─ recipient           →    recipient
├─ subject             →    subject
├─ status              →    status
├─ sent_at             →    sentAt
├─ response_time       →    responseTime
└─ error_message       →    errorMessage
```

---

## 🔄 Migration Steps

### Step 1: Run Migration Script

```bash
# Install dependencies
npm install

# Run migration
npm run migrate
```

The script will:
1. ✅ Connect to both Supabase and Firebase
2. ✅ Fetch all users from Supabase
3. ✅ Transform data to Firebase format
4. ✅ Batch write to Firestore (500 docs per batch)
5. ✅ Migrate email logs (optional)
6. ✅ Verify migration success

### Step 2: Deploy Firestore Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init firestore

# Deploy security rules
firebase deploy --only firestore:rules

# Deploy indexes
firebase deploy --only firestore:indexes
```

### Step 3: Update Environment Variables in Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

**Remove:**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `SUPABASE_ANON_KEY`

**Add (if using Firebase Admin SDK):**
- `FIREBASE_PROJECT_ID`: driftspike-d1521
- `FIREBASE_PRIVATE_KEY`: (from service account)
- `FIREBASE_CLIENT_EMAIL`: (from service account)

### Step 4: Update API Code

The migration script has already created `lib/firebase-manager.js`. Now update your API endpoints:

**Before (Supabase):**
```javascript
import { getSupabaseClient } from '../lib/connection-manager.js';

const supabase = getSupabaseClient();
const { data: user } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();
```

**After (Firebase):**
```javascript
import { getUserById } from '../lib/firebase-manager.js';

const user = await getUserById(userId);
```

### Step 5: Test Migration

```bash
# Test user lookup
curl -H "x-api-key: 5e292193-54fc-49a4-9395-fa7667145400" \
  "https://api-drift-spike.vercel.app/api/get-config"

# Test email sending
curl -X POST https://api-drift-spike.vercel.app/api/send-email \
  -H "x-api-key: 5e292193-54fc-49a4-9395-fa7667145400" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Migration Test",
    "html": "<h1>Testing Firebase migration</h1>"
  }'
```

---

## 🔍 Verification Checklist

After migration, verify:

- [ ] All users migrated successfully
- [ ] User count matches (Supabase vs Firebase)
- [ ] Email sending works
- [ ] Email reading works
- [ ] WebSocket notifications work
- [ ] Rate limiting works
- [ ] Caching works
- [ ] Performance is acceptable

---

## 📈 Performance Comparison

### Supabase (PostgreSQL)
- ✅ SQL queries
- ✅ Complex joins
- ✅ ACID transactions
- ⚠️  Connection pooling needed
- ⚠️  Geographic latency

### Firebase (Firestore)
- ✅ Real-time updates
- ✅ Offline support
- ✅ Auto-scaling
- ✅ Global CDN
- ⚠️  No complex queries
- ⚠️  Document size limits (1MB)

---

## 🎯 Key Differences

### 1. Queries

**Supabase:**
```javascript
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('plan_type', 'starter')
  .lt('emails_sent_this_month', 1500);
```

**Firebase:**
```javascript
const q = query(
  collection(db, 'users'),
  where('planType', '==', 'starter'),
  where('emailsSentThisMonth', '<', 1500)
);
const snapshot = await getDocs(q);
```

### 2. Updates

**Supabase:**
```javascript
await supabase
  .from('users')
  .update({ emails_sent_this_month: count + 1 })
  .eq('id', userId);
```

**Firebase:**
```javascript
await updateDoc(doc(db, 'users', userId), {
  emailsSentThisMonth: increment(1)
});
```

### 3. Real-time

**Supabase:**
```javascript
supabase
  .from('users')
  .on('UPDATE', payload => {
    console.log('User updated:', payload);
  })
  .subscribe();
```

**Firebase:**
```javascript
onSnapshot(doc(db, 'users', userId), (doc) => {
  console.log('User updated:', doc.data());
});
```

---

## 🔧 Troubleshooting

### Issue: Migration Script Fails

**Solution:**
```bash
# Check Supabase connection
curl https://gubqqehjdxcymbfovuaw.supabase.co/rest/v1/users \
  -H "apikey: YOUR_KEY"

# Check Firebase connection
firebase projects:list
```

### Issue: Permission Denied in Firestore

**Solution:**
```bash
# Deploy security rules
firebase deploy --only firestore:rules

# Or temporarily allow all (DEV ONLY)
# In firestore.rules:
allow read, write: if true;
```

### Issue: Slow Queries

**Solution:**
```bash
# Create composite indexes
firebase deploy --only firestore:indexes

# Check index status
firebase firestore:indexes
```

---

## 📊 Cost Comparison

### Supabase
- Free tier: 500MB database, 2GB bandwidth
- Pro: $25/month (8GB database, 50GB bandwidth)

### Firebase
- Free tier: 1GB storage, 10GB/month bandwidth, 50K reads/day
- Blaze (Pay-as-you-go): $0.18/GB storage, $0.12/GB bandwidth

**Estimated Monthly Cost (10K users, 100K emails):**
- Supabase: ~$25/month
- Firebase: ~$15-20/month

---

## 🚀 Post-Migration

### 1. Monitor Performance

```bash
# Check Firebase console
https://console.firebase.google.com/project/driftspike-d1521

# Monitor API performance
curl https://api-drift-spike.vercel.app/api/health
```

### 2. Optimize Queries

- Create composite indexes for common queries
- Use caching for frequently accessed data
- Implement pagination for large result sets

### 3. Clean Up Supabase (Optional)

Once migration is verified:
```bash
# Pause Supabase project (keeps data)
# Or delete project (permanent)
```

---

## 📞 Support

If you encounter issues:
1. Check Firebase Console for errors
2. Review Vercel function logs
3. Test with `/api/health` endpoint
4. Check Firestore security rules

---

## ✅ Migration Complete!

Your email API is now running on Firebase with:
- ✅ Improved scalability
- ✅ Real-time capabilities
- ✅ Global CDN
- ✅ Automatic backups
- ✅ Better performance

Next steps:
1. Monitor for 24-48 hours
2. Optimize based on usage patterns
3. Consider implementing Firebase Auth for better security