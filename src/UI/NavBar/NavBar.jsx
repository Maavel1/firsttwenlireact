import React from "react";
import { Link } from "react-router-dom";
import classes from "./NavBar.module.scss";
import logo from "../../assets/logo.png";
import LinkNavigation from "../LinkNavigation/LinkNavigation";
import AuthButtons from "../../components/authButton/AuthButtons"; // Импорт компонента с кнопками

const NavBar = () => {
  return (
    <header className={classes.header}>
      <div className="logo-header">
        <LinkNavigation to="/">
          {" "}
          <img className={classes.logo} src={logo} alt="logo" />
        </LinkNavigation>
      </div>
      <div className={classes.linksHeader}>
        <LinkNavigation to="/">Главная</LinkNavigation>
        <LinkNavigation to="/service">Каталог</LinkNavigation>
        <LinkNavigation to="/contact">О нас</LinkNavigation>
      </div>
      <div className={classes.linksOrderAcount}>
        <AuthButtons /> {/* Вставляем кнопки авторизации и профиля */}
      </div>
    </header>
  );
};

export default NavBar;
