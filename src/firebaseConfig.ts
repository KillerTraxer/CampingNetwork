import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyD8Q-p8hQjlAutimnri1rG_vZDVe1tS4Fg",
    authDomain: "notes-app-cf328.firebaseapp.com",
    databaseURL: "https://notes-app-cf328-default-rtdb.firebaseio.com",
    projectId: "notes-app-cf328",
    storageBucket: "notes-app-cf328.appspot.com",
    messagingSenderId: "105374215385",
    appId: "1:105374215385:web:f8bf5c9ebe10107207e2c8",
    measurementId: "G-YM7FB8NSE9",
};

const app = initializeApp(firebaseConfig);
export const imageDB = {
    storage: getStorage(app),
};
export const db = getFirestore(app);