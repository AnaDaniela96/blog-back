import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";
import contentRoutes from "./routes/content.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/content", async (req, res) => {
  try {
    const { type } = req.query;

    const content = await findAllPublished(type);

    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "error obteniendo contenido",
    });
  }
});

app.use("/api/content", contentRoutes);

app.listen(3001, () => {
  console.log("Servidor corriendo en http://localhost:3001");
});