import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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



export { app, auth };