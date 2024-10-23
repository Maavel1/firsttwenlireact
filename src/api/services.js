import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://githubmaavel:FirstTwenli3225@cluster0.no35j.mongodb.net/service.servicePage?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Подключение к базе данных установлено.");
  } catch (error) {
    console.error("Ошибка подключения:", error);
    throw error;
  }
}

export default async (req, res) => {
  await connectToDatabase();

  console.log("Received request:", req.method);

  if (req.method === "GET") {
    try {
      const database = client.db("service.servicePage");
      const collection = database.collection("services");

      const services = await collection.find({}).toArray();
      console.log("Услуги:", services);

      if (services.length === 0) {
        return res.status(404).json({ message: "Услуг нет в данный момент." });
      }

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
