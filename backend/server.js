const express = require("express");
const colors = require("colors");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API routes
app.use("/api/v1/test", require("./routes/testRoutes"));
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/restaurant", require("./routes/restaurantRoutes"));
app.use("/api/v1/category", require("./routes/categoryRoutes"));
app.use("/api/v1/food", require("./routes/foodRoutes"));
app.use("/api/v1/order", require("./routes/orderRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));

app.get("/", (req, res) => {
  res.status(200).send("<h1>Welcome to food server</h1>");
});

// Connect database
let dbConnection;

app.use(async (req, res, next) => {
  try {
    if (!dbConnection) {
      dbConnection = connectDB();
    }

    await dbConnection;
    next();
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// Vercel serverless export
module.exports = app;

// Local development
if (require.main === module) {
  const PORT = process.env.PORT || 3000;

  connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`.green.bold);
  });
}
