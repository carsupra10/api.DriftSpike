import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBeNudJBG6JMkNJ0syeZ4TKthBFabRvBRU",
  authDomain: "driftspike-d1521.firebaseapp.com",
  projectId: "driftspike-d1521",
  storageBucket: "driftspike-d1521.firebasestorage.app",
  messagingSenderId: "283828093604",
  appId: "1:283828093604:web:58c2361f9a5378c80f9c31"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
