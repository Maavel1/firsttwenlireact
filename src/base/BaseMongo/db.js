import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("your_connection_string_here", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
