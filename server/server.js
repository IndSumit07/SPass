import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./configs/mongodb.config.js";
import authRouter from "./routes/auth.routes.js";
import eventRouter from "./routes/event.routes.js";
import passRouter from "./routes/pass.routes.js";

const app = express();

connectDB();

const allowedOrigins = [
  "https://spass-three.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options(/.*/, cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running...");
});
app.use("/api/auth", authRouter);
app.use("/api/events", eventRouter);
app.use("/api/passes", passRouter);

app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on http://localhost:${process.env.PORT}`);
});
