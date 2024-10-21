import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// Ваша конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBtxFcRd62UhS4IfKk7ZomPAsd_BPTUgyQ",
  authDomain: "firsttwenli-df79a.firebaseapp.com",
  projectId: "firsttwenli-df79a",
  storageBucket: "firsttwenli-df79a.appspot.com",
  messagingSenderId: "114801264499",
  appId: "1:114801264499:web:44873c3fb1d0fb59aae706",
  measurementId: "G-LWNJM51VDF",
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Регистрация нового пользователя
export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User created:", user);
      return user;
    })
    .catch((error) => {
      console.error("Error creating user:", error.code, error.message);
    });
};

// Вход пользователя
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User logged in:", user);
      return user;
    })
    .catch((error) => {
      console.error("Error logging in:", error.code, error.message);
    });
};

// Выход пользователя
export const logoutUser = () => {
  return signOut(auth)
    .then(() => {
      console.log("User logged out");
    })
    .catch((error) => {
      console.error("Error logging out:", error);
    });
};

// Вход через Google
export const loginWithGoogle = () => {
  return signInWithPopup(auth, googleProvider)
    .then((result) => {
      const user = result.user;
      console.log("User logged in with Google:", user);
      return user;
    })
    .catch((error) => {
      console.error("Error logging in with Google:", error.code, error.message);
    });
};
