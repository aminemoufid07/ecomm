import "firebase/compat/auth";
import "firebase/compat/firestore";
import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAxYcOR97mfJwOIorjK2GokuZrlvaAX9iA",
  authDomain: "lesmdushop.firebaseapp.com",
  projectId: "lesmdushop",
  storageBucket: "lesmdushop.appspot.com",
  messagingSenderId: "526507498000",
  appId: "1:526507498000:web:dee1a84c421bf71c88c895",
  measurementId: "G-EQ7EQH89L7",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const storage = getStorage(app);

export { auth, db, storage };
