// Esto es para ¿Qué endpoint corresponde a qué acción?
import { Router } from "express";

import {
  getAllContent,
  getContentBySlug,
} from "../controllers/content.controller.js";

const router = Router();

router.get("/", getAllContent);

router.get("/:slug", getContentBySlug);

export default router;