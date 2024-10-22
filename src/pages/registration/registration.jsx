import { useState } from "react";
import {
  registerUser,
  loginUser,
  logoutUser,
  loginWithGoogle,
  sendVerificationEmail,
} from "../../base/base";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input } from "antd";
import * as Yup from "yup"; // Импортируем Yup
import { Formik } from "formik"; // Импортируем Formik

const Registration = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Создаем схему валидации с помощью Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Неверный формат email")
      .required("Введите ваш email!"),
    password: Yup.string().required("Введите ваш пароль!"),
    confirmPassword: isLogin
      ? null
      : Yup.string()
          .oneOf([Yup.ref("password"), null], "Пароли не совпадают")
          .required("Подтвердите ваш пароль!"),
  });

  const handleSubmit = (values) => {
    const { email, password } = values;

    if (isLogin) {
      // Логика для входа
      loginUser(email, password)
        .then((user) => {
          if (user.emailVerified) {
            navigate("/profile"); // Редирект на профиль после успешного входа
          } else {
            setError("Email не подтвержден. Пожалуйста, проверьте почту.");
          }
        })
        .catch((error) => {
          setError(`Ошибка входа: ${error.message}`);
        });
    } else {
      // Логика для регистрации
      registerUser(email, password)
        .then((user) => {
          sendVerificationEmail(user); // Отправка письма для подтверждения
          setError("Регистрация успешна! Проверьте почту для подтверждения.");
          setTimeout(() => {
            navigate("/profile"); // Редирект на профиль после регистрации
          }, 3000);
        })
        .catch((error) => {
          setError(`Ошибка регистрации: ${error.message}`);
        });
    }
  };

  return (
    <div>
      <h2>{isLogin ? "Вход" : "Регистрация"}</h2>
      <Formik
        initialValues={{ email: "", password: "", confirmPassword: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, handleChange, values, errors }) => (
          <Form onFinish={handleSubmit} autoComplete="off">
            <Form.Item
              label="Email"
              name="email"
              validateStatus={errors.email ? "error" : ""}
              help={errors.email}
            >
              <Input
                name="email"
                onChange={handleChange}
                value={values.email}
              />
            </Form.Item>

            <Form.Item
              label="Пароль"
              name="password"
              validateStatus={errors.password ? "error" : ""}
              help={errors.password}
            >
              <Input.Password
                name="password"
                onChange={handleChange}
                value={values.password}
              />
            </Form.Item>

            {!isLogin && (
              <Form.Item
                label="Подтвердите пароль"
                name="confirmPassword"
                validateStatus={errors.confirmPassword ? "error" : ""}
                help={errors.confirmPassword}
              >
                <Input.Password
                  name="confirmPassword"
                  onChange={handleChange}
                  value={values.confirmPassword}
                />
              </Form.Item>
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}

            <Form.Item>
              <Button type="primary" htmlType="submit">
                {isLogin ? "Войти" : "Зарегистрироваться"}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>

      <p>
        {isLogin ? "У вас еще нет аккаунта? " : "У вас уже есть аккаунт? "}
        <Button type="link" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Зарегистрироваться" : "Войти"}
        </Button>
      </p>

      <Button onClick={loginWithGoogle}>Войти через Google</Button>
    </div>
  );
};

export default Registration;
