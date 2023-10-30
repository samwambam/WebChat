// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore"
import { getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCeWlYNYeqUzL0q7ysZXGVVCtLgM-inPQw",
    authDomain: "testchat-b6902.firebaseapp.com",
    databaseURL: "https://testchat-b6902-default-rtdb.firebaseio.com",
    projectId: "testchat-b6902",
    storageBucket: "testchat-b6902.appspot.com",
    messagingSenderId: "448360743087",
    appId: "1:448360743087:web:59a8afaed0dd091b4f945a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app)
export const auth = getAuth();