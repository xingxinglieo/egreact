---
title: 快速上手
order: 2
toc: menu
---

> 假设你已经熟悉 egret engine

## webpack 配置

你可能不了解如何使用 webpack 启动一个 egret 应用，本节将配置一个最简单的 webpack egreact 开发环境。

### 准备 egret 库

首先你需要准备 egret 库。

- 直接从旧项目复制过来，.d.ts 文件也需要一同复制过来

- npm 安装

  ```
  npm install egret-engine
  ```

- 通过 cnd 引入

> 注意 npm 的 egret-engine 最新版本是 5.2.18，建议直接从旧项目复制过来。

### html模版

在 html 模版补充 egret 库引入，不同存放方式改更对应的位置，下面是使用 jsdelivr 直接引入。

``` html
<head>
  <script src="https://cdn.jsdelivr.net/npm/egret-engine/build/egret/egret.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/egret-engine/build/egret/egret.web.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/egret-engine/build/eui/eui.min.js"></script>
</head>
```

### 安装 egret

``` bash
npm install egreact
```

### 配置 tsconfig.json

为了全局声明 `egret` 和 `eui` 的类型，在原先 `includes`的数组后追加 `"node_modules/egreact/types"`,这个文件夹是 egret 及相关库的 .d.ts 文件，或者追加复制的文件夹，如果里面带有此类 .d.ts 文件。

``` json
{
  "include": [
    "src",
    "node_modules/egreact/types" 
  ]
}
```

> 修改 tsconfig.json 后需要重启 vscode 才能生效

一个开发环境搭建就这么简单，一是引入 egret 库，二是配置 egret 的类型声明，如果你还有疑问，可以看看 [简单模版](https://github.com/xingxinglieo/egreact/tree/master/packages/dev)。

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
