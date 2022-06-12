---
title: 自定义组件
order: 4
toc: menu
---

为了增加原生组件的描述能力，egreact 还内置了一些自定义组件。

## primitive

传入一个对象作为内部实例。

| 属性名 | 类型  | 描述       | 创建 | 清除 |
| ------ | ----- | :--------- | :--- | :--- |
| object | `any` | 传入的对象 |      |      |

如果 object 实现了 `addChild,removeChild,addChildAt,getChildIndex` 四个方法，则它也可以直接在 tsx 编写子组件;  
如果它拥有 text 属性，则它也可以插入文字。  
  
`primitive` 不限制属性和事件，按照默认的规则进行解析，但是有以下限制规则

- 除 `key` 和 `ref` 外，**`object` 必须写在最前面**，因为属性按顺序挂载，必须先存在内置实例才能挂载后续属性。
- **`object` 不可更新，如果需要更新请加上 `key`**，走 react 的重新挂载组件的流程。

``` tsx
/**
 * iframe: 200
 */
import React, { useEffect , useState } from 'react'
import { Egreact } from 'egreact'
const sprite = new egret.Sprite()
sprite.graphics.beginFill(0xff8fae, 1);
sprite.graphics.drawRect(0, 0, 150, 150);
sprite.graphics.endFill();
const TestPrimitive = () => {
  const [container, setContainer] = useState(
    new egret.DisplayObjectContainer(),
  )
  const [x,setX] = useState(50);
  useEffect(() => {
    setTimeout(() => {
      setContainer(sprite)
    }, 2000)
  }, [])

  return (
    <displayObjectContainer>
      <primitive
        object={container}
        key={container.$hashCode}
        onTouchTap={()=> setX((x) => x + 50)}
        x={x}>
        <eui-rect fillColor={0x888888} width={100} height={100}></eui-rect>
      </primitive>
    </displayObjectContainer>
  )
}

export default () => (
  <Egreact>
    <TestPrimitive />
  </Egreact>
);
```

## font

内部实例为`egret.ITextElement`,赋值除 `text` 外属性时，挂载到 font.style 上 

| 属性名      | 类型             | 描述 | 创建 | 清除 |
| ----------- | ---------------- | :--- | :--- | :--- |
| text        | `string`         |      |
| textColor   | `number\|string` |      |
| strokeColor | `number\|string` |      |
| size        | `number\|string` |      |
| stroke      | `number\|string` |      |
| bold        | `boolean`        |      |
| italic      | `boolean`        |      |
| fontFamily  | `string`         |      |
| href        | `string`         |      |
| target      | `string`         |      |
| underline   | `boolean`        |      |

## objectContainer

内部实例为一个空对象。

| 属性名 | 类型 | 描述 | 创建 | 清除 |
| ------ | ---- | :--- | :--- | :--- |

| 方法名   | 类型       | 描述                                                          |
| -------- | ---------- | ------------------------------------------------------------- |
| reAttach | () => void | 如果本组件是 attach component，调用时会重新在父组件实例上赋值 |

没有实现 `addChild` 等方法，但子组件可以通过 `attach` 挂载在对象上。

## arrayContainer

内部实例为一个空数组。

| 属性名 | 类型 | 描述 | 创建 | 清除 |
| ------ | ---- | :--- | :--- | :--- |

| 方法名   | 类型       | 描述                                                          |
| -------- | ---------- | ------------------------------------------------------------- |
| reAttach | () => void | 如果本组件是 attach component，调用时会重新在父组件实例上赋值 |

实现了 `addChild` 等方法，可以直接编写子组件。

综合 `font,objectContainer,arrayContainer` 的例子
``` tsx
/**
 * iframe: 200
 */
import { Egreact , ArrayContainer } from 'egreact'
import React, { useEffect, useRef, useState } from "react";

export default function TestFont() {
  const [count, setCount] = useState(0);
  const arrayContainer = useRef<ArrayContainer>(null);
  useEffect(() => {
    // textfield 的 textflow 属性，在每次数组有更新都需要 reAttach 一下才能生效
    arrayContainer.current.reAttach();
  },[count]);

  return (
    <eui-label
      onTouchTap={() => setCount((count) => count + 1)}
    >
      <arrayContainer attach="textFlow" ref={arrayContainer}>
        <font textColor={0x00ffff}>i click </font>
        <objectContainer text={count + ''} style={{ textColor: 0xff0000 }} />
      </arrayContainer>
    </eui-label>
  );
}
export default () => (
  <Egreact>
    <TestFont />
  </Egreact>
);
```
