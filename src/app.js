import express from "express";
import { connectDB } from "./config/db.js";
import articleRoutes from "./routes/routes.js";

const app = express();

app.use(express.json());
connectDB();

app.use("/api/articles", articleRoutes);

export default app;
