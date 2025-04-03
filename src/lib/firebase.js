import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD2WQfbsnPzz-EgKxMekJFxbk_onb1PDAE",
  authDomain: "college-event-management-396a9.firebaseapp.com",
  projectId: "college-event-management-396a9",
  storageBucket: "college-event-management-396a9.firebasestorage.app",
  messagingSenderId: "431282414087",
  appId: "1:431282414087:web:a04c987e613111a1d940a2",
  measurementId: "G-X7EHR9P6C7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  // Firestore initialization
const auth = getAuth(app);     // Authentication initialization

export { db, auth };
