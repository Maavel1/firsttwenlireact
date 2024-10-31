import React, { useEffect, useState } from "react";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  getRedirectResult,
  updateProfile,
} from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../base/base"; // Подключение к Firestore из вашего файла base.js
import DefaultAvatar from "../../assets/defualt-avatar.png";
import Loader from "../../UI/Loader/loader";
import clasess from "./profile.module.scss";
import { Table, Tabs, Tooltip, Input, Button, message } from "antd";
import {
  FormOutlined,
  SettingOutlined,
  SafetyOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import SecurityTab from "../../components/SecurityTab/SecurityTab";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]); // Новый стейт для хранения заказов
  const [newName, setNewName] = useState(""); // Состояние для нового имени
  const [avatarUrl, setAvatarUrl] = useState(""); // Состояние для URL аватарки

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]; // Получаем первый файл
    if (!file) {
      message.error("Пожалуйста, выберите файл."); // Сообщение, если файл не выбран
      return;
    }

    const storage = getStorage();
    const storageRef = ref(storage, `avatars/${user.uid}/${file.name}`);

    try {
      await uploadBytes(storageRef, file); // Загружаем файл в хранилище
      const url = await getDownloadURL(storageRef); // Получаем URL загруженной аватарки

      // Обновляем профиль пользователя
      await updateProfile(getAuth().currentUser, { photoURL: url });
      setUser((prev) => ({ ...prev, picture: url })); // Обновляем состояние пользователя
      message.success("Аватарка успешно загружена.");
    } catch (error) {
      console.error("Ошибка при загрузке аватарки:", error);
      message.error(
        "Не удалось загрузить аватарку. Проверьте права доступа и попробуйте снова."
      );
    }
  };
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

  const handleNameChange = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    console.log("Текущий пользователь:", currentUser); // Логируем текущего пользователя

    if (!currentUser) {
      message.error("Пользователь не авторизован.");
      return;
    }

    try {
      // Проверяем, можно ли обновить профиль
      if (
        currentUser.providerData.some(
          (provider) => provider.providerId === "password"
        )
      ) {
        // Метод updateProfile доступен для пользователей с providerId 'password'
        await updateProfile(currentUser, {
          displayName: newName || "Имя не задано",
        });
        setUser((prev) => ({ ...prev, name: newName || "Имя не задано" }));
        message.success("Имя успешно изменено.");
        setNewName("");
      } else {
        message.error(
          "Метод обновления профиля не доступен для этого типа аутентификации."
        );
      }
    } catch (error) {
      console.error("Ошибка при смене имени:", error);
      message.error(
        "Не удалось сменить имя. Проверьте данные и попробуйте снова."
      );
    }
  };
  if (loading) {
    return <Loader />;
  }

  const columns = [
    {
      title: (
        <Tooltip title="Нажмите для сортировки по номеру заказа">
          Номер заказа
        </Tooltip>
      ),
      dataIndex: "orderNumber",
      key: "orderNumber",
      sorter: (a, b) => a.orderNumber - b.orderNumber,
      showSorterTooltip: false,
    },
    {
      title: (
        <Tooltip title="Нажмите для сортировки по дате заказа">
          Дата заказа
        </Tooltip>
      ),
      dataIndex: "orderDate",
      key: "orderDate",
      render: (date) =>
        new Date(date).toLocaleDateString("ru-RU", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
      showSorterTooltip: false,
    },
    {
      title: (
        <Tooltip title="Нажмите для сортировки по сумме заказа">
          Сумма заказа
        </Tooltip>
      ),
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `${price} ₸`,
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      showSorterTooltip: false,
    },
    {
      title: (
        <Tooltip title="Нажмите для сортировки по промокоду">Промокод</Tooltip>
      ),
      dataIndex: "promoCode",
      key: "promoCode",
      render: (promoCode) => promoCode || "—",
      sorter: (a, b) => (a.promoCode || "").localeCompare(b.promoCode || ""),
      showSorterTooltip: false,
    },
  ];

  const expandedRowRender = (order) => {
    const itemColumns = [
      {
        title: <Tooltip title="Наименование товара">Наименование</Tooltip>,
        dataIndex: "name",
        key: "name",
      },
      {
        title: (
          <Tooltip title="Количество единиц товара в заказе">
            Количество
          </Tooltip>
        ),
        dataIndex: "quantity",
        key: "quantity",
      },
    ];

    return (
      <Table
        columns={itemColumns}
        dataSource={order.items}
        pagination={false}
        rowKey={(item) => item.name}
        className={clasess.ListOrders}
      />
    );
  };

  const formattedOrders = orders.map((order, index) => ({
    ...order,
    key: index,
  }));

  // Задаем элементы для вкладок
  const tabItems = [
    {
      key: "1",
      label: (
        <span className={clasess.TitleTab}>
          <SettingOutlined />
          Настройки
        </span>
      ),
      children: <p>Содержимое вкладки "Настройки"</p>,
    },
    {
      key: "2",
      label: (
        <span className={clasess.TitleTab}>
          <FormOutlined />
          Личные данные
        </span>
      ),
      children: (
        <>
          <h3>Смена имени</h3>
          <Input
            placeholder="Введите новое имя"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <Button type="primary" onClick={handleNameChange}>
            Сменить имя
          </Button>

          <h3>Загрузка аватарки</h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange} // Привязка к обработчику изменения
            style={{ marginBottom: 10 }}
          />
          <Button type="primary" onClick={handleAvatarChange}>
            Загрузить аватарку
          </Button>
        </>
      ),
    },
    {
      key: "3",
      label: (
        <span className={clasess.TitleTab}>
          <SafetyOutlined />
          Безопасность
        </span>
      ),
      children: <SecurityTab />,
    },
    {
      key: "4",
      label: (
        <span className={clasess.TitleTab}>
          <LogoutOutlined />
          Выход
        </span>
      ),
      children: (
        <>
          <p className={clasess.textTabsSettings}>
            Вы уверены, что хотите выйти?
          </p>
          <button className={clasess.logout} onClick={handleLogout}>
            Выйти из аккаунта
          </button>
        </>
      ),
    },
  ];

  return (
    <div>
      {user ? (
        <>
          <h2>Добро пожаловать, {user.name}</h2>
          <img
            className={clasess.AvatarProfile}
            src={user.picture ? user.picture : DefaultAvatar}
            alt={user.name}
          />
          <p>Email: {user.email}</p>

          <h3 className={clasess.titleProfileOrders}>Ваши заказы</h3>
          {orders.length > 0 ? (
            <div className={clasess.rowsOrders}>
              <div className={clasess.ListOrders}>
                <Table
                  columns={columns}
                  expandable={{ expandedRowRender }}
                  dataSource={formattedOrders}
                  pagination={{ pageSize: 6 }}
                  rowKey="orderNumber"
                  className={clasess.ListTable}
                />
              </div>

              <div className={clasess.FormSettingProfile}>
                <Tabs defaultActiveKey="1" items={tabItems} />
              </div>
            </div>
          ) : (
            <p>У вас пока нет заказов.</p>
          )}
        </>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default Profile;
