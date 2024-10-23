import React, { useState } from "react";
import axios from "axios";

export default function CreateService() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null); // Изменено: хранить файл изображения
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Создаем объект FormData для отправки данных
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image); // Используем имя "image"
    formData.append("price", price);

    try {
      const response = await axios.post(
        "http://localhost:5000/services",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Указываем тип контента
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Название"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required // Сделать поле обязательным
      />
      <textarea
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required // Сделать поле обязательным
      />
      <input
        type="file" // Поле для загрузки файла
        accept="image/*" // Ограничить типы файлов
        onChange={(e) => setImage(e.target.files[0])} // Получаем файл из события
        required // Сделать поле обязательным
      />
      <input
        type="number"
        placeholder="Цена"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required // Сделать поле обязательным
      />
      <button type="submit">Добавить услугу</button>
    </form>
  );
}
