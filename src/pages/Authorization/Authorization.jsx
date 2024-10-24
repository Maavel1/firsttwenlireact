import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import classes from "./registration.module.scss";
import { ReactTyped } from "react-typed";
import {
  registerUser,
  loginUser,
  loginWithGoogle,
  sendVerificationEmail,
  resetPassword,
  auth,
} from "../../base/base";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Flex, Checkbox } from "antd";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
} from "firebase/auth"; // Добавляем setPersistence для управления сохранением сессии
import google from "../../assets/Google.svg";
import PhoneAuth from "../../components/PhoneAuth/PhoneAuth";

const Authorization = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [error, setError] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // Управляем "Запомнить меня"
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || ""); // Сохраняем email

  const navigate = useNavigate();
  const location = useLocation(); // Get location
  const [searchParams, setSearchParams] = useSearchParams(); // Initialize useSearchParams

  // Переключение между формами в зависимости от параметров URL
  useEffect(() => {
    const loginParam = searchParams.get("login");

    if (isResetPassword) {
      setIsLogin(false);
      setSearchParams(); // Убираем параметры login из URL
    } else if (loginParam === "true") {
      setIsLogin(true);
      setIsResetPassword(false); // Сбрасываем восстановление пароля
    } else if (loginParam === "false") {
      setIsLogin(false);
      setIsResetPassword(false); // Сбрасываем восстановление пароля
    }
  }, [searchParams, isResetPassword]);

  // Логика для восстановления пароля
  const toggleResetPassword = () => {
    setIsResetPassword(true);
    setSearchParams(); // Сбрасываем параметры ?login
    setError(false);
  };

  // Логика переключения между формами входа/регистрации
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setIsResetPassword(false);
    setSearchParams({ login: !isLogin ? "true" : "false" }); // Меняем URL
    setError(false);
  };

  // Отслеживание состояния аутентификации и автоматический редирект на профиль
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        navigate("/profile");
      } else if (user && !user.emailVerified) {
        setError("Пожалуйста, подтвердите ваш email перед входом.");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Валидация формы
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Неверный формат email")
      .required("Введите ваш email!"),
    password: !isResetPassword
      ? Yup.string().required("Введите ваш пароль!")
      : null,
    confirmPassword:
      !isLogin && !isResetPassword
        ? Yup.string()
            .oneOf([Yup.ref("password"), null], "Пароли не совпадают")
            .required("Подтвердите ваш пароль!")
        : null,
  });

  // Обработка отправки формы
  const handleSubmit = (values) => {
    const { email, password } = values;

    // Логика восстановления пароля
    if (isResetPassword) {
      resetPassword(email)
        .then(() => {
          setError("Письмо для восстановления отправлено на ваш email.");
          setSearchParams({ login: "true" });
        })
        .catch((error) => {
          setError(`Ошибка восстановления пароля: ${error.message}`);
        });
    } else if (isLogin) {
      // Логика входа
      setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      ) // Выбор сессии
        .then(() => {
          return loginUser(email, password); // Выполняем вход
        })
        .then((user) => {
          if (user.emailVerified) {
            if (rememberMe) {
              localStorage.setItem("userEmail", email);
            } else {
              localStorage.removeItem("userEmail");
            }
            navigate("/profile");
          } else {
            setError("Email не подтвержден. Пожалуйста, проверьте почту.");
          }
        })
        .catch((error) => {
          setError(`Ошибка входа: ${error.message}`);
        });
    } else {
      // Логика регистрации
      registerUser(email, password)
        .then((user) => {
          sendVerificationEmail(user); // Отправляем письмо с подтверждением
          setError("Регистрация успешна! Проверьте почту для подтверждения.");
          setTimeout(() => {
            navigate("/profile");
          }, 3000);
        })
        .catch((error) => {
          setError(`Ошибка регистрации: ${error.message}`);
        });
    }
  };

  const backToLogin = () => {
    setIsResetPassword(false);
    setSearchParams({ login: "true" });
  };

  return (
    <div className={classes.formPage}>
      <div className={classes.textMarketing}>
        <h1>
          <span className={classes.titleSpan}>Начнем</span> создавать&nbsp;
          <ReactTyped
            className={classes.ActiveText}
            strings={[
              "корпоративные сайты",
              "интернет-магазины",
              "лендинги",
              "блоги",
              "портфолио",
            ]}
            typeSpeed={50}
            backSpeed={30}
            loop
          />
        </h1>
      </div>
      <div
        className={`${classes.formContainer} ${
          isAnimating ? classes.hide : classes.show
        }`}
      >
        <Formik
          initialValues={{ email, password: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, handleChange, values, errors }) => (
            <Form onFinish={handleSubmit} autoComplete="off">
              <h2 className={classes.titleForm}>
                {isResetPassword
                  ? "Восстановление пароля"
                  : isLogin
                  ? "Вход в личный кабинет"
                  : "Зарегистрируйтесь, чтобы начать"}
              </h2>

              <Form.Item
                label="Email"
                name="email"
                validateStatus={errors.email ? "error" : ""}
                help={errors.email}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                className={classes.customLabel}
              >
                <Input
                  prefix={<MailOutlined />}
                  name="email"
                  className={classes.customInput}
                  onChange={handleChange}
                  value={values.email}
                />
              </Form.Item>

              {!isResetPassword && (
                <>
                  <Form.Item
                    label="Пароль"
                    name="password"
                    validateStatus={errors.password ? "error" : ""}
                    help={errors.password}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    className={classes.customLabel}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      name="password"
                      className={classes.customInput}
                      onChange={handleChange}
                      value={values.password}
                    />
                  </Form.Item>

                  {!isLogin && (
                    <Form.Item
                      className={classes.customLabel}
                      label="Подтвердите пароль"
                      name="confirmPassword"
                      validateStatus={errors.confirmPassword ? "error" : ""}
                      help={errors.confirmPassword}
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        className={classes.customInput}
                        name="confirmPassword"
                        onChange={handleChange}
                        value={values.confirmPassword}
                      />
                    </Form.Item>
                  )}

                  {isLogin && (
                    <Form.Item>
                      <Flex justify="space-between" align="center">
                        <Form.Item
                          name="remember"
                          valuePropName="checked"
                          noStyle
                        >
                          <Checkbox
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                          >
                            Запомнить меня
                          </Checkbox>
                        </Form.Item>
                        <a onClick={toggleResetPassword}>Забыли пароль?</a>
                      </Flex>
                    </Form.Item>
                  )}
                </>
              )}

              {error && (
                <p
                  className={classes.notificationAuth}
                  style={{ color: "red" }}
                >
                  {error}
                  {isResetPassword && (
                    <a type="link" onClick={toggleForm}>
                      {" "}
                      войти в личный кабинет
                    </a>
                  )}
                </p>
              )}
              <div className={classes.btnSubmitForm}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    {isResetPassword
                      ? "Восстановить пароль"
                      : isLogin
                      ? "Войти"
                      : "Зарегистрироваться"}
                  </Button>
                </Form.Item>
              </div>
              {!isResetPassword && (
                <div className={classes.formLinks}>
                  <p>
                    {isLogin
                      ? "У вас еще нет аккаунта? "
                      : "У вас уже есть аккаунт? "}
                    <a type="link" onClick={toggleForm}>
                      {isLogin ? "Зарегистрироваться" : "Войти"}
                    </a>
                  </p>
                  <span className={classes.or}>ИЛИ</span>
                  <Button onClick={loginWithGoogle}>
                    <img src={google} alt="google" /> Войти через Google
                  </Button>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Authorization;
