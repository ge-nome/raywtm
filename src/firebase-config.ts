// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "wtm-host.firebaseapp.com",
  projectId: "wtm-host",
  storageBucket: "wtm-host.firebasestorage.app",
  messagingSenderId: "875668217370",
  appId: "1:875668217370:web:199ecc402923dc27bafba3",
  measurementId: "G-50HEXKEGXG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export any services you want to use
const db = getFirestore(app);  // Firestore Database

export { db };
