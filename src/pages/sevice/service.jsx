import axios from "axios";
import { useState, useEffect } from "react";

const Service = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/services") // Убедитесь, что вызываете правильный путь
      .then((response) => {
        console.log("Response data:", response.data); // Лог для проверки
        if (Array.isArray(response.data)) {
          setServices(response.data);
        } else {
          setError("Ошибка: данные не в формате массива");
          console.error("Received data is not an array:", response.data); // Лог для отладки
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Ошибка при загрузке данных");
        console.error("Error fetching services:", error); // Лог для отладки
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Наши Услуги</h1>
      <div>
        {services.length > 0 ? (
          services.map((service) => (
            <div key={service._id}>
              <img src={service.imageUrl} alt={service.title} />
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              <p>Цена: {service.price} руб.</p>
            </div>
          ))
        ) : (
          <p>Услуг нет в данный момент.</p>
        )}
      </div>
    </div>
  );
};

export default Service;
