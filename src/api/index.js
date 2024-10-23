import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors"; // Импортируем cors
import multer from "multer"; // Импортируем multer
import path from "path"; // Импортируем path для работы с путями

const app = express();
const port = 5000;

// Строка подключения к вашей базе данных
const uri =
  "mongodb+srv://githubmaavel:mWtaRUWXTiaYB56F@cluster0.no35j.mongodb.net/FirsTwenli?retryWrites=true&w=majority";

const client = new MongoClient(uri);

// Включаем CORS
app.use(cors()); // Это позволит всем доменам обращаться к вашему API
app.use(express.json()); // Это позволит вашему серверу обрабатывать JSON

// Настройка multer для сохранения загруженных файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Папка, куда будут сохраняться файлы
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Сохраняем файл с уникальным именем
  },
});

const upload = multer({ storage });

// Подключаемся к базе данных при запуске сервера
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Успешно подключились к MongoDB.");
  } catch (error) {
    console.error("Ошибка при подключении к MongoDB:", error);
    process.exit(1); // Завершить процесс, если не удалось подключиться
  }
}

// Базовый маршрут для корня
app.get("/", (req, res) => {
  res.send(
    "Сервер работает! Используйте /services для получения данных об услугах."
  );
});

// Маршрут для получения данных об услугах
app.get("/services", async (req, res) => {
  try {
    const database = client.db("FirstTwenli");
    const collection = database.collection("Service");

    // Запрос на получение первых 20 услуг из коллекции
    const services = await collection.find({}).limit(20).toArray();
    console.log(`Найдено услуг: ${services.length}`);

    if (services.length === 0) {
      return res.status(404).json({ message: "Услуг нет в данный момент." });
    }

    // Возвращение услуг с успешным статусом
    res.status(200).json(services);
  } catch (error) {
    console.error("Ошибка при получении услуг:", error);
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
});

// Маршрут для добавления новой услуги
app.post("/services", upload.single("image"), async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const imageUrl = req.file ? req.file.path : null; // Получаем путь к загруженному файлу

    if (!title || !description || !imageUrl || !price) {
      return res.status(400).json({ message: "Все поля обязательны." });
    }

    const database = client.db("FirstTwenli");
    const collection = database.collection("Service");

    // Создаем новый объект услуги
    const newService = {
      title,
      description,
      imageUrl, // Сохраняем путь к изображению
      price,
    };

    // Вставляем новый объект в коллекцию
    const result = await collection.insertOne(newService);

    // Возвращаем созданный объект с успешным статусом
    res
      .status(201)
      .json({ message: "Услуга добавлена", service: result.ops[0] });
  } catch (error) {
    console.error("Ошибка при добавлении услуги:", error);
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
});

// Закрытие подключения при завершении работы сервера
process.on("SIGINT", async () => {
  await client.close();
  console.log("Подключение к MongoDB закрыто.");
  process.exit(0);
});

// Запускаем сервер и подключаемся к базе данных
app.listen(port, async () => {
  await connectToDatabase();
  console.log(`Сервер запущен на http://localhost:${port}`);
});
