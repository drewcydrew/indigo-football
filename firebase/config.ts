import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBhI9-PS8goiEvpIxrYMmKeA5JgTigU74A",
  authDomain: "indigo-football.firebaseapp.com",
  projectId: "indigo-football",
  storageBucket: "indigo-football.appspot.com", // Fixed storage bucket
  messagingSenderId: "219005852624", // Added messaging sender ID
  appId: "1:219005852624:android:114c616a87ec65a0b6f7d5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Optional: If you're using Firebase emulator
// if (__DEV__) {
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

export { db };
