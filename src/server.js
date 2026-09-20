// Esto responde a ¿Cómo configuro y arranco mi aplicación?
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import contentRoutes from "./routes/content.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API funcionando" });
});

app.use("/api/content", contentRoutes);

// Aquí pueden seguir temporalmente tus rutas antiguas
// de music, books, series, movies.

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});