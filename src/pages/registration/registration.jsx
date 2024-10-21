import { useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const Registration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userInfo, setUserInfo] = useState(null); // Новое состояние для хранения информации о пользователе

  const handleRegister = () => {
    // Ваш код для регистрации
  };

  const handleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Устанавливаем информацию о пользователе в состояние
      setUserInfo({
        email: user.email,
        photoURL: user.photoURL,
      });
    } catch (error) {
      console.error("Error logging in with Google: ", error);
    }
  };

  const handleLogout = () => {
    // Ваш код для выхода
    setUserInfo(null); // Очищаем информацию о пользователе
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
      <button onClick={handleLogin}>Login with Google</button>
      <button onClick={handleLogout}>Logout</button>

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
