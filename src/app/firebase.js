// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDoc, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDiBWuGVbkbPZqDYzsLFaDzKVPgZQLikY0",
  authDomain: "library-auth-db2e4.firebaseapp.com",
  projectId: "library-auth-db2e4",
  storageBucket: "library-auth-db2e4.appspot.com",
  messagingSenderId: "227515839279",
  appId: "1:227515839279:web:ce7091f359b45355f067da",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//init auth
export const auth = getAuth(app);
console.log(auth);

//init service
export const db = getFirestore(app);

// collection ref
const colRef = collection(db, "books");

//get coll data
getDocs(colRef).then((snapshot) => {
  console.log(snapshot.docs);
});
