import mongoose from "mongoose";

const connectionString =
  "mongodb+srv://githubmaavel:FirstTwenli3225@cluster0.no35j.mongodb.net/service.servicePage?retryWrites=true&w=majority&appName=Cluster0"; // Укажите имя вашей базы данных

const serviceSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
});

const Service =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);

async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

export default async (req, res) => {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      const services = await Service.find({});
      res.status(200).json(services);
    } catch (error) {
      console.error("Ошибка при получении услуг:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
