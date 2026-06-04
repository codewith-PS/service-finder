// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6Lzu45uCh-3zj9h7oMFUgXOpmX_fOegQ",
  authDomain: "send-otp-990b1.firebaseapp.com",
  projectId: "send-otp-990b1",
  storageBucket: "send-otp-990b1.firebasestorage.app",
  messagingSenderId: "1077294121716",
  appId: "1:1077294121716:web:74160251d6413523ce14a1",
  measurementId: "G-L6DZFY7WR5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);