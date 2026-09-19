import { pool } from "../db.js";

export const findAllPublished = async () => {
  const result = await pool.query(`
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
    WHERE c.published = true
    GROUP BY c.id
    ORDER BY c.published_at DESC NULLS LAST, c.created_at DESC;
  `);

  return result.rows;
};