import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBeNudJBG6JMkNJ0syeZ4TKthBFabRvBRU",
  authDomain: "driftspike-d1521.firebaseapp.com",
  projectId: "driftspike-d1521",
  storageBucket: "driftspike-d1521.firebasestorage.app",
  messagingSenderId: "283828093604",
  appId: "1:283828093604:web:58c2361f9a5378c80f9c31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };