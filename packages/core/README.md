# egreact

## 介绍

一个为 egret 而生的 react渲染器。

## 功能

- 混合开发，用 react 开发 egret 应用的 UI，还支持 redux，react-router 等库，支持 react-devtool 查看和选择组件。
- 完备的 TypeScript 支持，编写 egreact 时处处有 TypeScript 提示，给予最好的开发体验
- 自定义原生组件，开放自定义原生组件的接口，可以自行拓展原生组件，拓宽组件的描述能力。

## 使用和指引

为了体验大量在线实例，建议您阅读[文档](https://xingxinglieo.github.io/egreact)

## 快速开始

在 react-dom 环境 和 egret 环境下，

``` bash
pnpm i egreact
```

``` tsx
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

或者在 egret 中像皮肤一样使用

``` ts
import { createEgreactRoot } from 'egreact'
class ReactRender extends egret.DisplayObjectContainer {
  root = createEgreactRoot(this)
  constructor(reactNode: React.ReactNode) {
    super()
    this.addEventListener(egret.Event.ADDED, () => this.root.render(reactNode), this)
    this.addEventListener(egret.Event.REMOVED, () => this.root.unmount(), this)
  }
}
const displayObjectContainer = new egret.displayObjectContainer();
displayObjectContainer.addChild(new ReactRender(
    <sprite
      graphics={[
        ['beginFill', 0x000000],
        ['drawRect', 0, 0, 300, 100],
        ['endFill'],
      ]}>
      <textField size={16}>Hello, egreact</textField>
    </sprite>  
))
```

```
core
├─ src
│  ├─ Components                自定义组件
│  ├─ Host                      定义原生组件
│  ├─ constants.ts              定义常量
│  ├─ devtool.ts                react devtool 的 hack 逻辑
│  ├─ index.ts 
│  ├─ outside.ts                外部逻辑
│  ├─ renderer                  定义 renderer
│  │  ├─ create.ts              createEgreact 相关 
│  │  └─ index.ts               定义 HostConfig
│  │  └─ utils
│  │     ├─ attach.ts           attachInfo 给实例附加信息
│  │     ├─ index.ts            
│  │     └─ props.ts            对比属性和应用变更
│  ├─ type.ts                   类型定义
│  └─ utils
│     └─ index.ts
```