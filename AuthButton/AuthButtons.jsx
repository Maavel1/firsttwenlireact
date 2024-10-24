import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import classes from "./NavBar.module.scss";
import { auth } from "../../base/base"; // Импорт аутентификации Firebase
import { onAuthStateChanged } from "firebase/auth";
import signupImg from "../../assets/Password.svg";
import LoginImg from "../../assets/Login.svg";
import DefaultAvatar from "../../assets/defualt-avatar.png";

const AuthButtons = () => {
  const [user, setUser] = useState(null); // Состояние пользователя
  const [loading, setLoading] = useState(true); // Состояние загрузки

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName || "User",
          email: currentUser.email,
          picture: currentUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false); // Остановка состояния загрузки после проверки аутентификации
    });

    return () => unsubscribe(); // Очистка подписки при размонтировании
  }, []);

  if (loading) {
    return null; // Можно вернуть индикатор загрузки, если нужно
  }

  return (
    <>
      {user ? (
        <>
          <Link to="/profile" className={classes.accountLink}>
            <img
              className={classes.photoUsersNav}
              src={user.picture ? user.picture : DefaultAvatar}
              alt="user photo"
            />
            <span>{user.name}</span>
          </Link>
          <Link to="/order" className={classes.accountLink + " " + classes.Reg}>
            Корзина
          </Link>
        </>
      ) : (
        <>
          <Link
            to="/authorization?login=true"
            className={classes.accountLink + " " + classes.Reg}
          >
            <img src={signupImg} alt="войти" /> Войти
          </Link>
          <Link
            to="/authorization?login=false"
            className={classes.accountLink + " " + classes.orderLink}
          >
            <img src={LoginImg} alt="Регистрация" />
            Регистрация
          </Link>
        </>
      )}
    </>
  );
};

export default AuthButtons;
