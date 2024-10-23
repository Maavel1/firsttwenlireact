import axios from "axios";
import { useState, useEffect } from "react";

const Service = () => {
  const [services, setServices] = useState([]); // Измените "movies" на "services"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Убедитесь, что вы используете правильный путь к API
    axios
      .get("http://localhost:5000/services") // Измените путь к вашему API на "/services"
      .then((response) => {
        console.log("Response data:", response.data); // Логирование полученных данных
        if (Array.isArray(response.data)) {
          setServices(response.data); // Измените "setMovies" на "setServices"
        } else {
          setError("Ошибка: данные не в формате массива");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке данных:", error); // Логирование ошибки
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
          <p>Услуг нет в данный момент</p> // Сообщение о пустой базе данных
        ) : (
          services.map((service) => (
            <div key={service._id}>
              <img src={service.imageUrl} alt={service.title} />{" "}
              {/* Измените "poster" на "imageUrl" */}
              <h2>{service.title}</h2>
              <p>{service.description}</p>{" "}
              {/* Измените "fullplot" на "description" */}
              <p>Цена: {service.price}</p> {/* Измените "rated" на "price" */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Service;
