import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCXdk7W9f3-Kd-fi8cgi05BNRmLrzC4MDc",
    authDomain: "classroom-reservation-ec4f6.firebaseapp.com",
    projectId: "classroom-reservation-ec4f6",
    storageBucket: "classroom-reservation-ec4f6.appspot.com",
    messagingSenderId: "655547608370",
    appId: "1:655547608370:web:3640c1be79739e47833b2b",
    measurementId: "G-QBYLYSC5T5"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
