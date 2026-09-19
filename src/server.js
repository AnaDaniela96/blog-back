import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";
import { findAllPublished } from "./repositories/content.repository.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API funcionando" });
});

app.get("/api/content", async (req, res) => {
  try {
    const content = await findAllPublished();

    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "error obteniendo posts",
    });
  }
});

// 👇 NUEVA RUTA PARA TRAER UN POST POR SLUG
app.get("/api/content/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      `
      SELECT
        c.id,
        c.slug,
        c.title,
        c.type,
        c.excerpt,
        c.body_markdown,
        c.cover_url,
        c.seo_description,
        c.og_image_url,
        c.published,
        c.published_at,
        c.created_at,
        COALESCE(
          array_agg(t.name) FILTER (WHERE t.name IS NOT NULL),
          '{}'
        ) AS tags
      FROM content c
      LEFT JOIN content_tags ct ON ct.content_id = c.id
      LEFT JOIN tags t ON t.id = ct.tag_id
      WHERE c.slug = $1 AND c.published = true
      GROUP BY c.id
      LIMIT 1
      `,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "error obteniendo post" });
  }
});

app.listen(3001, () => {
  console.log("Servidor corriendo en http://localhost:3001");
});

app.get("/", (req, res) => {
  res.json({ message: "API funcionando" });
});

app.get("/api/content", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.id,
        c.slug,
        c.title,
        c.excerpt,
        c.body_markdown,
        c.seo_description,
        c.published_at,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', t.id,
              'name', t.name,
              'slug', t.slug
            )
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) AS tags
      FROM content c
      LEFT JOIN content_tags ct ON ct.content_id = c.id
      LEFT JOIN tags t ON t.id = ct.tag_id
      WHERE c.published = true
      GROUP BY c.id
      ORDER BY c.published_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "error obteniendo posts" });
  }
});

app.get("/api/music", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.id,
        c.slug,
        c.title,
        c.excerpt,
        c.body_markdown,
        c.cover_url,
        c.published_at,
        c.created_at,

        m.artist_name,
        m.album_title,
        m.release_year,
        m.listen_url,
        m.platform

      FROM content c
      JOIN music m ON m.content_id = c.id

      WHERE c.type = 'music'
      AND c.published = true

      ORDER BY c.published_at DESC NULLS LAST, c.created_at DESC;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Error obteniendo música:", err);
    res.status(500).json({ error: "error obteniendo música" });
  }
});

app.get("/api/music/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      `
      SELECT
        c.id,
        c.slug,
        c.title,
        c.excerpt,
        c.body_markdown,
        c.cover_url,
        c.published_at,
        c.created_at,

        m.artist_name,
        m.album_title,
        m.release_year,
        m.listen_url,
        m.platform

      FROM content c
      JOIN music m ON m.content_id = c.id

      WHERE c.type = 'music'
      AND c.published = true
      AND c.slug = $1

      LIMIT 1;
      `,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "reseña musical no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error obteniendo reseña musical:", err);
    res.status(500).json({ error: "error obteniendo reseña musical" });
  }
});

app.get("/api/books", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.id,
        c.slug,
        c.title,
        c.excerpt,
        c.body_markdown,
        c.cover_url,
        c.published_at,
        c.created_at,

        b.author,
        b.editorial,
        b.country,
        b.language,
        b.publication_date,
        b.pages,
        b.genre,
        b.score,
        b.mood,
        b.favorite_quote

      FROM content c
      JOIN books b ON b.content_id = c.id

      WHERE c.type = 'book'
      AND c.published = true

      ORDER BY c.published_at DESC NULLS LAST, c.created_at DESC;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Error obteniendo libros:", err);
    res.status(500).json({ error: "error obteniendo libros" });
  }
});

app.get("/api/books/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      `
      SELECT
        c.id,
        c.slug,
        c.title,
        c.excerpt,
        c.body_markdown,
        c.cover_url,
        c.published_at,
        c.created_at,

        b.author,
        b.editorial,
        b.country,
        b.language,
        b.publication_date,
        b.pages,
        b.genre,
        b.score,
        b.mood,
        b.favorite_quote

      FROM content c
      JOIN books b ON b.content_id = c.id

      WHERE c.type = 'book'
      AND c.published = true
      AND c.slug = $1

      LIMIT 1;
      `,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "libro no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error obteniendo libro:", err);
    res.status(500).json({ error: "error obteniendo libro" });
  }
});

app.get("/api/series", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.id,
        c.slug,
        c.title,
        c.excerpt,
        c.body_markdown,
        c.cover_url,
        c.published_at,
        c.created_at,

        s.series_title,
        s.creator,
        s.country,
        s.language,
        s.platform,
        s.release_year,
        s.end_year,
        s.seasons,
        s.genre,
        s.score,
        s.mood,
        s.favorite_episode,
        s.watch_url

      FROM content c
      JOIN series s ON s.content_id = c.id

      WHERE c.type = 'series'
      AND c.published = true

      ORDER BY c.published_at DESC NULLS LAST, c.created_at DESC;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Error obteniendo series:", err);
    res.status(500).json({ error: "error obteniendo series" });
  }
});

app.get("/api/series/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      `
      SELECT
        c.id,
        c.slug,
        c.title,
        c.excerpt,
        c.body_markdown,
        c.cover_url,
        c.published_at,
        c.created_at,

        s.series_title,
        s.creator,
        s.country,
        s.language,
        s.platform,
        s.release_year,
        s.end_year,
        s.seasons,
        s.genre,
        s.score,
        s.mood,
        s.favorite_episode,
        s.watch_url

      FROM content c
      JOIN series s ON s.content_id = c.id

      WHERE c.type = 'series'
      AND c.published = true
      AND c.slug = $1

      LIMIT 1;
      `,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "serie no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error obteniendo serie:", err);
    res.status(500).json({ error: "error obteniendo serie" });
  }
});

app.get("/api/content/movies", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.id,
        c.slug,
        c.title,
        c.excerpt,
        c.body_markdown,
        c.cover_url,
        c.published_at,
        c.created_at,

        m.movie_title,
        m.director_name,
        m.director_photo,
        m.release_year,
        m.country,
        m.genre,
        m.imdb_score,
        m.filmaffinity_score,
        m.daniela_score,
        m.review_comment,
        m.trailer_url,
        m.seen_year

      FROM content c
      JOIN movies m ON m.content_id = c.id

      WHERE c.type = 'movie'
      AND c.published = true

      ORDER BY c.published_at DESC NULLS LAST, c.created_at DESC;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Error obteniendo películas:", err);
    res.status(500).json({ error: "error obteniendo películas" });
  }
});

app.get("/api/content/movies/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      `
      SELECT
        c.id,
        c.slug,
        c.title,
        c.excerpt,
        c.body_markdown,
        c.cover_url,
        c.published_at,
        c.created_at,

        m.movie_title,
        m.director_name,
        m.director_photo,
        m.release_year,
        m.country,
        m.genre,
        m.imdb_score,
        m.filmaffinity_score,
        m.daniela_score,
        m.review_comment,
        m.trailer_url,
        m.seen_year

      FROM content c
      JOIN movies m ON m.content_id = c.id

      WHERE c.type = 'movie'
      AND c.published = true
      AND c.slug = $1

      LIMIT 1;
      `,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "película no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error obteniendo película:", err);
    res.status(500).json({ error: "error obteniendo película" });
  }
});



app.listen(3001, () => {
  console.log("Servidor corriendo en http://localhost:3001");
});