
---
title: Paper-Hypergraph Neural Networks
description: In this paper, we present a hypergraph neural networks (HGNN) framework for data representation learning, which can encode high-order data correlation in a hypergraph structure. Confronting the challenges of learning representation for complex data in real practice, we propose to incorporate such data structure in a hypergraph, which is more flexible on data modeling, especially when dealing with complex data. In this method, a hyperedge convolution operation is designed to handle the data correlation during representation learning. In this way, traditional hypergraph learning procedure can be conducted using hyperedge convolution operations efficiently. HGNN is able to learn the hidden layer representation considering the high-order data structure, which is a general framework considering the complex data correlations. We have conducted experiments on citation network classification and visual object recognition tasks and compared HGNN with graph convolutional networks and other traditional methods. Experimental results demonstrate that the proposed HGNN method outperforms recent state-of-the-art methods. We can also reveal from the results that the proposed HGNN is superior when dealing with multi-modal data compared with existing methods.

publishDate: 2025-12-01
updatedDate: 2025-12-02
tags:
  - AAAI_2019
  - hypergraph_neural_networks(HGNN)
language: 中文
slug: Hypergraph
---
## 🛠️ Hypergraph Neural Networks 




## 补在最后
由于写这篇.md文档是直接在GitHub提交的
要经由Vercel上传
遇到了几次报错
第一次直接在GitHub编译日志

遇到的问题

```bash
---
title: Paper-Hypergraph Neural Networks
description: xxx
publishDate: 2025-12-01
updatedDate: 2025-12-02
tags:
  - AAAI_2019
  - hypergraph_neural_networks(HGNN)
language: 中文
slug: SOTA
---
```

以上是标题以及正文以上的内容格式
格式在 src/content.config.ts 文件中
Vercel报错的几次原因
1. publishDate 格式错误  正确格式应该是 2000-01-01 00:00
2. tags 必须要连起来 不能有空格
3. description 原 src/content.config.ts 配置文件中  description: z.string().max(160) 最大值只有160
   改成1600 就解决问题了

The End.

arxiv：https://arxiv.org/abs/1809.09401
