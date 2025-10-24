 Your Firebase configuration
const firebaseConfig = {
  apiKey AIzaSyD4oPqX97BcEtY72Um-hVlV7iqtUlTLKWY,
  authDomain atc-student-management.firebaseapp.com,
  databaseURL httpsatc-student-management-default-rtdb.firebaseio.com,
  projectId atc-student-management,
  storageBucket atc-student-management.appspot.com,
  messagingSenderId 356852902209,
  appId 1356852902209webf7b6fa7ab3bf2d315a19c0,
  measurementId G-2NJX6FZ7QE
};

 Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

 Export database reference
const db = database;