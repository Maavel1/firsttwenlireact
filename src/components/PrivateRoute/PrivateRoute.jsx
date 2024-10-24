import React from "react";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Loader from "../../UI/Loader/loader";

const PrivateRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(null); // Установим начальное значение null
  const [loading, setLoading] = React.useState(true); // Добавим состояние загрузки

  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false); // Установим загрузку в false после проверки
    });

    return () => unsubscribe();
  }, []);

  // Если состояние загрузки еще не установлено, показываем индикатор загрузки
  if (loading) {
    return <Loader />; // Вы можете заменить это на свой индикатор загрузки
  }

  // Перенаправляем в зависимости от состояния аутентификации
  return isAuthenticated ? element : <Navigate to="/authorization" />;
};

export default PrivateRoute;
