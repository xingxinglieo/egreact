---
title: 快速上手
order: 2
toc: menu
---

> 假设你已经熟悉 egret engine

## 环境准备
你需要保证全局声明 egret 和 eui，无论是用工具注入还是在 script 标签中引入 egret 的库。
``` html
<head>
  <script src="https://cdn.jsdelivr.net/npm/egret-engine@5.2.18/build/egret/egret.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/egret-engine@5.2.18/build/egret/egret.web.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/egret-engine@5.2.18/build/eui/eui.min.js"></script>
</head>
```
## 安装
``` bash
npm install @egreact/core
```

## 示例

```tsx
/**
 * iframe: 100
 * defaultShowCode: true
 */
import React from 'react'
import { Egreact } from 'egreact'

export default () => (
  <Egreact>
    <sprite
      graphics={[
        ['beginFill', 0x000000],
        ['drawRect', 0, 0, 300, 100],
        ['endFill'],
      ]}>
      <textField size={16}>Hello, egreact</textField>
    </sprite>
  </Egreact>
)
```

