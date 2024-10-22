import { useState } from "react";
import {
  registerUser,
  loginUser,
  logoutUser,
  loginWithGoogle,
  sendVerificationEmail, // Импортируем корректную функцию
} from "../../base/base";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = () => {
    if (email === "" || password === "" || confirmPassword === "") {
      setError("Email и пароль не должны быть пустыми.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Неверный формат email.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают.");
      return;
    }

    registerUser(email, password)
      .then((user) => {
        sendVerificationEmail(user); // Отправка письма с подтверждением
        setError("Регистрация успешна! Проверьте почту для подтверждения.");
        setTimeout(() => {
          navigate("/profile");
        }, 3000);
      })
      .catch((error) => {
        setError(`Ошибка регистрации: ${error.message}`);
      });
  };

  const handleLogin = () => {
    if (email === "" || password === "") {
      setError("Email и пароль не должны быть пустыми.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Неверный формат email.");
      return;
    }

    loginUser(email, password)
      .then((user) => {
        if (user.emailVerified) {
          setIsEmailVerified(true);
          navigate("/profile");
        } else {
          setError("Email не подтвержден. Пожалуйста, проверьте почту.");
        }
      })
      .catch((error) => {
        setError(`Ошибка входа: ${error.message}`);
      });
  };

  const handleGoogleLogin = () => {
    loginWithGoogle()
      .then(() => {
        navigate("/profile");
      })
      .catch((error) => {
        setError(`Ошибка входа через Google: ${error.message}`);
      });
  };

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <div>
      <h2>Регистрация</h2>
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
        placeholder="Пароль"
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Подтвердите пароль"
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleRegister}>Зарегистрироваться</button>
      <button onClick={handleLogin}>Войти</button>
      <button onClick={handleLogout}>Выйти</button>
      <button onClick={handleGoogleLogin}>Войти через Google</button>
    </div>
  );
};

export default Registration;
