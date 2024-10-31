import React from "react";
import { Link } from "react-router-dom";
import classes from "../../UI/NavBar/NavBar.module.scss";
import DefaultAvatar from "../../assets/defualt-avatar.png";
import { Skeleton } from "antd"; // Импорт Skeleton из antd
import FirebaseImageByName from "../FirebaseImage/FirebaseImage";
import { useUser } from "../../components/UserContext/UserContext"; // Убедитесь, что путь правильный

const AuthButtons = ({ cart }) => {
  const { user, loading } = useUser(); // Получите user и loading из контекста

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
              src={user.picture || DefaultAvatar}
              alt="user photo"
            />
            <span>{user.name}</span>
          </Link>
          <Link
            to="/order"
            state={{ cart }} // Передаем корзину в состоянии
            className={`${classes.accountLink} ${classes.Reg}`}
          >
            Корзина
          </Link>
        </>
      ) : (
        <>
          <Link
            to="/authorization?login=true"
            className={`${classes.accountLink} ${classes.Reg}`}
          >
            <FirebaseImageByName imageName="Password.svg" alt="sign" /> Войти
          </Link>
          <Link
            to="/authorization?login=false"
            className={`${classes.accountLink} ${classes.orderLink}`}
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
