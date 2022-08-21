---
title: egreact - 为 egret 而生的 react 渲染器
order: 10
hero:
  title: egreact
  desc: 🕊️ 为 egret 而生的 react 渲染器
  actions:
    - text: 快速上手
      link: /guide
features:
  - icon: https://xingxinglieo.github.io/egreact/react.png
    title: 混合开发 
    desc: 用 react 开发 egret 应用的 UI，支持 redux，react-router 等 react 生态

  - icon: https://xingxinglieo.github.io/egreact/typescript.png
    title: 完备的 TypeScript 支持
    desc: 编写 egreact 时处处有 TypeScript 提示，给予最好的开发体验

  - icon: https://xingxinglieo.github.io/egreact/util.png
    title: 工具支持 
    desc: 支持 React Devtool 调试，vscode 插件 exml2egreact

  - icon: https://xingxinglieo.github.io/egreact/custom.png
    title: 自定义原生组件
    desc: 开放自定义原生组件的接口，可以自行拓展原生组件，拓宽组件的描述能力。
---

## 展示

``` tsx
/**
 * iframe: 750
 * defaultShowCode: false
 */
import React from "react"
import { Egreact } from "egreact";
import FriendList from './friend-list/index.tsx' 
export default () => (
  <Egreact 
    style={{
      margin: "auto",
      width: "100%",
      height: "100%"
    }}
    orientation="auto"
    scaleMode="fixedHeight"
    contentWidth="750" 
    contentHeight="1334"
  >
    <FriendList />
  </Egreact>
);
```

## 反馈与共建

[GitHub](https://github.com/xingxinglieo/egreact)期待你的 start！
[qq 群](https://qm.qq.com/cgi-bin/qm/qr?k=wLVjCrDj27-_GpnyuuVAv5HTWT73p9vb&authKey=uKtOPKgV5S%2FbSQfz%2BSnN%2BdXy55LUtsWcnpUBQU%2FbM5JRlZQJqx1ktBJEsPG7dsUX&noverify=0&group_code=468344181)
