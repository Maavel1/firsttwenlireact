import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton"; // Импортируем скелетоны
import { db } from "../../base/base";
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import clasess from "./service.module.scss";
import ByuButton from "../../UI/BuyButton/ByuButton";
import NextArrow from "../../UI/ArrowSlide/ArrowSlide";
import AddInfoBtn from "../../UI/AddInfoBtn/AddInfoBtn";
import ServiceList from "../../components/ServiceList/ServiceList";
import { motion, AnimatePresence } from "framer-motion";
import { message } from "antd"; // Добавлено для использования message

const ImageSlider = ({ items, isAuthorized }) => {
  const promoItems = items.filter((item) => item.promo);
  const isSingleSlide = promoItems.length === 1; // Проверка на один слайд
  const settings = {
    dots: true,
    infinite: !isSingleSlide, // Отключаем бесконечный цикл для одного слайда
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: !isSingleSlide, // Отключаем автопроигрывание для одного слайда
    autoplaySpeed: 3000,
    nextArrow: isSingleSlide ? null : <NextArrow />,
  };

  const renderRating = (rating) => {
    if (rating === undefined) {
      return "Не установлен";
    }

    const stars = Array(5)
      .fill(0)
      .map((_, index) => (
        <span
          key={index}
          className={index < rating ? "filled-star" : "empty-star"}
        >
          ★
        </span>
      ));

    return <div>{stars}</div>;
  };

  return (
    <div className={clasess.serviceContainer}>
      {promoItems.length > 0 ? (
        <Slider className={clasess.slider} {...settings}>
          {promoItems.map((item) => (
            <motion.div
              className={clasess.sliderFireAct}
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }} // Начальное состояние
              animate={{ opacity: 1, scale: 1 }} // Конечное состояние
              exit={{ opacity: 0, scale: 0.95 }} // Состояние при выходе
              transition={{ duration: 0.3 }} // Длительность анимации
            >
              <div className={clasess.rowsSlide}>
                <div className={clasess.infoProductSlide}>
                  <h2 className={clasess.nameSlideProduct}>
                    {item.name
                      ? `${item.name.slice(0, 25)}${
                          item.name.length > 25 ? "..." : ""
                        }`
                      : "Название не указано"}
                  </h2>
                  <h3>
                    {item.description
                      ? `${item.description.slice(0, 117)}${
                          item.description.length > 117 ? "..." : ""
                        }`
                      : "Описание отсутствует"}
                  </h3>
                  <div className={clasess.categuryAndRating}>
                    <p>
                      Рейтинг{" "}
                      <span className={clasess.rating}>
                        {item.rating
                          ? renderRating(item.rating)
                          : "Оценок пока нет"}
                      </span>
                    </p>
                    <p>
                      Категория{" "}
                      <span>
                        {item.category
                          ? `${item.category.slice(0, 25)}${
                              item.category.length > 25 ? "..." : ""
                            }`
                          : "Категория не указана"}
                      </span>
                    </p>
                  </div>
                  <div className={clasess.priceAndBtn}>
                    <div className={clasess.btnSlide}>
                      <ByuButton
                        isAuthorized={isAuthorized}
                        item={item} // Передаем item в компонент
                      />
                      <AddInfoBtn />
                    </div>
                    <h3>
                      {item.price ? (
                        `${item.price.toLocaleString()} ₸`
                      ) : (
                        <p style={{ fontSize: 20 }}>Цена не указана</p>
                      )}
                    </h3>
                  </div>
                </div>
                <div className={clasess.imgSlide}>
                  <motion.img
                    src={item.imageUrl || "/images/placeholder.png"}
                    alt={item.name || "error"}
                    style={{ width: "100%" }}
                    initial={{ opacity: 0 }} // Начальное состояние
                    animate={{ opacity: 1 }} // Конечное состояние
                    transition={{ duration: 0.3 }} // Длительность анимации
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </Slider>
      ) : (
        <></>
      )}
    </div>
  );
};

const Service = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "service"));
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(items);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const promoItems = data.filter((item) => item.promo);

  return (
    <div>
      <AnimatePresence>
        <motion.div
          key={loading ? "loading" : "loaded"}
          className={clasess.serviceContainer}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {loading ? (
            <div className={clasess.skeletonContainer}>
              <Skeleton height={300} style={{ marginBottom: "20px" }} />
              <Skeleton height={300} style={{ marginBottom: "20px" }} />
            </div>
          ) : (
            <ImageSlider items={promoItems} isAuthorized={!!user} />
          )}
        </motion.div>
      </AnimatePresence>
      <ServiceList />
    </div>
  );
};

export default Service;
