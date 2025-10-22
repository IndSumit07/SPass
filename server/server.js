import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./configs/mongodb.config.js";
import authRouter from "./routes/auth.routes.js";

const app = express();
const PORT = process.env.PORT || 4000;
connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running...");
});
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
