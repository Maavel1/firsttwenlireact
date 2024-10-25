import React from "react";
import classes from "../../pages/Authorization/registration.module.scss";

const FormContainer = ({ isAnimating, children }) => {
  return (
    <div
      className={`${classes.formContainer} ${
        isAnimating ? classes.hide : classes.show
      }`}
    >
      {children}
    </div>
  );
};

export default FormContainer;
