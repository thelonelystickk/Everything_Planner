// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA96Z3lkYENRWwSmx5XMnmH51Egy6aO-y8",
  authDomain: "everythingplanner-dcaa1.firebaseapp.com",
  projectId: "everythingplanner-dcaa1",
  storageBucket: "everythingplanner-dcaa1.firebasestorage.app",
  messagingSenderId: "405061929639",
  appId: "1:405061929639:web:e348f52faaca2d7e0ee982",
  measurementId: "G-QCNJMGMLLJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
