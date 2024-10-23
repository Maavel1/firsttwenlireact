import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification as firebaseSendEmailVerification,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
} from "firebase/auth";

const getErrorMessage = (error) => {
  switch (error.code) {
    case "auth/invalid-email":
      return "Неверный формат email.";
    case "auth/user-disabled":
      return "Пользователь был отключен.";
    case "auth/user-not-found":
      return "Пользователь не найден.";
    case "auth/wrong-password":
      return "Неверный пароль.";
    case "auth/email-already-in-use":
      return "Этот email уже используется.";
    case "auth/operation-not-allowed":
      return "Эта операция не разрешена.";
    case "auth/weak-password":
      return "Пароль должен содержать не менее 6 символов.";
    default:
      return "Произошла неизвестная ошибка. Пожалуйста, попробуйте еще раз.";
  }
};

const firebaseConfig = {
  apiKey: "AIzaSyBtxFcRd62UhS4IfKk7ZomPAsd_BPTUgyQ",
  authDomain: "firsttwenli-df79a.firebaseapp.com",
  projectId: "firsttwenli-df79a",
  storageBucket: "firsttwenli-df79a.appspot.com",
  messagingSenderId: "114801264499",
  appId: "1:114801264499:web:44873c3fb1d0fb59aae706",
  measurementId: "G-LWNJM51VDF",
};

// Инициализация приложения Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Инициализация провайдера Google
const googleProvider = new GoogleAuthProvider();

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await sendVerificationEmail(user);
    console.log("User created and verification email sent:", user);
    return user;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error("Error creating user:", error.code, errorMessage);
    throw new Error(errorMessage);
  }
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

// Аналогично для других функций:
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
    const errorMessage = getErrorMessage(error);
    console.error("Error logging in:", error.code, errorMessage);
    throw new Error(errorMessage);
  }
};

// Функция для сброса пароля
export const resetPassword = async (email) => {
  try {
    await firebaseSendPasswordResetEmail(auth, email);
    console.log("Password reset email sent.");
  } catch (error) {
    console.error(
      "Error sending password reset email:",
      error.code,
      error.message
    );
    throw error;
  }
};
