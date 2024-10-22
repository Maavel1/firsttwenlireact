import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification as firebaseSendEmailVerification,
} from "firebase/auth";

// Конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBtxFcRd62UhS4IfKk7ZomPAsd_BPTUgyQ",
  authDomain: "firsttwenli-df79a.firebaseapp.com",
  projectId: "firsttwenli-df79a",
  storageBucket: "firsttwenli-df79a",
  messagingSenderId: "114801264499",
  appId: "1:114801264499:web:44873c3fb1d0fb59aae706",
  measurementId: "G-LWNJM51VDF",
};

// Отправка письма для подтверждения email
export const sendVerificationEmail = (user) => {
  return firebaseSendEmailVerification(user)
    .then(() => {
      console.log("Email verification sent.");
    })
    .catch((error) => {
      console.error("Error sending email verification:", error);
    });
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Регистрация нового пользователя
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

// Вход пользователя
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

// Выход пользователя
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

// Вход через Google
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("User logged in with Google:", user);
    return user;
  } catch (error) {
    console.error("Error logging in with Google:", error.code, error.message);
    throw error;
  }
};
