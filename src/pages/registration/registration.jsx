import { useState, useEffect } from "react";
import {
  registerUser,
  loginUser,
  logoutUser,
  loginWithGoogle,
} from "../../base/base"; // Импортируйте функции для работы с Firebase
import { useNavigate } from "react-router-dom"; // Импортируйте useNavigate из react-router-dom
import { auth } from "../../base/base"; // Предположим, что у вас есть файл base.js, где инициализирован Firebase

const Registration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Инициализируйте useNavigate

  // Функция для проверки корректности email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = () => {
    if (email === "" || password === "") {
      console.error("Email и пароль не должны быть пустыми.");
      return;
    }

    if (!isValidEmail(email)) {
      console.error("Неверный формат email.");
      return;
    }

    registerUser(email, password)
      .then(() => {
        navigate("/profile"); // Перенаправление на страницу профиля после успешной регистрации
      })
      .catch((error) => {
        console.error("Ошибка регистрации:", error);
      });
  };

  const handleLogin = () => {
    if (email === "" || password === "") {
      console.error("Email и пароль не должны быть пустыми.");
      return;
    }

    if (!isValidEmail(email)) {
      console.error("Неверный формат email.");
      return;
    }

    loginUser(email, password)
      .then(() => {
        navigate("/profile"); // Перенаправление на страницу профиля после успешного входа
      })
      .catch((error) => {
        console.error("Ошибка входа:", error);
      });
  };

  const handleGoogleLogin = () => {
    loginWithGoogle()
      .then(() => {
        navigate("/profile"); // Перенаправление на страницу профиля после успешного входа через Google
      })
      .catch((error) => {
        console.error("Ошибка входа через Google:", error);
      });
  };

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
};

export default Registration;
