import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyA42hEdOfZrtMsy_Y88Q__rWl66-H9E1Uc",
    authDomain: "expensetracker-979ae.firebaseapp.com",
    projectId: "expensetracker-979ae",
    storageBucket: "expensetracker-979ae.appspot.com",
    messagingSenderId: "364930817361",
    appId: "1:364930817361:web:188f0341d8d121fe8f0770",
    measurementId: "G-HTEZ55S9FD"
};
const app = initializeApp(firebaseConfig);
const fireDb = getFirestore(app);

export { fireDb, app };