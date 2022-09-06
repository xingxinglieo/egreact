---
title: 改造 exml
order: 1
toc: menu
---

## 语法

### 循环

项数较少的列表无需使用 `e:DataGroup` 组件，直接使用 tsx 中的 map 循环即可。

``` xml
<e:DataGroup dataProvider="data">
    <e:itemRendererSkinName>
        <e:Skin>
            <e:Image source="{data.url}" />
        </e:Skin>
    </e:itemRendererSkinName>
</e:DataGroup>
```

``` tsx | pure
<eui-group>
  {/* 别忘记了 key */}
  {data.map(({ url })=>(<eui-image source={url} key={url} />))}
</eui-group>
```

如果项数较多，为了复用 eui 的虚拟列表能力，egreact 导出了一个组件适配 `eui.DataGroup`

```tsx | pure
import { ItemRendererClass } from 'egreact'
<eui-dataGroup dataProvider={data}>
  {/* 用 ItemRendererClass 包裹 */}
	<ItemRendererClass>
    {/* children 需要为一个返回 jsx 的函数，参数为每个项的数据 */}
    {/* jsx 最外层元素必须是 eui-itemRenderer */}
		{(data, itemRendererInstance) => 
      <eui-itemRenderer width="100%">
        <eui-image source={data.url} key={data.url} />
      </eui-itemRenderer>}
	</ItemRendererClass>
</eui-dataGroup>
```

```ts | pure
interface ItemRendererClassProps {
  children: (data: any, instance: eui.ItemRenderer) => React.ReactElement
  // 是否开启渲染器模式，默认开启，开启后每一个项都会为其创建渲染器
  // 关闭则在父元素所在渲染器渲染
  // 建议多项数列表开启，性能更优，缺点是在 react devtool 中无法呈现布局结构
  useRenderer?: boolean 
  // 是否开启 react 18 的 concurrent 模式进行渲染，默认开启
  concurrent?: boolean
  // 是否开启同步渲染，默认关闭，与 concurrent 互斥，优先判断 sync
  sync?: boolean
}
```

### 属性为对象

将 exml 改造为 jsx 需要改造的地方并不多，在前面的组件介绍中，你应该了解到 egreact 组件属性和子组件的声明是界限分明的。比如在 exml 中，

``` xml
<e:Group>
    <e:layout>
        <e:VerticalLayout gap="12" />
    </e:layout>
</e:Group>
```  

`e:layout` 究竟是 `e:Group` 的属性还是子组件？`e:VerticalLayout` 是 `e:layout` 的属性亦或者是别的？不清楚，全看官方的定义和解析器如何解析。而在 egreact 中应该这么写，

``` tsx | pure
<eui-group layout="vertical" layout-gap={12}>
</eui-group>
```

应用于  `eui-group` 的属性及其子属性，都应该写在 `eui-group` 上。  

### 属性为子组件

有些特殊组件如 `scroller`，exml解析时也做了特殊处理。

``` xml
<e:Scroller>
    <e:Group></e:Group>
<e:Scroller>
```

实际上 `e:Group` 的实例并不是以 `addChild` 的方式加入 Scroller，而是通过 `viewport` 赋值，这些默认的规则，egreact 都需要显式地声明。

``` tsx | pure
<eui-scroller>
    <eui-group attach="viewport"></eui-group>
</eui-group>
```
## vscode 插件 exml2egreact

为了转换/兼容更为高效，egreact 提供了一个 vscode 插件帮助转换 exml 到 egreact 的 tsx 组件。
vscode 插件市场搜索 exml2egreact 安装后，在 `.exml` 文件或包括 `.exml` 的文件夹右键选择`exml2egreact`，就会在同目录下生成同名的 `.tsx` 文件。

<img src="https://xingxinglieo.github.io/egreact/exml2egreact2.png" height="500">

原 exml 文件
```xml
<?xml version="1.0" encoding="utf-8"?>
<e:Skin class="skins.RadioButtonSkin" states="up,down,disabled,upAndSelected,downAndSelected,disabledAndSelected" xmlns:e="http://ns.egret.com/eui">
    <e:Group width="100%" height="100%">
        <e:layout>
            <e:HorizontalLayout verticalAlign="middle"/>
        </e:layout>
        <e:Image fillMode="scale" alpha="1" alpha.disabled="0.5" alpha.down="0.7"
                 source="radiobutton_unselect_png"
                 source.upAndSelected="radiobutton_select_up_png"
                 source.downAndSelected="radiobutton_select_down_png"
                 source.disabledAndSelected="radiobutton_select_disabled_png"/>
        <e:Label id="labelDisplay" size="20" textColor="0x707070"
                 textAlign="center" verticalAlign="middle"
                 fontFamily="Tahoma"/>
    </e:Group>
</e:Skin>

```
转换后

```tsx | pure
import React, { useRef, useState, useEffect } from "react";

export default function RadioButtonSkin({ context }) {
  const { currentState } = context;

  const labelDisplayRef = useRef<eui.Label>(null!);

  useEffect(() => {
    context.labelDisplay = labelDisplayRef.current;
  });

  return (
    <>
      <eui-group width="100%" height="100%" layout="horizontal">
        <eui-image
          fillMode="scale"
          alpha={{ disabled: 0.5, down: 0.7 }[currentState] ?? 1}
          source={
            {
              upAndSelected: "radiobutton_select_up_png",
              downAndSelected: "radiobutton_select_down_png",
              disabledAndSelected: "radiobutton_select_disabled_png"
            }[currentState] ?? "radiobutton_unselect_png"
          }
        />
        <eui-label
          size={20}
          textColor={0x707070}
          textAlign="center"
          verticalAlign="middle"
          fontFamily="Tahoma"
          ref={labelDisplayRef}
        />
      </eui-group>
    </>
  );
}
```

根据使用方式我们再调整转换后的文件

- 替换皮肤：在原本的 view 层，删除 skinName，再用 mobx 进行数据的桥接

``` tsx | pure
import RadioButtonSkin from './RadioButtonSkin.tsx';
import { createEgreactRoot } from 'egreact'
import { makeAutoObservable, autorun } from 'mobx';
export default class RadioButtonView extends eui.Component {
    root = createEgreactRoot(this)
    labelDisplay: eui.Label
    // skinName =  skins.RadioButtonSkin
    constructor(){
        super()
        makeAutoObservable(this)
        // 第二个参数必须传入 ture，声明为同步渲染
        autorun(() => this.root.render(<RadioButtonSkin context={this} />, true))
    }
}
```

- 根据转换后的文件直接重写
