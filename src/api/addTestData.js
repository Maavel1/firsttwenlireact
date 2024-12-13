import express from "express";
import mongoose from "mongoose";
import User from "./userModel.js"; // Импорт модели пользователя

const app = express();
const PORT = 5000;

// Middleware для парсинга JSON
app.use(express.json());

// Подключение к MongoDB
mongoose
  .connect(
    "mongodb+srv://githubmaavel:mWtaRUWXTiaYB56F@cluster0.no35j.mongodb.net/FirsTwenli?retryWrites=true&w=majority"
  )
  .then(() => console.log("Успешно подключились к MongoDB"))
  .catch((err) => console.error("Ошибка при подключении к MongoDB:", err));

// Тестовый маршрут для добавления пользователя
app.post("/add-test-user", async (req, res) => {
  try {
    const testUser = new User({
      uid: "testUser123", // уникальный идентификатор
      savedPosts: [], // список сохранённых постов, можно оставить пустым
    });

    // Сохранение пользователя в базе
    await testUser.save();

    // Ответ от сервера
    res.status(201).json({ message: "Тестовый пользователь добавлен успешно" });
  } catch (error) {
    console.error("Ошибка при добавлении тестового пользователя:", error);
    res
      .status(500)
      .json({ message: "Ошибка сервера при добавлении пользователя" });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
