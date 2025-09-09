const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const routes = require("./routes");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

dotenv.config();
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Kết nối DB
connectDB();

// Routes
app.use("/api", routes); // Mọi route sẽ bắt đầu với /api

// Lắng nghe server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`🚀 Server is running on port: ${port}`);
});
