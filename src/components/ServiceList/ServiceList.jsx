import React, { useState, useEffect } from "react";
import { db } from "../../base/base";
import { collection, getDocs } from "firebase/firestore";
import { Select } from "antd";
import { motion, AnimatePresence } from "framer-motion"; // Импортируем Framer Motion
import clasess from "./serviceList.module.scss";
import Loader from "../../UI/Loader/loader";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "service"));
        const fetchedServices = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setServices(fetchedServices);

        const uniqueCategories = [
          ...new Set(
            fetchedServices
              .map((service) => service.category)
              .filter((category) => category && category.trim())
          ),
        ];
        setCategories(
          uniqueCategories.map((category) => ({
            value: category,
            label: category,
          }))
        );
      } catch (error) {
        console.error("Ошибка при получении данных услуг:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleChange = (value) => {
    setSelectedCategories(value);
  };

  // Фильтрация услуг на основе выбранных категорий
  const filteredServices = selectedCategories.length
    ? services.filter((service) =>
        selectedCategories.includes(service.category)
      )
    : services;

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
    <div>
      <div className={clasess.serviceList}>
        <div className={clasess.filter}>
          <Select
            mode="multiple"
            size="large"
            placeholder="Выберите категории"
            onChange={handleChange}
            style={{
              width: "100%",
            }}
            options={categories}
            value={selectedCategories}
            className={clasess.selectService}
          />
        </div>
        <div className={clasess.cardsRows}>
          <AnimatePresence>
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <motion.div
                  key={service.id}
                  className={clasess.card}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={clasess.imgCardService}>
                    <img src={service.imageUrl} alt={service.name} />
                  </div>
                  <h3 className={clasess.NameCardService}>
                    {service.name || "Название не указано"}
                  </h3>
                  <p className={clasess.DecrCardSerivec}>
                    {service.description
                      ? `${service.description.slice(0, 100)}${
                          service.description.length > 100 ? "..." : ""
                        }`
                      : "Описание отсутствует"}
                  </p>
                  <p className={clasess.priceService}>
                    {service.price ? `${service.price} ₸` : "Не указана"}
                    {service.rating ? (
                      renderRating(service.rating)
                    ) : (
                      <p style={{ color: "rgb(181 181 181)" }}>★★★★★</p>
                    )}
                  </p>
                  <div className={clasess.BtnCardService}>
                    <button>Подробнее</button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p>Нет услуг в выбранных категориях.</p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ServiceList;
