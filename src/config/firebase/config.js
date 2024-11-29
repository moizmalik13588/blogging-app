// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNzTh4THNne0w_8rCkOXu3irqECbs3R-4",
  authDomain: "blogging-app-49ff0.firebaseapp.com",
  projectId: "blogging-app-49ff0",
  storageBucket: "blogging-app-49ff0.firebasestorage.app",
  messagingSenderId: "166714785813",
  appId: "1:166714785813:web:2be65782b6347de7544e1c",
  measurementId: "G-RTMN3JHP1X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app