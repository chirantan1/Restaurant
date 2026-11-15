const express = require("express");
const colors = require("colors");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

let dbConnection;

const ensureDB = async () => {
  if (!dbConnection) {
    dbConnection = connectDB().catch((error) => {
      dbConnection = null;
      throw error;
    });
  }

  await dbConnection;
};

app.get("/", (req, res) => {
  res.status(200).send("<h1>Welcome to food server</h1>");
});

app.use(async (req, res, next) => {
  try {
    await ensureDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

app.use("/api/v1/test", require("./routes/testRoutes"));
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/restaurant", require("./routes/restaurantRoutes"));
app.use("/api/v1/category", require("./routes/categoryRoutes"));
app.use("/api/v1/food", require("./routes/foodRoutes"));
app.use("/api/v1/order", require("./routes/orderRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;

  ensureDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`.green.bold);
      });
    })
    .catch((error) => {
      console.error("Server startup failed:", error.message);
      process.exit(1);
    });
}
