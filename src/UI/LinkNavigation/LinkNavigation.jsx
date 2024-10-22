import { Link, useLocation } from "react-router-dom";
import classes from "../NavBar/NavBar.module.scss";
export default function LinkNavigation({ to, children }) {
  const location = useLocation();

  return (
    <Link to={to} className={location.pathname === to ? classes.active : ""}>
      {children}
    </Link>
  );
}
