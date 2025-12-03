import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

function removeDupsAndLowerCase(array: string[]) {
  if (!array.length) return array
  const lowercaseItems = array.map((str) => str.toLowerCase())
  const distinctItems = new Set(lowercaseItems)
  return Array.from(distinctItems)
}

// 空/缺失 => undefined（用于 updatedDate）
const optionalDateSchema = z.preprocess(
  (v) => (v === '' || v == null ? undefined : v),
  z.coerce.date().optional()
)

// Define blog collection
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().max(60),
        description: z.string().max(1600),

        // ✅ publishDate：按你原先习惯为必填
        publishDate: z.coerce.date(),

        // ✅ updatedDate：可选，没填就让 transform 去回退
        updatedDate: optionalDateSchema,

        heroImage: z
          .object({
            src: image(),
            alt: z.string().optional(),
            inferSize: z.boolean().optional(),
            width: z.number().optional(),
            height: z.number().optional(),
            color: z.string().optional()
          })
          .optional(),

        tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
        language: z.string().optional(),
        draft: z.boolean().default(false),
        comment: z.boolean().default(true),
        slug: z.string().optional()
      })
      .transform((data) => ({
        ...data,
        // ✅ 还原点：updatedDate 没填就等于 publishDate
        updatedDate: data.updatedDate ?? data.publishDate
      }))
})

// Define docs collection
const docs = defineCollection({
  loader: glob({ base: './src/content/docs', pattern: '**/*.{md,mdx}' }),
  schema: () =>
    z
      .object({
        title: z.string().max(60),
        description: z.string().max(1600),

        // docs 这里按你之前也有 default new Date 的写法
        publishDate: z.coerce.date().default(() => new Date()),
        updatedDate: optionalDateSchema,

        tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
        draft: z.boolean().default(false),
        order: z.number().default(999)
      })
      .transform((data) => ({
        ...data,
        updatedDate: data.updatedDate ?? data.publishDate
      }))
})

export const collections = { blog, docs }
