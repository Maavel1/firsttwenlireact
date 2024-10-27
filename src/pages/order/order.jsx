import React, { useEffect, useState } from "react";

const Order = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Загружаем корзину из локального хранилища при первом рендере
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const totalPrice = cart.reduce((acc, item) => {
    // Проверяем наличие item и price перед добавлением
    return acc + (item?.price || 0); // Если item равен null или price не определено, добавляем 0
  }, 0);

  const removeItem = (id) => {
    // Удаляем товар из корзины
    const updatedCart = cart.filter((item) => item && item.id !== id); // Проверяем item на null
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Сохраняем обновлённую корзину в локальном хранилище
  };

  return (
    <div>
      <h2>Ваш заказ</h2>
      {cart.length > 0 ? (
        <>
          {cart.map((item, index) => {
            // Проверяем, что item не равен null и у него есть необходимые свойства
            if (!item) {
              return <p key={`${index}`}>Некорректный товар в корзине.</p>;
            }
            return (
              <div key={`${item.id}-${index}`}>
                {/* Генерация уникального ключа */}
                <h3>{item.name || "Без названия"}</h3>
                <p>{item.price ? `${item.price} ₸` : "Цена не указана"}</p>
                <button onClick={() => removeItem(item.id)}>
                  Удалить
                </button>{" "}
                {/* Кнопка удаления товара */}
              </div>
            );
          })}
          <h3>Итого: {totalPrice.toLocaleString()} ₸</h3>
        </>
      ) : (
        <p>Корзина пуста.</p>
      )}
    </div>
  );
};

export default Order;
