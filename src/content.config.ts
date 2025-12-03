import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

function removeDupsAndLowerCase(array: string[]) {
  if (!array.length) return array;
  const lowercaseItems = array.map((str) => str.toLowerCase());
  const distinctItems = new Set(lowercaseItems);
  return Array.from(distinctItems);
}

// 允许：缺失 / "" / null -> fallback
const publishDateSchema = z.preprocess(
  (v) => (v === "" || v == null ? new Date() : v),
  z.coerce.date()
);

const optionalDateSchema = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.coerce.date().optional()
);

// Define blog collection
const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().max(60),
        description: z.string().max(1600),

        publishDate: publishDateSchema,
        updatedDate: optionalDateSchema,

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
      })
      .transform((data) => ({
        ...data,
        updatedDate: data.updatedDate ?? data.publishDate,
      })),
});

// Define docs collection
const docs = defineCollection({
  loader: glob({ base: "./src/content/docs", pattern: "**/*.{md,mdx}" }),
  schema: () =>
    z
      .object({
        title: z.string().max(60),
        description: z.string().max(1600),

        publishDate: publishDateSchema,
        updatedDate: optionalDateSchema,

        tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
        draft: z.boolean().default(false),
        order: z.number().default(999),
      })
      .transform((data) => ({
        ...data,
        updatedDate: data.updatedDate ?? data.publishDate,
      })),
});

export const collections = { blog, docs };
