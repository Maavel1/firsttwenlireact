// firebase.config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtxFcRd62UhS4IfKk7ZomPAsd_BPTUgyQ",
  authDomain: "firsttwenli-df79a.firebaseapp.com",
  projectId: "firsttwenli-df79a",
  storageBucket: "firsttwenli-df79a.appspot.com",
  messagingSenderId: "114801264499",
  appId: "1:114801264499:web:44873c3fb1d0fb59aae706",
  measurementId: "G-LWNJM51VDF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.settings.appVerificationDisabledForTesting = false;
