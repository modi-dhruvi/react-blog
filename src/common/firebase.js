// import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { getStorage, ref } from 'firebase/storage'
import { GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
});

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
export const auth = firebaseConfig.auth()
export const storage = getStorage(firebaseConfig)
export const db = getFirestore(firebaseConfig)
export const provider = new GoogleAuthProvider()

export default firebaseConfig