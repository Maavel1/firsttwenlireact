import React, { useState } from "react";
import {
  getAuth,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { Input, Button, message, Collapse, Switch } from "antd";
import classes from "./securityTab.module.scss";

const SecurityTab = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification Settings
  const [notifications, setNotifications] = useState({
    newDeviceLogin: true,
    passwordChange: true,
    failedLoginAttempt: false,
  });

  const handleNotificationChange = (type) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 6;

    if (!hasUpperCase) {
      message.error("Пароль должен содержать хотя бы одну заглавную букву.");
      return false;
    }
    if (!hasNumber) {
      message.error("Пароль должен содержать хотя бы одну цифру.");
      return false;
    }
    if (!hasMinLength) {
      message.error("Пароль должен содержать не менее 6 символов.");
      return false;
    }
    return true;
  };

  const handlePasswordChange = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      message.error("Пользователь не авторизован.");
      return;
    }

    if (newPassword !== confirmPassword) {
      message.error("Новый пароль и подтверждение не совпадают.");
      return;
    }

    if (!validatePassword(newPassword)) {
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);
      message.success("Пароль успешно изменен.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Ошибка при смене пароля:", error);
      if (error.code === "auth/wrong-password") {
        message.error("Текущий пароль введен неверно.");
      } else {
        message.error(
          "Не удалось сменить пароль. Проверьте данные и попробуйте снова."
        );
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "15px" }}>
      <Collapse accordion>
        <Collapse.Panel header="Сменить пароль" key="1">
          <div className={classes.formNewPass}>
            <Input.Password
              placeholder="Текущий пароль"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <Input.Password
              placeholder="Новый пароль"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <Input.Password
              placeholder="Подтвердите новый пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <Button type="primary" onClick={handlePasswordChange}>
              Сменить пароль
            </Button>
          </div>
        </Collapse.Panel>
        <Collapse.Panel
          header="Двухэтапная аутентификация (недоступно)"
          key="2"
          disabled
        >
          <p>Эта панель заблокирована.</p>
        </Collapse.Panel>
        <Collapse.Panel
          disabled
          header="Настройки уведомлений о безопасности (недоступно)"
          key="3"
        >
          <div className={classes.notificationSettings}>
            <p>
              <Switch
                checked={notifications.newDeviceLogin}
                onChange={() => handleNotificationChange("newDeviceLogin")}
              />{" "}
              Уведомлять о входе с нового устройства
            </p>
            <p>
              <Switch
                checked={notifications.passwordChange}
                onChange={() => handleNotificationChange("passwordChange")}
              />{" "}
              Уведомлять о смене пароля
            </p>
            <p>
              <Switch
                checked={notifications.failedLoginAttempt}
                onChange={() => handleNotificationChange("failedLoginAttempt")}
              />{" "}
              Уведомлять о неудачной попытке входа
            </p>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default SecurityTab;
