import { useState } from "react";
import { auth } from "../../base/base"; // Firebase инициализация
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { Button, Input } from "antd";

const PhoneAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");

  // Функция для настройки reCAPTCHA
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA пройдено");
          },
        },
        auth
      );
    }
  };

  // Отправка SMS с кодом подтверждения
  const sendSMSCode = () => {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        setConfirmationResult(confirmationResult);
        console.log("SMS отправлено");
      })
      .catch((error) => {
        setError(`Ошибка отправки SMS: ${error.message}`);
      });
  };

  // Подтверждение кода из SMS
  const verifyCode = () => {
    if (confirmationResult) {
      confirmationResult
        .confirm(verificationCode)
        .then((result) => {
          console.log("Пользователь успешно аутентифицирован", result.user);
          // Логика редиректа на профиль
        })
        .catch((error) => {
          setError(`Неверный код подтверждения: ${error.message}`);
        });
    }
  };

  return (
    <div>
      <h2>Авторизация по номеру телефона</h2>
      <div id="recaptcha-container"></div>

      {confirmationResult ? (
        <>
          <Input
            placeholder="Введите код из SMS"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <Button onClick={verifyCode}>Подтвердить код</Button>
        </>
      ) : (
        <>
          <Input
            placeholder="Введите номер телефона"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Button onClick={sendSMSCode}>Отправить код</Button>
        </>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default PhoneAuth;
