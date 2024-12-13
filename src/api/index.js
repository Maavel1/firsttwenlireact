import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors"; // Импортируем cors
import multer from "multer"; // Импортируем multer
import path from "path"; // Импортируем path для работы с путями
import mongoose from "mongoose"; // Импорт mongoose для подключения
import User from "./userModel.js"; // Если файл в той же папке

const app = express();
const port = 5000;


const uri =
  "mongodb+srv://githubmaavel:mWtaRUWXTiaYB56F@cluster0.no35j.mongodb.net/FirsTwenli?retryWrites=true&w=majority";


const client = new MongoClient(uri);


const corsOptions = {
  origin: "http://localhost:5173", // Разрешить доступ только с этого домена (например, фронтенд на другом порту)
  methods: ["GET", "POST", "PUT", "DELETE"], // Разрешить методы
  allowedHeaders: ["Content-Type"], // Разрешить определенные заголовки
};

// Включаем CORS
app.use(cors(corsOptions)); // Эта строка ставится первой

app.use(express.json()); // Для обработки JSON-запросов
app.use(multer({ dest: "uploads/" }).single("image")); // Для обработки файлов

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
async function connectToDatabase() {
  try {
    await mongoose.connect(uri);
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

// Маршрут регистрации пользователя с Firebase
app.post("/register", async (req, res) => {
  const { email, password, uid } = req.body; // Получаем данные от клиента

  try {
    // Проверка, существует ли уже пользователь с таким UID
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Пользователь с таким UID уже существует." });
    }

    // Создаем нового пользователя в MongoDB
    const newUser = new User({
      email, // добавляем email в MongoDB
      password, // добавляем пароль в MongoDB, если нужно
      uid,
      savedPosts: [], // Изначально пустой список сохраненных постов
    });

    // Сохраняем пользователя в базе данных
    await newUser.save();
    res
      .status(201)
      .json({ message: "Пользователь зарегистрирован успешно", user: newUser });
  } catch (error) {
    console.error("Ошибка при регистрации пользователя:", error);
    res.status(500).json({ message: "Ошибка сервера" });
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

// Маршруты для работы с новостями
app.get("/news", async (req, res) => {
  try {
    const database = client.db("FirstTwenli");
    const collection = database.collection("News");

    // Получение уникальных категорий
    const categories = await collection.distinct("category");

    // Получение популярных постов (сортировка по просмотрам и лайкам)
    const popularPosts = await collection
      .find({})
      .sort({ views: -1, likes: -1 })
      .toArray();

    // Возвращаем категории и популярные посты в одном объекте
    res.json({ categories, popularPosts });
  } catch (error) {
    console.error("Ошибка при получении данных для страницы /news:", error);
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
});

app.get("/news/:id", async (req, res) => {
  try {
    const postId = req.params.id;

    // Проверка, является ли id валидным ObjectId
    if (!ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Неверный формат ID" });
    }

    const database = client.db("FirstTwenli");
    const collection = database.collection("News");

    // Создаем ObjectId и выполняем поиск
    const post = await collection.findOne({ _id: new ObjectId(postId) });

    if (!post) {
      return res.status(404).json({ message: "Пост не найден." });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Ошибка при получении поста:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.get("/news/popular", async (req, res) => {
  try {
    const database = client.db("FirstTwenli");
    const collection = database.collection("News");

    // Запрос популярных постов, сортировка по лайкам
    const popularPosts = await collection
      .find()
      .sort({ likes: -1 }) // Сортировка по лайкам
      .limit(5) // Ограничиваем количество популярных постов
      .toArray();

    if (popularPosts.length === 0) {
      return res.status(404).json({ message: "Популярные посты не найдены." });
    }

    res.status(200).json(popularPosts);
  } catch (error) {
    console.error("Ошибка при получении популярных постов:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Добавляем маршрут для сохранения поста пользователем
app.post("/savePost", async (req, res) => {
  const { userUid, postId } = req.body;
  try {
    const user = await User.findOne({ uid: userUid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.savedPosts.includes(postId)) {
      user.savedPosts.push(postId);
      await user.save();
    }
    res.status(200).json(user.savedPosts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Добавляем маршрут для сохранения UID пользователя
app.post("/saveUserUid", async (req, res) => {
  const { uid } = req.body; // Получаем UID из тела запроса
  try {
    console.log("Получен UID:", uid); // Логируем UID для отладки

    // Проверка, существует ли пользователь с таким UID
    let user = await User.findOne({ uid });
    if (!user) {
      // Если пользователь не найден, создаем нового
      user = new User({ uid, savedPosts: [] });
      await user.save();
    }

    res.status(200).json({ message: "User UID saved", user });
  } catch (error) {
    console.error("Ошибка при сохранении UID пользователя:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Получаем список пользователей
app.get("/users", async (req, res) => {
  try {
    const database = client.db("FirstTwenli"); // Подключаемся к базе данных FirstTwenli
    const collection = database.collection("users"); // Подключаемся к коллекции users

    const users = await collection.find().toArray(); // Извлекаем всех пользователей из коллекции
    res.status(200).json(users); // Отправляем список пользователей в ответ
  } catch (error) {
    console.error("Ошибка при получении пользователей:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
