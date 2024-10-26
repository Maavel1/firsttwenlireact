import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Formik } from "formik";
import * as Yup from "yup";
import classes from "../../pages/Authorization/registration.module.scss";
import google from "../../assets/Google.svg";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import arrow from "../../assets/arrow-u-up-left-svgrepo-com.svg";
import LinkNavigation from "../../UI/LinkNavigation/LinkNavigation";
import FirebaseImageByName from "../FirebaseImage/FirebaseImage";

const AuthForm = ({
  initialValues = { email: "", password: "", confirmPassword: "" },
  validationSchema,
  onSubmit,
  isLogin,
  isResetPassword,
  rememberMe,
  setRememberMe,
  error,
  toggleResetPassword,
  toggleForm,
  loginWithGoogle = { loginWithGoogle },
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ handleSubmit, handleChange, values, errors }) => (
        <Form onFinish={handleSubmit} autoComplete="off">
          <h2 className={classes.titleForm}>
            {isResetPassword ? (
              <div className={classes.titleFormResetPass}>
                <a type="link" onClick={toggleForm}>
                  {" "}
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
