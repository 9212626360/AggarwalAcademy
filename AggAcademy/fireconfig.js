import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyD4oPqX97BcEtY72Um-hVlV7iqtUlTLKWY",
  authDomain: "atc-student-management.firebaseapp.com",
  databaseURL: "https://atc-student-management-default-rtdb.firebaseio.com",
  projectId: "atc-student-management",
  storageBucket: "atc-student-management.appspot.com",
  messagingSenderId: "356852902209",
  appId: "1:3568522902209:web:f7b6fa7ab3bf2d315a19c0",
  measurementId: "G-2NJX6FZ7QE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default db;
