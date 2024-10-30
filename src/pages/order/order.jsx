import React, { useEffect, useState } from "react";
import classes from "../order/orders.module.scss";
import FirebaseImageByName from "../../components/FirebaseImage/FirebaseImage";
import LinkNavigation from "../../UI/LinkNavigation/LinkNavigation";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Input, Button, notification, Checkbox } from "antd";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";

const Order = () => {
  const [cart, setCart] = useState([]);
  const [finalPrice, setFinalPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const db = getFirestore();
  const auth = getAuth();
  const [promoError, setPromoError] = useState("");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    const price = calculateTotalPrice(storedCart);
    setOriginalPrice(price);
    setFinalPrice(price);
  }, []);

  const calculateTotalPrice = (items) => {
    return items.reduce((acc, item) => {
      return acc + (item?.price || 0) * (item?.quantity || 1);
    }, 0);
  };

  const updateCartItem = (id, quantityChange) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max((item.quantity || 1) + quantityChange, 1);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    const price = calculateTotalPrice(updatedCart);
    setOriginalPrice(price);
    setFinalPrice(price);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    const price = calculateTotalPrice(updatedCart);
    setOriginalPrice(price);
    setFinalPrice(price);
  };

  const validatePromoCode = async (promoCode, orderValue) => {
    if (!promoCode) return { discount: 0, promoData: null, promoDocId: null };

    setPromoError("");
    try {
      const promoQuery = query(
        collection(db, "promocodes"),
        where("code", "==", promoCode),
        where("isActive", "==", true)
      );

      const querySnapshot = await getDocs(promoQuery);
      if (querySnapshot.empty) {
        setPromoError("Неверный или неактивный промокод.");
        return { discount: 0, promoData: null, promoDocId: null }; // Вернем 0, если промокод недействителен
      }

      const promoData = querySnapshot.docs[0].data();
      const promoDocId = querySnapshot.docs[0].id; // Получаем ID документа
      const isExpired =
        promoData.expirationDate &&
        promoData.expirationDate.toDate() < new Date();

      if (isExpired) {
        setPromoError("Срок действия промокода истек.");
        return { discount: 0, promoData: null, promoDocId }; // Вернем 0, если промокод истек
      }

      // Проверка минимальной суммы заказа
      if (orderValue < promoData.minimumOrderValue) {
        setPromoError(
          `Минимальная сумма заказа для использования этого промокода: ${promoData.minimumOrderValue} ₸.`
        );
        return { discount: 0, promoData: null, promoDocId }; // Вернем 0, если сумма заказа меньше минимальной
      }

      // Проверка использования промокода
      if (promoData.isReusable <= promoData.usedCount) {
        setPromoError(
          "Этот промокод был использован максимальное количество раз."
        );
        return { discount: 0, promoData: null, promoDocId }; // Вернем 0, если промокод исчерпан
      }

      return { discount: promoData.discount || 0, promoData, promoDocId }; // Возвращаем объект с данными о скидке, промокоде и ID документа
    } catch (error) {
      console.error("Ошибка при проверке промокода:", error);
      setPromoError("Ошибка при проверке промокода.");
      return { discount: 0, promoData: null, promoDocId: null }; // Вернем 0 в случае ошибки
    }
  };
  const handleSubmitOrder = async (values) => {
    const user = auth.currentUser;
    if (!user) {
      notification.error({
        message: "Ошибка",
        description: "Пожалуйста, войдите, чтобы оформить заказ.",
      });
      return;
    }

    if (cart.length === 0) {
      notification.error({
        message: "Ошибка",
        description: "Корзина не может быть пустой.",
      });
      return;
    }

    try {
      const { discount, promoData, promoDocId } = await validatePromoCode(
        values.promoCode,
        originalPrice
      );

      if (discount === 0 && values.promoCode) {
        notification.error({
          message: "Ошибка",
          description: promoError || "Промокод недействителен.",
        });
        return;
      }

      const finalOrderPrice = originalPrice * (1 - discount / 100);

      // Генерация номера заказа
      const orderDate = new Date();
      const formattedDate = `${orderDate.getFullYear()}${String(
        orderDate.getMonth() + 1
      ).padStart(2, "0")}-${String(orderDate.getDate()).padStart(2, "0")}`; // ГГГГММ-ДД
      const orderCount = await getOrderCount(user.uid); // Получаем количество заказов пользователя
      const orderNumber = `ORD${formattedDate}-${String(
        orderCount + 1
      ).padStart(3, "0")}`; // Например, ORD202410-001

      const orderData = {
        orderNumber, // Добавляем номер заказа
        userId: user.uid,
        items: cart,
        totalPrice: finalOrderPrice,
        promoCode: values.promoCode || null,
        orderDate: new Date().toISOString(),
      };

      await addDoc(collection(db, "ListOrders", user.uid, "orders"), orderData);

      if (promoData) {
        const promoDocRef = doc(db, "promocodes", promoDocId);
        await updateDoc(promoDocRef, {
          usedCount: promoData.usedCount + 1,
        });
      }

      notification.success({
        message: "Успех",
        description: `Ваш заказ был успешно отправлен! Номер заказа: ${orderNumber}`,
      });

      setCart([]);
      localStorage.removeItem("cart");
      setFinalPrice(0);
      setOriginalPrice(0);
    } catch (error) {
      console.error("Ошибка при отправке заказа:", error);
      notification.error({
        message: "Ошибка",
        description:
          "Произошла ошибка при оформлении заказа. Попробуйте еще раз.",
      });
    }
  };

  // Функция для получения количества заказов пользователя
  const getOrderCount = async (userId) => {
    const ordersCollection = collection(db, "ListOrders", userId, "orders");
    const ordersSnapshot = await getDocs(ordersCollection);
    return ordersSnapshot.size; // Возвращаем количество заказов
  };
  const validationSchema = Yup.object().shape({
    promoCode: Yup.string()
      .min(3, "Промокод слишком короткий")
      .max(10, "Промокод слишком длинный")
      .nullable(), // Необязательное поле
  });

  return (
    <div className={classes.ordersRows}>
      <div className={classes.listOrders}>
        {cart.length > 0 ? (
          <>
            <h2>Ваши заказы</h2>
            {cart.map((item, index) => (
              <div
                className={classes.ContaunerlistOrders}
                key={`${item.id}-${index}`}
              >
                <div className={classes.MainInfoCard}>
                  <div className={classes.imgCardOrders}>
                    <img src={item.imageUrl} alt="" />
                  </div>
                  <div className={classes.InfoCardOrders}>
                    <h3>{item.name || "Без названия"}</h3>
                    <p>{item.price ? `${item.price} ₸` : "Цена не указана"}</p>
                  </div>
                  <div className={classes.InfoCardOrders}>
                    <p>Категория</p>
                    <p>{item.category || "Описание отсутствует"}</p>
                  </div>
                  <div className={classes.quantityControls}>
                    <button onClick={() => updateCartItem(item.id, -1)}>
                      -
                    </button>
                    <span>{item.quantity || 1}</span>
                    <button onClick={() => updateCartItem(item.id, 1)}>
                      +
                    </button>
                  </div>
                </div>
                <div className={classes.BtnDeleteOrders}>
                  <button onClick={() => removeItem(item.id)}>
                    <FirebaseImageByName imageName="close.svg" alt="close" />
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className={classes.NoneOrders}>
            <div className={classes.rowsNoneOrders}>
              <div className={classes.titleRowsNoneOrders}>
                <h1>Корзина пустая</h1>
                <FirebaseImageByName imageName="smile.png" alt="smile" />
              </div>
              <div className={classes.DecrRowsNoneOrders}>
                <p>
                  Вероятнее всего, вы еще не добавляли услуги в корзину. Чтобы
                  заказать услугу, перейдите на страницу Каталог.
                </p>
              </div>
              <div className={classes.imageNoneOrders}>
                <FirebaseImageByName imageName="digital.svg" alt="close" />
              </div>
              <LinkNavigation to="/service" className={classes.BtnNoneOrders}>
                Посмотреть услуги
              </LinkNavigation>
            </div>
          </div>
        )}
      </div>
      <div className={classes.ByFormOrdersRows}>
        <Formik
          initialValues={{ promoCode: "", agreement: false }} // Добавляем поле для согласия
          validationSchema={Yup.object().shape({
            promoCode: Yup.string(),
            agreement: Yup.bool().oneOf(
              [true],
              "Необходимо согласие для оформления заказа."
            ), // Валидация согласия
          })}
          onSubmit={handleSubmitOrder}
        >
          {({ handleSubmit, setFieldValue, values }) => (
            <form onSubmit={handleSubmit}>
              <div className={classes.formOrders}>
                <div className={classes.titleFormOrders}>
                  <h1>Оформление заказа</h1>
                </div>
                <div className="PromoFormsOrders">
                  <Field name="promoCode">
                    {({ field }) => (
                      <Input
                        type="text"
                        placeholder="Введите промокод"
                        className={classes.inputPromocode}
                        {...field}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="promoCode"
                    component="div"
                    className={classes.error}
                  />
                  {promoError && (
                    <div className={classes.error}>{promoError}</div>
                  )}
                  <div className={classes.helpPromo}>
                    <Link>Где взять промокод ?</Link>
                  </div>
                  <Button
                    type="button"
                    className={classes.ApplyPromocodeBtn}
                    onClick={async () => {
                      const { discount } = await validatePromoCode(
                        values.promoCode,
                        originalPrice
                      );
                      if (discount > 0) {
                        notification.success({
                          message: "Промокод применен!",
                          description: `Скидка: ${discount}%`,
                        });
                        const newFinalPrice =
                          originalPrice * (1 - discount / 100);
                        setFinalPrice(newFinalPrice);
                      } else {
                        notification.error({
                          message: "Ошибка",
                          description: promoError || "Промокод недействителен.",
                        });
                        setFinalPrice(originalPrice); // Сбрасываем итоговую цену
                      }
                    }}
                  >
                    Применить промокод
                  </Button>
                </div>

                {/* Добавляем галочку для согласия */}
                <div className={classes.agreement}>
                  <div className={classes.blockCheck}>
                    <Field type="checkbox" name="agreement">
                      {({ field }) => (
                        <Checkbox
                          type="checkbox"
                          {...field}
                          id="agreement"
                          className={classes.checkbox}
                        />
                      )}
                    </Field>
                    <label className={classes.ApplyPolicy} htmlFor="agreement">
                      Я согласен(на) с{" "}
                      <Link>условиями обработки персональных данных</Link> и{" "}
                      <Link>политикой конфиденциальности</Link>.
                    </label>
                  </div>
                  <ErrorMessage
                    name="agreement"
                    component="div"
                    className={classes.error}
                  />
                </div>
                <h3>Итого: {finalPrice.toLocaleString()} ₸</h3>
                <div className={classes.AddOrders}>
                  <button type="submit">Оформить заказ</button>
                </div>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Order;
