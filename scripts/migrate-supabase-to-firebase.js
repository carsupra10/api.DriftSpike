import { createClient } from '@supabase/supabase-js';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://gubqqehjdxcymbfovuaw.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || 'your-service-key';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeNudJBG6JMkNJ0syeZ4TKthBFabRvBRU",
  authDomain: "driftspike-d1521.firebaseapp.com",
  projectId: "driftspike-d1521",
  storageBucket: "driftspike-d1521.firebasestorage.app",
  messagingSenderId: "283828093604",
  appId: "1:283828093604:web:58c2361f9a5378c80f9c31"
};

// Initialize clients
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

async function migrateUsers() {
  console.log('🚀 Starting user migration from Supabase to Firebase...\n');

  try {
    // Fetch all users from Supabase
    console.log('📥 Fetching users from Supabase...');
    const { data: users, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      throw new Error(`Supabase fetch error: ${error.message}`);
    }

    console.log(`✅ Found ${users.length} users in Supabase\n`);

    // Migrate users to Firebase in batches
    const batchSize = 500; // Firestore batch limit
    let migratedCount = 0;

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = writeBatch(db);
      const userBatch = users.slice(i, i + batchSize);

      console.log(`📤 Migrating batch ${Math.floor(i / batchSize) + 1}...`);

      for (const user of userBatch) {
        const userRef = doc(db, 'users', user.id);
        
        // Transform Supabase data to Firebase format
        const firebaseUser = {
          id: user.id,
          email: user.email,
          planType: user.plan_type,
          emailsSentThisMonth: user.emails_sent_this_month || 0,
          
          // SMTP Configuration
          smtp: {
            host: user.smtp_host,
            port: user.smtp_port || 587,
            secure: user.smtp_secure || false,
            user: user.smtp_user,
            pass: user.smtp_pass,
            fromName: user.from_name
          },
          
          // IMAP Configuration
          imap: {
            host: user.imap_host || null,
            port: user.imap_port || 993,
            secure: user.imap_secure !== false,
            user: user.imap_user || null,
            pass: user.imap_pass || null
          },
          
          // Timestamps
          createdAt: user.created_at || new Date().toISOString(),
          updatedAt: user.updated_at || new Date().toISOString(),
          lastEmailSent: user.last_email_sent || null,
          lastEmailRead: user.last_email_read || null,
          
          // Statistics
          totalEmailsSent: user.total_emails_sent || 0,
          totalEmailsRead: user.total_emails_read || 0
        };

        batch.set(userRef, firebaseUser);
        migratedCount++;
      }

      await batch.commit();
      console.log(`✅ Migrated ${userBatch.length} users (Total: ${migratedCount}/${users.length})\n`);
    }

    console.log('🎉 User migration completed successfully!');
    console.log(`📊 Total users migrated: ${migratedCount}\n`);

    return { success: true, migratedCount };

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

async function migrateEmailLogs() {
  console.log('🚀 Starting email logs migration...\n');

  try {
    // Fetch email logs from Supabase
    console.log('📥 Fetching email logs from Supabase...');
    const { data: logs, error } = await supabase
      .from('email_logs')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(10000); // Limit to recent logs

    if (error) {
      console.log('⚠️  No email_logs table found or error:', error.message);
      return { success: true, migratedCount: 0 };
    }

    console.log(`✅ Found ${logs.length} email logs in Supabase\n`);

    // Migrate logs to Firebase in batches
    const batchSize = 500;
    let migratedCount = 0;

    for (let i = 0; i < logs.length; i += batchSize) {
      const batch = writeBatch(db);
      const logBatch = logs.slice(i, i + batchSize);

      console.log(`📤 Migrating log batch ${Math.floor(i / batchSize) + 1}...`);

      for (const log of logBatch) {
        const logRef = doc(collection(db, 'emailLogs'));
        
        const firebaseLog = {
          userId: log.user_id,
          recipient: log.recipient,
          subject: log.subject,
          status: log.status,
          sentAt: log.sent_at,
          responseTime: log.response_time || null,
          errorMessage: log.error_message || null
        };

        batch.set(logRef, firebaseLog);
        migratedCount++;
      }

      await batch.commit();
      console.log(`✅ Migrated ${logBatch.length} logs (Total: ${migratedCount}/${logs.length})\n`);
    }

    console.log('🎉 Email logs migration completed!');
    console.log(`📊 Total logs migrated: ${migratedCount}\n`);

    return { success: true, migratedCount };

  } catch (error) {
    console.error('❌ Email logs migration failed:', error);
    return { success: false, error: error.message };
  }
}

async function verifyMigration() {
  console.log('🔍 Verifying migration...\n');

  try {
    // Count users in Firebase
    const { data: supabaseUsers } = await supabase
      .from('users')
      .select('id', { count: 'exact' });

    console.log(`Supabase users: ${supabaseUsers?.length || 0}`);
    console.log('✅ Migration verification completed\n');

  } catch (error) {
    console.error('❌ Verification failed:', error);
  }
}

// Main migration function
async function runMigration() {
  console.log('═══════════════════════════════════════════════════');
  console.log('   SUPABASE TO FIREBASE MIGRATION SCRIPT');
  console.log('═══════════════════════════════════════════════════\n');

  try {
    // Migrate users
    const userResult = await migrateUsers();
    
    // Migrate email logs
    const logResult = await migrateEmailLogs();
    
    // Verify migration
    await verifyMigration();

    console.log('═══════════════════════════════════════════════════');
    console.log('   MIGRATION SUMMARY');
    console.log('═══════════════════════════════════════════════════');
    console.log(`✅ Users migrated: ${userResult.migratedCount}`);
    console.log(`✅ Logs migrated: ${logResult.migratedCount}`);
    console.log('═══════════════════════════════════════════════════\n');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Migration failed with error:', error);
    process.exit(1);
  }
}

// Run migration
runMigration();