import { Children } from "react";
import classes from "./button.module.scss";

export default function Button({ children, ...props }) {
  return (
    <button {...props} className={classes.button}>
      {children}
    </button>
  );
}
