import React, { useState } from "react";
import { Link } from "react-router-dom";
import classes from "./NavBar.module.scss";
import logo from "../../assets/logo.png";
import LinkNavigation from "../LinkNavigation/LinkNavigation";
import AuthButtons from "../../components/authButton/AuthButtons"; // Импорт компонента с кнопками
import FirebaseImage from "../../components/FirebaseImage/FirebaseImage";

const NavBar = () => {
  const [cart, setCart] = useState([]); // Состояние корзины
  return (
    <header className={classes.header}>
      <div className="logo-header">
        <LinkNavigation to="/">
          {" "}
          <FirebaseImage
            imageName="logo.png"
            alt="Logo"
            className={classes.logo}
          />
        </LinkNavigation>
      </div>
      <div className={classes.linksHeader}>
        <LinkNavigation to="/">Главная</LinkNavigation>
        <LinkNavigation to="/service">Каталог</LinkNavigation>
        <LinkNavigation to="/contact">О нас</LinkNavigation>
      </div>
      <div className={classes.linksOrderAcount}>
        <AuthButtons cart={cart} />
      </div>
    </header>
  );
};

export default NavBar;
