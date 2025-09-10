// index.js
const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");  
const routes = require("./routes");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const apiPrefix = "/api";

// Security & common middlewares
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : true,
  credentials: true,
}));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "1mb" }));

// (Nếu chạy sau reverse proxy)
if (process.env.TRUST_PROXY) app.set("trust proxy", process.env.TRUST_PROXY);

// Routes
app.use(apiPrefix, routes); // mọi route bắt đầu với /api

// 404
app.use((req, res) => res.status(404).json({ message: "Not found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Server error" });
});

// Bootstrap: connect DB rồi mới lắng nghe
(async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}${apiPrefix}`);
    });
  } catch (e) {
    console.error("❌ DB connect failed:", e);
    process.exit(1);
  }
})();

// (Optional) safety nets
process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});
