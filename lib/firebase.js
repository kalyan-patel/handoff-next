// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Add SDKs for other Firebase products that you want to use at:
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbGf-PYORfJo5eLwAQTLQd-y1DWo7k6Ac",
  authDomain: "handoff-next-auth.firebaseapp.com",
  projectId: "handoff-next-auth",
  storageBucket: "handoff-next-auth.firebasestorage.app",
  messagingSenderId: "57550839638",
  appId: "1:57550839638:web:8b624a3bd6c31fde03c0f7",
  measurementId: "G-0RM3LBMB1C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export { auth }