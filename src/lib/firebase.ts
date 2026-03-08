import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDyml5WC62i95ltBYqM9ekmzfOixaqC0ek",
    authDomain: "notes-bundle.firebaseapp.com",
    projectId: "notes-bundle",
    storageBucket: "notes-bundle.firebasestorage.app",
    messagingSenderId: "61215827368",
    appId: "1:61215827368:web:1dcd2cf071eca21803a99d",
    measurementId: "G-8NP7SHHRG3"
};

// Initialize Firebase only if it hasn't been initialized already (important for Next.js HMR)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
