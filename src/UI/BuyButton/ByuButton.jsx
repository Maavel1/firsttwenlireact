import React, { useState } from "react";
import { message, Modal } from "antd";
import clasess from "./ByButton.module.scss";

const { confirm } = Modal;

export default function ByuButton({ isAuthorized, item }) {
  const [isCartUpdated, setIsCartUpdated] = useState(false); // Состояние для отслеживания обновления корзины

  const handleClick = () => {
    if (!isAuthorized) {
      confirm({
        title: "Авторизация необходима",
        content: "Сначала авторизуйтесь, чтобы сделать заказ.",
        onOk() {
          message.info("Перенаправление на страницу входа...");
          // Здесь можно добавить навигацию на страницу входа, если нужно
        },
        onCancel() {
          console.log("Отмена");
        },
        okText: "ОК",
        cancelText: "Отмена",
      });
    } else {
      const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
      const isItemInCart = existingCart.some(
        (cartItem) => cartItem.id === item.id
      );

      if (!isItemInCart && !isCartUpdated) {
        const updatedCart = [...existingCart, item];
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        message.success("Товар добавлен в корзину!");
        setIsCartUpdated(true); // Обновляем состояние
      } else {
        message.warning("Товар уже в корзине!"); // Уведомление о том, что товар уже в корзине
      }
    }
  };

  return (
    <div>
      <button className={clasess.ByButton} onClick={handleClick}>
        Заказать
      </button>
    </div>
  );
}
