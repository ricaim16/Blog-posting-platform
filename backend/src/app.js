import express from "express";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json()); // needed for req.body

app.use("/api/auth", authRoutes); // exactly the path you want

export default app;
