import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

function removeDupsAndLowerCase(array: string[]) {
  if (!array.length) return array
  const lowercaseItems = array.map((str) => str.toLowerCase())
  const distinctItems = new Set(lowercaseItems)
  return Array.from(distinctItems)
}

/**
 * 可选日期：把空字符串 / null / undefined / 0 过滤掉，避免 z.coerce.date() 解析出 1970
 */
const optionalDateSchema = z.preprocess(
  (v) => {
    if (v === '' || v == null) return undefined
    if (v === 0 || v === '0') return undefined
    if (typeof v === 'string' && v.trim() === '') return undefined
    return v
  },
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

        // ✅ 仍然必填（你前面说过要还原 publishDate / updatedDate 一致体系）
        publishDate: z.coerce.date(),

        // ✅ 不填 updatedDate 没关系（由下面 transform 兜底）
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

        /**
         * ✅ 你的需求：不填 updatedDate 时，显示“现在时间”
         * 这会在每次构建/部署时更新为构建时刻
         */
        updatedDate: data.updatedDate ?? new Date()
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

        publishDate: z.coerce.date().default(() => new Date()),
        updatedDate: optionalDateSchema,

        tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
        draft: z.boolean().default(false),
        order: z.number().default(999)
      })
      .transform((data) => ({
        ...data,

        // docs 同理：不填 updatedDate -> 显示现在（构建时）
        updatedDate: data.updatedDate ?? new Date()
      }))
})

export const collections = { blog, docs }
