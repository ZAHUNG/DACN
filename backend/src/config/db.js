const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const user = encodeURIComponent(process.env.MONGO_USER);
    const pass = encodeURIComponent(process.env.MONGO_PASS);
    const dbName = process.env.MONGO_DBNAME || "test";

    const uri = `mongodb+srv://${user}:${pass}@cluster0.lf2nfzb.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

    // Kết nối MongoDB
    await mongoose.connect(uri);

    const connection = mongoose.connection;
    console.log(`✅ MongoDB connected: ${connection.host}/${connection.name}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
