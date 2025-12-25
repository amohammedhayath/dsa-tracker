// // Import the functions you need from the SDKs you need
// // import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// // const firebaseConfig = {
// //   apiKey: "AIzaSyDEMB1sLodqmvm6A2RBpEigs4uwYSooylQ",
// //   authDomain: "dsa-tracker-d6048.firebaseapp.com",
// //   projectId: "dsa-tracker-d6048",
// //   storageBucket: "dsa-tracker-d6048.firebasestorage.app",
// //   messagingSenderId: "118022560374",
// //   appId: "1:118022560374:web:b4b924db83e6362042dd57",
// //   measurementId: "G-X7Z8DJ0E6X"
// // };

// // Initialize Firebase
// // const app = initializeApp(firebaseConfig);
// // const analytics = getAnalytics(app);


// // src/firebase.js
// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDEMB1sLodqmvm6A2RBpEigs4uwYSooylQ",
//   authDomain: "dsa-tracker-d6048.firebaseapp.com",
//   projectId: "dsa-tracker-d6048",
//   storageBucket: "dsa-tracker-d6048.firebasestorage.app",
//   messagingSenderId: "118022560374",
//   appId: "1:118022560374:web:b4b924db83e6362042dd57",
//   measurementId: "G-X7Z8DJ0E6X"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// // Initialize & Export Services for your App to use
// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const provider = new GoogleAuthProvider();

// // Export Helper Functions
// export const login = () => signInWithPopup(auth, provider);
// export const logout = () => signOut(auth);


// src/firebase.js
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEMB1sLodqmvm6A2RBpEigs4uwYSooylQ",
  authDomain: "dsa-tracker-d6048.firebaseapp.com",
  projectId: "dsa-tracker-d6048",
  storageBucket: "dsa-tracker-d6048.firebasestorage.app",
  messagingSenderId: "118022560374",
  appId: "1:118022560374:web:b4b924db83e6362042dd57",
  measurementId: "G-X7Z8DJ0E6X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Export Email/Password helper functions
export const registerWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => signOut(auth);