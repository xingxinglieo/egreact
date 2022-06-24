---
title: 改造 exml
order: 5
toc: menu
---

## 属性为对象

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

## 属性为子组件

有些特殊组件如 `scroll`，exml解析时也做了特殊处理。

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

## 循环

无需使用 `e:DataGroup` 组件（且 egreact 也没有拓展这个组件），直接使用 jsx 中的 map 循环即可。

``` xml
<e:DataGroup>
    <e:itemRendererSkinName>
        <e:Skin>
            <e:Image source="{data.url}" />
        </e:Skin>
    </e:itemRendererSkinName>
</e:DataGroup>
```

``` tsx | pure
<eui-group>
    {data.map(({ url })=>(<eui-image  source={url}/>))}
</eui-group>
```
