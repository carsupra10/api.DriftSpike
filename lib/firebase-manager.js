import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc, increment, collection, query, where, getDocs } from 'firebase/firestore';
import NodeCache from 'node-cache';

const firebaseConfig = {
  apiKey: "AIzaSyBeNudJBG6JMkNJ0syeZ4TKthBFabRvBRU",
  authDomain: "driftspike-d1521.firebaseapp.com",
  projectId: "driftspike-d1521",
  storageBucket: "driftspike-d1521.firebasestorage.app",
  messagingSenderId: "283828093604",
  appId: "1:283828093604:web:58c2361f9a5378c80f9c31"
};

// Initialize Firebase (singleton pattern)
let app;
let db;

function initializeFirebase() {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
  return { app, db };
}

// Initialize on module load
const { app: firebaseApp, db: firestore } = initializeFirebase();

// Cache for user data
const userCache = new NodeCache({ 
  stdTTL: 300, // 5 minutes
  checkperiod: 60 
});

// Get user by ID
export async function getUserById(userId) {
  // Check cache first
  const cacheKey = `user_${userId}`;
  const cached = userCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    const userData = {
      id: userSnap.id,
      ...userSnap.data()
    };

    // Cache the result
    userCache.set(cacheKey, userData);

    return userData;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Get user by email
export async function getUserByEmail(email) {
  try {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    return {
      id: userDoc.id,
      ...userDoc.data()
    };
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
}

// Update user email count
export async function incrementEmailCount(userId) {
  try {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, {
      emailsSentThisMonth: increment(1),
      totalEmailsSent: increment(1),
      lastEmailSent: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Invalidate cache
    userCache.del(`user_${userId}`);

    return true;
  } catch (error) {
    console.error('Error updating email count:', error);
    return false;
  }
}

// Update user read count
export async function incrementReadCount(userId) {
  try {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, {
      totalEmailsRead: increment(1),
      lastEmailRead: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Invalidate cache
    userCache.del(`user_${userId}`);

    return true;
  } catch (error) {
    console.error('Error updating read count:', error);
    return false;
  }
}

// Log email activity
export async function logEmail(emailData) {
  try {
    const logsRef = collection(firestore, 'emailLogs');
    await addDoc(logsRef, {
      ...emailData,
      sentAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error logging email:', error);
    return false;
  }
}

// Cache operations
export const cacheGet = (key) => userCache.get(key);
export const cacheSet = (key, value, ttl = 300) => userCache.set(key, value, ttl);
export const cacheDel = (key) => userCache.del(key);

// Export firestore instance
export { firestore, firebaseApp };