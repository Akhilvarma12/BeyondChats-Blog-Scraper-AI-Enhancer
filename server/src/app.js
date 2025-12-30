import express from "express";
import { connectDB } from "./config/db.js";
import articleRoutes from "./routes/routes.js";
import cors from "cors";


const app = express();

app.use(cors());

app.use(express.json());
connectDB();

app.use("/api/articles", articleRoutes);

export default app;
