const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
  const PASSWORD = process.env.PASSWORD;
  const DATABASE_NAME = process.env.DATABASE_NAME;

  const conn = await mongoose.connect(
    `mongodb+srv://anas:${PASSWORD}@cluster0.uc4tq.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  );
  console.log(`mongo connected: ${conn.connection.host}`);
};

module.exports = connectDB;
