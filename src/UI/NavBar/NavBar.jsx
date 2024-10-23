import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import classes from "./NavBar.module.scss";
import logo from "../../assets/logo.png";
import { auth } from "../../base/base";
import { onAuthStateChanged } from "firebase/auth";
import LinkNavigation from "../LinkNavigation/LinkNavigation";

const NavBar = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
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
              Профиль
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
              Войти
            </Link>
            <Link
              to="/authorization?login=false"
              className={classes.accountLink + " " + classes.orderLink}
            >
              Регистрация
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default NavBar;
