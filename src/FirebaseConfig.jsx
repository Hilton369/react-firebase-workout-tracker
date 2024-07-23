// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCOpy6BjlmJo9J-b4pppxEakkObNDFF0wM",
    authDomain: "workout-tracker-app-e3622.firebaseapp.com",
    projectId: "workout-tracker-app-e3622",
    storageBucket: "workout-tracker-app-e3622.appspot.com",
    messagingSenderId: "528892848723",
    appId: "1:528892848723:web:5ff34e4ef98e34c686b4a6",
    measurementId: "G-K0SDY81QBS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
