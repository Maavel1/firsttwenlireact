import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Formik } from "formik";
import * as Yup from "yup";
import classes from "../../pages/Authorization/registration.module.scss";
import FirebaseImageByName from "../FirebaseImage/FirebaseImage";

const AuthForm = ({
  initialValues = { email: "", password: "", confirmPassword: "" },
  onSubmit,
  isLogin,
  isResetPassword,
  rememberMe,
  setRememberMe,
  error,
  toggleResetPassword,
  toggleForm,
  loginWithGoogle,
}) => {
  // Создание схемы валидации
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Некорректный email")
      .required("Email обязателен"),
    password: Yup.string()
      .min(6, "Пароль должен содержать не менее 6 символов")
      .matches(/^[a-zA-Z]+$/, "Пароль должен содержать только английские буквы")
      .matches(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
      .required("Пароль обязателен"),
    confirmPassword: isLogin
      ? Yup.string()
      : Yup.string()
          .oneOf([Yup.ref("password"), null], "Пароли должны совпадать")
          .required("Подтверждение пароля обязательно"),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ handleSubmit, handleChange, values, errors, touched }) => (
        <Form onFinish={handleSubmit} autoComplete="off">
          <h2 className={classes.titleForm}>
            {isResetPassword ? (
              <div className={classes.titleFormResetPass}>
                <a type="link" onClick={toggleForm}>
                  <FirebaseImageByName
                    imageName="arrow-u-up-left-svgrepo-com.svg"
                    alt="arrow"
                  />
                </a>
                Восстановление пароля
              </div>
            ) : isLogin ? (
              "Вход в личный кабинет"
            ) : (
              "Зарегистрируйтесь, чтобы начать"
            )}
          </h2>

          <Form.Item
            label="Email"
            validateStatus={touched.email && errors.email ? "error" : ""}
            help={touched.email && errors.email}
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
                validateStatus={
                  touched.password && errors.password ? "error" : ""
                }
                help={touched.password && errors.password}
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
                  label="Подтвердите пароль"
                  validateStatus={
                    touched.confirmPassword && errors.confirmPassword
                      ? "error"
                      : ""
                  }
                  help={touched.confirmPassword && errors.confirmPassword}
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
                  <div className={classes.flexContainer}>
                    <div className={classes.rememBer_ResetPass_Flex}>
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
                    </div>
                  </div>
                </Form.Item>
              )}
            </>
          )}

          {error && (
            <p className={classes.notificationAuth} style={{ color: "red" }}>
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
                <FirebaseImageByName imageName="Google.svg" alt="google" />{" "}
                Войти через Google
              </Button>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default AuthForm;
