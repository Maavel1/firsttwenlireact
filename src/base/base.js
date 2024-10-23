import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification as firebaseSendEmailVerification,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBtxFcRd62UhS4IfKk7ZomPAsd_BPTUgyQ",
  authDomain: "firsttwenli-df79a.firebaseapp.com",
  projectId: "firsttwenli-df79a",
  storageBucket: "firsttwenli-df79a",
  messagingSenderId: "114801264499",
  appId: "1:114801264499:web:44873c3fb1d0fb59aae706",
  measurementId: "G-LWNJM51VDF",
};

// Function to reset user password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent.");
  } catch (error) {
    console.error(
      "Error sending password reset email:",
      getFirebaseErrorMessage(error.code)
    );
    throw new Error(getFirebaseErrorMessage(error.code));
  }
};
export const sendVerificationEmail = (user) => {
  return firebaseSendEmailVerification(user)
    .then(() => {
      console.log("Email verification sent.");
    })
    .catch((error) => {
      console.error("Error sending email verification:", error);
    });
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("User created:", user);
    return user;
  } catch (error) {
    console.error("Error creating user:", error.code, error.message);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("User logged in:", user);
    return user;
  } catch (error) {
    console.error("Error logging in:", error.code, error.message);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Error logging in with Google:", error.code, error.message);
    throw error;
  }
};

export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      console.log("User logged in with Google:", user);
      return user;
    }
  } catch (error) {
    console.error("Error getting redirect result:", error);
  }
};
