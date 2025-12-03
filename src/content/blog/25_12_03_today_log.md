---
title: 2025-12-03 Today Log
description: Record today's log
publishDate: 
updatedDate: 
tags:
  - Today_log
  - pubData
language: 中文
slug: 25_12_13_today_log
---
## 🛠️ The Record of today's log
  
记录一下今日日志  
  
将博客整理了一下   
具体活动如下：  
1. 修改了博客的一些构造 如：  
   将原来的 route 路由 archive 修改成了 projects （本来就是projects 算是拨乱反正  
2. 写了两篇 blog  （目前是两篇 但其实还有一些想写的东西 暂时先按下不表  
3. 修改了 signature 的 bug  
   详情见 [Worry_Signature](https://blog.deepl.win/blog/Worry_Signature)  
4. 也算是初次尝试 （其实昨天已经尝试了  
   在 GitHub 上写 日志 博客  
   对于其构造也很熟练了  
   以后仍会坚持写 （希望如此  
5. 对于 Github 上写 blog 的格式  
   做一些修改  
   将在接下来阐述 并不但做一章了  

   
   对于 blog 的标题部分的格式 做了一些完善
   
```bash
这是标题格式
    ---
title: 2025-12-03 Today Log
description: Record today's log
publishDate: 
updatedDate: 
tags:
  - Today_log
  - pubData
language: 中文
slug: 25_12_13_today_log
---
```
对于其中的 publishData 和 updataData  
在原来的场景中 只能用作手动输入  

而我希望能够自动生成时间表示  

于是再经过查询 ChatGPT 之后  
提出了修改 /src/content.config.ts 文件  
给出如下代码  

```bash
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
```

源代码我将在下面进行标注  

```bash
schema: ({ image }) =>
    z.object({
      // Required
      title: z.string().max(60),
      description: z.string().max(160),
      publishDate: z.coerce.date(),
      // Optional
      updatedDate: z.coerce.date().optional(),
...  

```

将 publishDate 改为不填写也能获取到当前时间  
updataDate 则改为自动记录  
  
当然修改完成以后  
还没进行测试  
此日志也将作为测试的一部分  
  

结果：
<img width="625" height="747" alt="截屏2025-12-03 17 51 00" src="https://github.com/user-attachments/assets/c550cc35-6942-409b-b8c3-31a0f7b687ff" />
首次表现结果成功  
但时间是 GMT（格林尼治标准时间）  
不是北京时间  
  
进行修改  
在我查完 GPT 之后发现了一个棘手的问题  
页面暂且按下不表  
若是修改 rss 中的时间 则波及范围太广  
暂时不进行 rss 的修改  
之后📎附件将提出 GPT 对话  
  
那么现在问题就是  
在 blog 中  
具体时间是不显示的  
只显示日期  
那么我对于测试的结果只能依靠于 rss  
这显然是不优越的  

我将进行修改  






## 附件

The End.  

