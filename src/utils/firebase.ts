// src/utils/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// modifikasi src/utils/firebase.ts
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDYn0hfK4umttLZvIfCIOrTu4kcn9PB_LM",
    authDomain: "responsi2-2dc9c.firebaseapp.com",
    projectId: "responsi2-2dc9c",
    storageBucket: "responsi2-2dc9c.firebasestorage.app",
    messagingSenderId: "553143541565",
    appId: "1:553143541565:web:922cfc598d9720c9e4ef54",
};

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(firebase);

export { auth, googleProvider, db };