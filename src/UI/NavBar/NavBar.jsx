import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import classes from "./NavBar.module.scss";
import logo from "../../assets/logo.png";
import { auth } from "../../base/base"; // Импорт аутентификации Firebase
import { onAuthStateChanged } from "firebase/auth";
import LinkNavigation from "../LinkNavigation/LinkNavigation";
import signupImg from "../../assets/Password.svg";
import LoginImg from "../../assets/Login.svg";

const NavBar = () => {
  const [user, setUser] = useState(null); // Перемещаем хуки внутрь компонента
  const location = useLocation();

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
    });

    return () => unsubscribe(); // Очистка подписки
  }, []);

  return (
    <header className={classes.header}>
      <div className="logo-header">
        <img className={classes.logo} src={logo} alt="logo" />
      </div>
      <div className={classes.linksHeader}>
        <LinkNavigation to="/">Главная</LinkNavigation>
        <LinkNavigation to="/service">Каталог</LinkNavigation>
        <LinkNavigation to="/contact">О нас</LinkNavigation>
      </div>
      <div className={classes.linksOrderAcount}>
        {user ? (
          <>
            <Link to="/profile" className={classes.accountLink}>
              <img
                className={classes.photoUsersNav}
                src={user.picture}
                alt="user photo"
              />
              <span>{user.name}</span>
            </Link>
            <Link
              to="/order"
              className={classes.accountLink + " " + classes.Reg}
            >
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
      </div>
    </header>
  );
};

export default NavBar;
