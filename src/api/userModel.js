import mongoose from "mongoose";

// Строка подключения
const uri =
  "mongodb+srv://githubmaavel:mWtaRUWXTiaYB56F@cluster0.no35j.mongodb.net/FirsTwenli?retryWrites=true&w=majority";

// Подключаемся к базе данных MongoDB
mongoose
  .connect(uri)
  .then(() => {
    console.log("Успешно подключились к MongoDB.");
  })
  .catch((err) => {
    console.error("Ошибка при подключении к MongoDB:", err);
  });

// Схема для пользователя
const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

// Модель пользователя
const User = mongoose.model("User", userSchema);

export default User;
