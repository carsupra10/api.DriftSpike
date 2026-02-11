# Firebase Migration Deployment Checklist

## ✅ Pre-Deployment

### 1. Firebase Setup
- [ ] Create Firebase project at https://console.firebase.google.com
- [ ] Enable Firestore Database
- [ ] Create service account (Project Settings → Service Accounts → Generate New Private Key)
- [ ] Save service account JSON credentials securely

### 2. Deploy Firestore Configuration
```bash
# Deploy security rules
firebase deploy --only firestore:rules

# Deploy indexes
firebase deploy --only firestore:indexes
```

### 3. Vercel Environment Variables
Set these in Vercel dashboard or via CLI:

```bash
vercel env add FIREBASE_PROJECT_ID production
# Enter: driftspike-d1521

vercel env add FIREBASE_CLIENT_EMAIL production
# Enter: your-service-account@driftspike-d1521.iam.gserviceaccount.com

vercel env add FIREBASE_PRIVATE_KEY production
# Enter: "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

vercel env add ADMIN_KEY production
# Enter: your-secure-admin-key
```

## ✅ Migration Steps

### 1. Run Migration Script
```bash
# Install dependencies
npm install

# Run migration (requires both Supabase and Firebase credentials)
npm run migrate
```

### 2. Verify Data Migration
- [ ] Check users collection in Firestore console
- [ ] Verify email_logs collection
- [ ] Confirm all fields migrated correctly
- [ ] Test a sample user API key

## ✅ Deployment

### 1. Install Dependencies
```bash
npm install
```

### 2. Deploy to Vercel
```bash
vercel --prod
```

### 3. Test Endpoints

**Health Check:**
```bash
curl https://your-domain.vercel.app/api/health
```

**Get Config:**
```bash
curl -H "x-api-key: YOUR_USER_ID" \
  https://your-domain.vercel.app/api/get-config
```

**Send Email:**
```bash
curl -X POST https://your-domain.vercel.app/api/send-email \
  -H "x-api-key: YOUR_USER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<h1>Hello from Firebase!</h1>"
  }'
```

**Metrics (Admin):**
```bash
curl -H "x-admin-key: YOUR_ADMIN_KEY" \
  https://your-domain.vercel.app/api/metrics
```

## ✅ Post-Deployment

### 1. Monitor Performance
- [ ] Check response times in Vercel dashboard
- [ ] Monitor Firebase usage in Firebase console
- [ ] Review error logs
- [ ] Test rate limiting

### 2. Update DNS/Domain
- [ ] Point custom domain to Vercel deployment
- [ ] Update API documentation with new endpoints
- [ ] Notify users of migration (if applicable)

### 3. Cleanup (After Verification)
- [ ] Remove Supabase environment variables from Vercel
- [ ] Archive Supabase project (optional)
- [ ] Remove `@supabase/supabase-js` from package.json (already done)
- [ ] Delete migration script if no longer needed

## 🔍 Troubleshooting

### Firebase Connection Issues
- Verify FIREBASE_PRIVATE_KEY has proper newlines (`\n`)
- Check service account has Firestore permissions
- Ensure project ID matches exactly

### Rate Limiting Not Working
- Check user plan_type in Firestore
- Verify rate limiter cache is functioning
- Review rate limit logs in health endpoint

### Email Sending Failures
- Verify SMTP credentials in user document
- Check SMTP connection pooling
- Review error messages in response

### WebSocket Issues
- Ensure IMAP credentials are configured
- Check WebSocket upgrade headers
- Verify user has valid IMAP settings

## 📊 Success Metrics

After deployment, verify:
- [ ] Response times < 100ms (cached)
- [ ] Response times < 500ms (uncached)
- [ ] Cache hit rate > 85%
- [ ] Error rate < 0.1%
- [ ] All API endpoints returning 200 OK
- [ ] WebSocket connections stable
- [ ] Email delivery working

## 🎉 Migration Complete!

Your email API is now running on Firebase with:
- ✅ Scalable Firestore database
- ✅ Real-time capabilities
- ✅ Improved performance
- ✅ Better cost efficiency
- ✅ Enhanced monitoring
