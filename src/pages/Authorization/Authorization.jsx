import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import classes from "./registration.module.scss";
import { registerUser, loginUser, resetPassword, auth } from "../../base/base";
import * as Yup from "yup";
import FormContainer from "../../components/FormContainer/FormContainer";
import AuthForm from "../../components/AuthForm/AuthForm";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { ReactTyped } from "react-typed";

const Authorization = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [error, setError] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const loginParam = searchParams.get("login");

    if (isResetPassword) {
      setIsLogin(false);
      setSearchParams();
    } else if (loginParam === "true") {
      setIsLogin(true);
      setIsResetPassword(false);
    } else if (loginParam === "false") {
      setIsLogin(false);
      setIsResetPassword(false);
    }
  }, [searchParams, isResetPassword]);

  const toggleResetPassword = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setIsResetPassword(true);
      setSearchParams();
      setError(false);
    }, 400);
  };

  const toggleForm = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setIsLogin((prev) => !prev);
      setIsResetPassword(false);
      setSearchParams({ login: !isLogin ? "true" : "false" });
      setError(false);
    }, 400);
  };

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

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.emailVerified) {
        navigate("/profile");
      } else {
        setError("Email не подтвержден. Пожалуйста, проверьте почту.");
      }
    } catch (error) {
      setError(`Ошибка авторизации через Google: ${error.message}`);
    }
  };

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

  const handleSubmit = (values) => {
    const { email, password } = values;

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
      setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      )
        .then(() => {
          return loginUser(email, password);
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
      <FormContainer isAnimating={isAnimating}>
        <AuthForm
          initialValues={{ email, password: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          isLogin={isLogin}
          isResetPassword={isResetPassword}
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
          error={error}
          toggleResetPassword={toggleResetPassword}
          toggleForm={toggleForm}
          loginWithGoogle={loginWithGoogle} // Теперь loginWithGoogle передается корректно
        />
      </FormContainer>
    </div>
  );
};

export default Authorization;
