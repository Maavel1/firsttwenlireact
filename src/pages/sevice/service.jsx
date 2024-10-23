import axios from "axios";
import { useState, useEffect } from "react";

const Service = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/services") // Этот путь должен быть к вашему API
      .then((response) => {
        console.log("Response data:", response.data);
        if (Array.isArray(response.data)) {
          setServices(response.data);
        } else {
          setError("Ошибка: данные не в формате массива");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Ошибка при загрузке данных");
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
        {services.length === 0 ? (
          <p>Услуг нет в данный момент.</p>
        ) : (
          services.map((service) => (
            <div key={service._id}>
              <img src={service.imageUrl} alt={service.title} />
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              <p>Цена: {service.price} руб.</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Service;
