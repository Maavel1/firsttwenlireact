import { useState, useEffect } from "react";
import classes from "./registration.module.scss";
import {
  registerUser,
  loginUser,
  logoutUser,
  loginWithGoogle,
  sendVerificationEmail,
  auth,
} from "../../base/base";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input } from "antd";
import * as Yup from "yup";
import { Formik } from "formik";
import { onAuthStateChanged } from "firebase/auth";
import { ReactTyped } from "react-typed";
import google from "../../assets/Google.svg";

const Registration = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState("");
  const [isAnimationActive, setIsAnimationActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/profile");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

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
      loginUser(email, password)
        .then((user) => {
          if (user.emailVerified) {
            navigate("/profile");
          } else {
            setError("Email не подтвержден. Пожалуйста, проверьте почту.");
          }
        })
        .catch((error) => {
          setError(`Ошибка входа: ${error.message}`);
        });
    } else {
      registerUser(email, password)
        .then((user) => {
          sendVerificationEmail(user);
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

  const toggleForm = () => {
    setIsAnimationActive(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsAnimationActive(false);
    }, 500);
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
          isAnimationActive ? "" : classes.show
        }`}
      >
        <Formik
          initialValues={{ email: "", password: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, handleChange, values, errors }) => (
            <Form onFinish={handleSubmit} autoComplete="off">
              <h2 className={classes.titleForm}>
                {isLogin ? "Вход" : "Регистрация"}
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
                  name="email"
                  className={classes.customInput}
                  onChange={handleChange}
                  value={values.email}
                />
              </Form.Item>

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
                  name="password"
                  className={classes.customInput}
                  onChange={handleChange}
                  value={values.password}
                />
              </Form.Item>

              <div className="login">
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
                      className={classes.customInput}
                      name="confirmPassword"
                      onChange={handleChange}
                      value={values.confirmPassword}
                    />
                  </Form.Item>
                )}
              </div>

              {error && <p style={{ color: "red" }}>{error}</p>}

              <div className={classes.btnSubmitForm}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    {isLogin ? "Войти" : "Зарегистрироваться"}
                  </Button>
                </Form.Item>
              </div>
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
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Registration;
