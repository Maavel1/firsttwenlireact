import React, { useEffect, useState } from "react";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  getRedirectResult,
} from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../base/base"; // Подключение к Firestore из вашего файла base.js
import DefaultAvatar from "../../assets/defualt-avatar.png";
import Loader from "../../UI/Loader/loader";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]); // Новый стейт для хранения заказов

  useEffect(() => {
    const auth = getAuth();

    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          setUser({
            uid: result.user.uid,
            name: result.user.displayName || "User",
            email: result.user.email,
            picture: result.user.photoURL,
          });
        }
      } catch (error) {
        console.error("Error getting redirect result:", error);
      }
    };

    handleRedirectResult();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          name: currentUser.displayName || "User",
          email: currentUser.email,
          picture: currentUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const ordersCollection = collection(
            db,
            "ListOrders",
            user.uid,
            "orders"
          );
          const ordersSnapshot = await getDocs(ordersCollection);
          const userOrders = ordersSnapshot.docs.map((doc) => doc.data());

          // Сортировка заказов по дате (последние заказы первыми)
          userOrders.sort(
            (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
          );

          setOrders(userOrders);
        } catch (error) {
          console.error("Error fetching user orders:", error);
        }
      }
    };

    fetchOrders();
  }, [user]);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {user ? (
        <>
          <h2>Welcome, {user.name}</h2>
          <img
            src={user.picture ? user.picture : DefaultAvatar}
            alt={user.name}
          />
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>

          <h3>Ваши заказы</h3>
          {orders.length > 0 ? (
            <ul>
              {orders.map((order, index) => (
                <li key={index}>
                  <p>Номер заказа: {order.orderNumber}</p>
                  <p>
                    Дата заказа:{" "}
                    {new Date(order.orderDate).toLocaleDateString("ru-RU", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </p>
                  <p>Сумма заказа: {order.totalPrice} ₸</p>
                  {order.promoCode ? <p>Промокод: {order.promoCode}</p> : null}
                  <ul>
                    {order.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        {item.name} - {item.quantity} шт.
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p>У вас пока нет заказов.</p>
          )}
        </>
      ) : (
        <p>Please log in to see your profile.</p>
      )}
    </div>
  );
};

export default Profile;
