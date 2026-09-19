import { Router } from "express";

import {
  findAllPublished,
  findPublishedBySlug,
} from "../repositories/content.repository.js";

const router = Router();

router.get("/", async (req, res) => {
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

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const content = await findPublishedBySlug(slug);

    if (!content) {
      return res.status(404).json({
        error: "Contenido no encontrado",
      });
    }

    res.json(content);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "error obteniendo contenido",
    });
  }
});

export default router;