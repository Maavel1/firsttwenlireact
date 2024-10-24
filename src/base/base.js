import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification as firebaseSendEmailVerification,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

// Функция для обработки сообщений об ошибках
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
    case "auth/invalid-phone-number":
      return "Неверный номер телефона.";
    default:
      return "Произошла неизвестная ошибка. Пожалуйста, попробуйте еще раз.";
  }
};

// Конфигурация Firebase
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
export const auth = getAuth(app);

// Инициализация провайдера Google
const googleProvider = new GoogleAuthProvider();

// Регистрация пользователя по email и паролю
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await sendVerificationEmail(user);
    console.log(
      "Пользователь создан и отправлено письмо для подтверждения:",
      user
    );
    return user;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error(
      "Ошибка при создании пользователя:",
      error.code,
      errorMessage
    );
    throw new Error(errorMessage);
  }
};

// Отправка письма для подтверждения email
export const sendVerificationEmail = (user) => {
  return firebaseSendEmailVerification(user)
    .then(() => {
      console.log("Письмо для подтверждения email отправлено.");
    })
    .catch((error) => {
      console.error(
        "Ошибка при отправке письма для подтверждения email:",
        error
      );
    });
};

// Вход через Google
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("Пользователь вошел через Google:", user);
    return user;
  } catch (error) {
    console.error("Ошибка при входе через Google:", error.code, error.message);
    throw error;
  }
};

// Вход пользователя по email и паролю
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("Пользователь вошел:", user);
    return user;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error("Ошибка при входе:", error.code, errorMessage);
    throw new Error(errorMessage);
  }
};

// Функция для сброса пароля
export const resetPassword = async (email) => {
  try {
    await firebaseSendPasswordResetEmail(auth, email);
    console.log("Письмо для сброса пароля отправлено.");
  } catch (error) {
    console.error(
      "Ошибка при отправке письма для сброса пароля:",
      error.code,
      error.message
    );
    throw error;
  }
};

// Функция для настройки reCAPTCHA для аутентификации по телефону
export const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container", // Убедитесь, что у вас есть этот ID в вашем HTML
      {
        size: "invisible", // или "normal"
        callback: (response) => {
          console.log("reCAPTCHA пройдено");
        },
      },
      auth
    );
  }
};

// Отправка SMS-кода для подтверждения номера телефона
export const sendSMSCode = (phoneNumber) => {
  setupRecaptcha();
  const appVerifier = window.recaptchaVerifier;

  return signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((confirmationResult) => {
      console.log("SMS-код отправлен");
      return confirmationResult;
    })
    .catch((error) => {
      const errorMessage = getErrorMessage(error);
      console.error("Ошибка при отправке SMS-кода:", error);
      throw new Error(errorMessage);
    });
};
