import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classes from "../../UI/NavBar/NavBar.module.scss";
import { auth } from "../../base/base"; // Импорт аутентификации Firebase
import { onAuthStateChanged } from "firebase/auth";
import signupImg from "../../assets/Password.svg";
import LoginImg from "../../assets/Login.svg";
import DefaultAvatar from "../../assets/defualt-avatar.png";
import { Skeleton } from "antd"; // Импорт Skeleton из antd
import FirebaseImageByName from "../FirebaseImage/FirebaseImage";

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
    // Отображение Skeleton, пока идет загрузка
    return (
      <div className={classes.skeletonWrapper}>
        <Skeleton.Avatar active size="large" shape="circle" />
        <Skeleton.Input style={{ width: 235, marginLeft: "10px" }} active />
      </div>
    );
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
            <FirebaseImageByName imageName="Password.svg" alt="sign" /> Войти
          </Link>
          <Link
            to="/authorization?login=false"
            className={classes.accountLink + " " + classes.orderLink}
          >
            <FirebaseImageByName imageName="Login.svg" alt="log in" />
            Регистрация
          </Link>
        </>
      )}
    </>
  );
};

export default AuthButtons;
