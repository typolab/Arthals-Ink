import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

function removeDupsAndLowerCase(array: string[]) {
  if (!array.length) return array;
  const lowercaseItems = array.map((str) => str.toLowerCase());
  return Array.from(new Set(lowercaseItems));
}

/**
 * Optional date field that:
 * - treats: missing / "" / null / undefined as undefined
 * - treats: 0 / "0" as undefined (prevents 1970 epoch bugs)
 * - otherwise coerces to Date
 */
const optionalDate = z.preprocess(
  (v) => {
    if (v === "" || v == null) return undefined;
    if (v === 0 || v === "0") return undefined;
    // also handle "   " (spaces)
    if (typeof v === "string" && v.trim() === "") return undefined;
    return v;
  },
  z.coerce.date().optional()
);

// Blog collection
const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(60),
      description: z.string().max(1600),

      // ✅ allow missing; don't auto-generate build-time dates
      publishDate: optionalDate,
      updatedDate: optionalDate,

      heroImage: z
        .object({
          src: image(),
          alt: z.string().optional(),
          inferSize: z.boolean().optional(),
          width: z.number().optional(),
          height: z.number().optional(),
          color: z.string().optional(),
        })
        .optional(),

      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
      language: z.string().optional(),
      draft: z.boolean().default(false),
      comment: z.boolean().default(true),
      slug: z.string().optional(),
    }),
});

// Docs collection
const docs = defineCollection({
  loader: glob({ base: "./src/content/docs", pattern: "**/*.{md,mdx}" }),
  schema: () =>
    z.object({
      title: z.string().max(60),
      description: z.string().max(1600),

      // ✅ allow missing for docs too
      publishDate: optionalDate,
      updatedDate: optionalDate,

      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
      draft: z.boolean().default(false),
      order: z.number().default(999),
    }),
});

export const collections = { blog, docs };
