import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./modules/auth/auth.routes";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (_, res) => {
  res.send("TalentSync Backend Running 🚀");
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});