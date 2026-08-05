import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes";
import profileRoutes from "./modules/profile/profile.routes";
import jobRoutes from "./modules/job/job.routes";



const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (_, res) => {
  res.send("TalentSync Backend Running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});