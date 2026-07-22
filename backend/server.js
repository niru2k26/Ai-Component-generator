import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import historyRoutes from "./routes/history.js"; // ✅ ADD THIS

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes); // ✅ ADD THIS

// ✅ DB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("DB Connected"))
.catch(err => console.log(err));

// ✅ Server
app.listen(5000, () => console.log("Server running on port 5000"));