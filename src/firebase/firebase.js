import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyBMn52gdwdTr5tONX9yiwrDC2HVsA-tRSk",
    authDomain: "swampstays-ea444.firebaseapp.com",
    projectId: "swampstays-ea444",
    storageBucket: "swampstays-ea444.firebasestorage.app",
    messagingSenderId: "737278386601",
    appId: "1:737278386601:web:8532eec07abb9251ebe4b8",
    measurementId: "G-QYV9R0YF2Y"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const messaging = getMessaging(app);
const db = getDatabase(app);
const database = getDatabase(app);
const storage = getStorage(app);
const firestore = getFirestore(app);


export { app, auth, db, database, storage, firestore, messaging};