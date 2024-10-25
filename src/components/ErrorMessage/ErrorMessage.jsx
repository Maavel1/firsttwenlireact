import React from "react";

const ErrorMessage = ({ message, toggleForm }) => {
  return (
    <p style={{ color: "red" }}>
      {message}
      <a onClick={toggleForm}> войти в личный кабинет</a>
    </p>
  );
};

export default ErrorMessage;
