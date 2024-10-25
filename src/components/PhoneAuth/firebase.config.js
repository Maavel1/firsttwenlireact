import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBtxFcRd62UhS4IfKk7ZomPAsd_BPTUgyQ",
  authDomain: "firsttwenli-df79a.firebaseapp.com",
  projectId: "firsttwenli-df79a",
  storageBucket: "firsttwenli-df79a.appspot.com",
  messagingSenderId: "114801264499",
  appId: "1:114801264499:web:44873c3fb1d0fb59aae706",
  measurementId: "G-LWNJM51VDF",
};
const app = initializeApp(firebaseConfig);
// Экспорт auth
export const auth = getAuth(app);
// Убедитесь, что вызывается рекапча корректно
const setupRecaptcha = () => {
  window.recaptchaVerifier = new RecaptchaVerifier(
    "recaptcha-container",
    {
      size: "invisible",
      callback: (response) => {
        // callback function after successful verification
      },
    },
    auth
  );
};

// Функция для входа через номер телефона
const onSignup = (phoneNumber) => {
  setupRecaptcha(); // убедитесь, что рекапча настроена перед вызовом

  const appVerifier = window.recaptchaVerifier;
  signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      // отправка OTP
    })
    .catch((error) => {
      console.log("Ошибка при отправке OTP", error);
    });
};
