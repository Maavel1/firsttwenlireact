import { Link, useLocation } from "react-router-dom";
import classes from "./NavBar.module.scss";
import logo from "../../assets/logo.png";

export default function NavBar() {
  const location = useLocation();
  return (
    <>
      <header className={classes.header}>
        <div className="logo-header">
          <img className={classes.logo} src={logo} alt="logo" />
        </div>
        <div className={classes.linksHeader}>
          <Link
            to="/"
            className={location.pathname === "/" ? classes.active : ""}
          >
            Главная
          </Link>
          <Link
            to="/service"
            className={location.pathname === "/service" ? classes.active : ""}
          >
            Каталог
          </Link>
          <Link
            to="/contact"
            className={location.pathname === "/contact" ? classes.active : ""}
          >
            О нас
          </Link>
        </div>
        <div className={classes.linksOrderAcount}>
          <Link
            to="/registration"
            className={classes.accountLink + " " + classes.Reg}
          >
            Регистрация
          </Link>
          <Link to="/order" className={classes.orderLink}>
            Корзина
          </Link>
        </div>
      </header>
    </>
  );
}
