// seed.js
import mongoose from "mongoose";

const connectionString =
  "mongodb+srv://githubmaavel:Maks20051313@@@cluster0.no35j.mongodb.net/mydatabase";

const serviceSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
});

const Service =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);

async function seedDatabase() {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const services = [
      {
        title: "Услуга 1",
        description: "Описание услуги 1",
        price: 100,
        imageUrl: "https://example.com/image1.jpg",
      },
      {
        title: "Услуга 2",
        description: "Описание услуги 2",
        price: 200,
        imageUrl: "https://example.com/image2.jpg",
      },
      {
        title: "Услуга 3",
        description: "Описание услуги 3",
        price: 300,
        imageUrl: "https://example.com/image3.jpg",
      },
    ];

    await Service.insertMany(services);
    console.log("Данные успешно добавлены!");
  } catch (error) {
    console.error("Ошибка при добавлении данных:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
