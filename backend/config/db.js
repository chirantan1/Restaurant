const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log(
      `Connected to database: ${mongoose.connection.host}`.green.bold,
    );

    return mongoose.connection;
  } catch (error) {
    console.error("Database connection failed:".red.bold, error.message);
    throw error;
  }
};

module.exports = connectDB;
