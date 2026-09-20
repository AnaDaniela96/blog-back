// Qué llegó en la petición y qué respuesta HTTP envío?
import {
  findAllPublished,
  findPublishedBySlug,
} from "../repositories/content.repository.js";

export const getAllContent = async (req, res) => {
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
};

export const getContentBySlug = async (req, res) => {
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
};