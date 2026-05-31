import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import studyRoutes from "./routes/studyRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/study", studyRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB bağlandı");
  })
  .catch((err) => {
    console.log("MongoDB hata:", err.message);
  });

app.get("/", (req, res) => {
  res.send("Server çalışıyor");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});