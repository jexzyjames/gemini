// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebase = {
  apiKey:process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "consoleauths.firebaseapp.com",
  projectId: "consoleauths",
  storageBucket: "consoleauths.appspot.com",
  messagingSenderId: "12904864693",
  appId: "1:12904864693:web:6c69c38772252b3662d7fc"
};
const firebaseConfig = {
  apiKey: "AIzaSyCxKO85EunTCXr1yEBMFsF0TM52lFdTz8g",
  authDomain: "consoleauths.firebaseapp.com",
  databaseURL: "https://consoleauths-default-rtdb.firebaseio.com",
  projectId: "consoleauths",
  storageBucket: "consoleauths.firebasestorage.app",
  messagingSenderId: "12904864693",
  appId: "1:12904864693:web:6c69c38772252b3662d7fc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);
export {db,app,googleProvider, storage, auth}
export default firebase;