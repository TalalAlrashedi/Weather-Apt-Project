import express from "express";
import mongoose from "mongoose";
import authRouter from "./routes/auth.route";
import weatherRouter from "./routes/weather.route";
import historyRouter from "./routes/history.route";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());

app.use("/history", historyRouter);
app.use("/auth", authRouter);
app.use("/weather", weatherRouter);
app.get("/", (_, res) => {
  res.send("WeatherHub API is running");
});

mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.2qxayvt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(3002, () => {
      console.log("🚀 Server running on port 3000");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
