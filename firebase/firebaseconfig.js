// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAY-VD6uegABb_5UGDOfG3n1QBQjx40EzQ",
  authDomain: "todo-bfd98.firebaseapp.com",
  projectId: "todo-bfd98",
  storageBucket: "todo-bfd98.firebasestorage.app",
  messagingSenderId: "615515866006",
  appId: "1:615515866006:web:f6c0d640aeef8b45f4d3b7",
  measurementId: "G-3J05SHQEBL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import { getFirestore } from "firebase/firestore";
export const db = getFirestore(app);
