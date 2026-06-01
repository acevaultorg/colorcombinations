import { defineCollection, z } from "astro:content";

/**
 * Blog collection — long-form editorial on color, Wada, and how to use
 * the archive in practical design work.
 *
 * Source files live in `src/content/blog/*.mdx`. Slug is the filename.
 */
const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    /** Short description — used in meta + card preview. ≤ 160 chars. */
    description: z.string(),
    /** ISO date (YYYY-MM-DD). */
    pubDate: z.string(),
    /** ISO date of last substantive edit. Optional. */
    updatedDate: z.string().optional(),
    /** One-line reading pitch shown in the blog index. */
    eyebrow: z.string().optional(),
    /** Primary palette slug referenced by the post (used to tint the hero). */
    palette: z.string().optional(),
    /** Related palette slugs linked from the post body. */
    relatedPalettes: z.array(z.string()).default([]),
    /** Keywords for <meta name="keywords">. */
    keywords: z.array(z.string()).default([]),
    /** If true, omit from the public index (drafts). */
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
