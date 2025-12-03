import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

function removeDupsAndLowerCase(array: string[]) {
  if (!array.length) return array;
  const lowercaseItems = array.map((str) => str.toLowerCase());
  return Array.from(new Set(lowercaseItems));
}

// 允许：缺失 / "" / null -> undefined（不兜底成 1970，也不自动 new Date()）
const optionalDate = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.coerce.date().optional()
);

// Blog collection
const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(60),
      description: z.string().max(1600),

      // ✅ 允许不填，由 GitHub Action 首次写入并固定
      publishDate: optionalDate,

      // ✅ 允许不填，由 GitHub Action 每次提交更新
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

      // docs 也允许不填（避免构建失败）
      publishDate: optionalDate,
      updatedDate: optionalDate,

      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
      draft: z.boolean().default(false),
      order: z.number().default(999),
    }),
});

export const collections = { blog, docs };
