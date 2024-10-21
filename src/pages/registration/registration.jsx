import { useState } from "react";
import {
  registerUser,
  loginUser,
  logoutUser,
  loginWithGoogle,
} from "../../base/base"; // Добавим функцию для входа через Google

const Registration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userInfo, setUserInfo] = useState(null); // Новое состояние для хранения информации о пользователе

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

    registerUser(email, password);
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

    loginUser(email, password);
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await loginWithGoogle(); // Вход через Google
      if (user) {
        // Устанавливаем информацию о пользователе в состояние
        setUserInfo({
          email: user.email,
          photoURL: user.photoURL,
        });
      }
    } catch (error) {
      console.error("Ошибка при входе через Google: ", error);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUserInfo(null); // Очищаем информацию о пользователе при выходе
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

      {/* Отображаем информацию о пользователе */}
      {userInfo && (
        <div>
          <h2>Welcome, {userInfo.email}</h2>
          {userInfo.photoURL && <img src={userInfo.photoURL} alt="Profile" />}
        </div>
      )}
    </div>
  );
};

export default Registration;
