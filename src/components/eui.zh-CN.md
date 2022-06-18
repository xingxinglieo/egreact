---
title: eui
order: 3
toc: menu
---

## BaseLayout

> 基类，仅用于混入

| 属性名               | 类型                       | 描述                                               | 创建 | 清除 |
| -------------------- | -------------------------- | :------------------------------------------------- | :--- | :--- |
| bottom               | `number\|string`           | 距父级容器底部距离                                 |      |
| left                 | `number\|string`           | 距父级容器离左边距离                               |      |
| right                | `number\|string`           | 距父级容器右边距离                                 |      |
| top                  | `number\|string`           | 距父级容器顶部距离                                 |      |
| explicitHeight       | `number\|string`           | 外部显式指定的高度                                 |      |
| explicitWidth        | `number\|string`           | 外部显式指定的宽度                                 |      |
| horizontalCenter     | `string`                   | 在父级容器中距水平中心位置的距离                   |      |
| verticalCenter       | `string`                   | 在父级容器中距竖直中心位置的距离                   |      |
| includeInLayout      | `boolean`                  | 指定此组件是否包含在父容器的布局中                 |      |
| maxHeight            | `number\|string`           | 组件的最大高度,同时影响测量和自动布局的尺寸        |      |
| maxWidth             | `number\|string`           | 组件的最大高度                                     |      |
| minHeight            | `number\|string`           | 组件的最小高度,此属性设置为大于maxHeight的值时无效 |      |
| minWidth             | `number\|string`           | 组件的最小宽度,此属性设置为大于maxWidth的值时无效  |      |
| percentHeight        | `number\|string`           | 相对父级容器高度的百分比                           |      |
| percentWidth         | `number\|string`           | 相对父级容器宽度的百分比                           |      |
| onUiResize           | `(e: eui.UIEvent) => void` | 当UI组件的尺寸发生改变时调度                       |      |
| onUiMove             | `(e: eui.UIEvent) => void` | 当UI组件在父级容器中的位置发生改变时调度           |      |
| onUiCreationComplete | `(e: eui.UIEvent) => void` | 当UI组件第一次被添加到舞台并完成初始化后调度       |      |

## UIComponent

> 基类，仅用于混入  

[eui.UIComponent](https://docs.egret.com/uieditor/docs/api/eui/eui.UIComponent)  

> UIComponent 类是所有可视组件（可定制皮肤和不可定制皮肤）的基类。
父类组件混入：[displayObject](/components/egret#displayobject),[BaseLayout](/components/eui#baselayout)
| 属性名 | 类型 | 描述 | 创建 | 清除 |
| ------ | ---- | :--- | :--- | :--- |

## IViewport

> 基类，仅用于混入  

[eui.IViewport](https://docs.egret.com/uieditor/docs/api/eui/eui.IViewport)  

> 支持视区的组件接口。如果组件的内容子项比组件要大，而且您向往子项可以在父级组件的边缘处被裁减，您可以定义一个视区。视区是您希望显示的组件的区域的矩形子集，而不是显示整个组件。

父类组件混入：[UIComponent](/components/eui#uicomponent)

| 属性名        | 类型             | 描述                   | 创建 | 清除 |
| ------------- | ---------------- | :--------------------- | :--- | :--- |
| contentHeight | `number\|string` | 视域的内容的高度       |      |
| contentWidth  | `number\|string` | 视域的内容的宽度       |      |
| scrollH       | `number\|string` | 可视区域水平方向起始点 |      |
| scrollV       | `number\|string` | 可视区域竖直方向起始点 |      |
| scrollEnabled | `boolean`        | 是否启用容器滚动       |      |

## eui-component

[eui.Component](https://docs.egret.com/uieditor/docs/api/eui/eui.Component)  

> Component 类定义可设置外观的组件的基类。Component 类所使用的外观通常是 Skin 类的子类。通过设置 component 类的 skinName 属性，将 skin 类与 component 类相关联。

父类组件混入：[displayObjectContainer](/components/egret#displayobjectContainer),[BaseLayout](/components/eui#baselayout)

| 属性名           | 类型                      | 描述                                                           | 创建 | 清除 |
| ---------------- | ------------------------- | :------------------------------------------------------------- | :--- | :--- |
| skinName         | `any`                     | 皮肤标识符                                                     |      |
| currentState     | `string`                  | 组件的当前视图状态                                             |      |
| hostComponentKey | `string`                  | 主机组件标识符                                                 |      |
| enabled          | `boolean`                 | 组件是否可以接受用户交互                                       |      |
| skin             | `eui.Skin`                | 皮肤对象实例                                                   |      |
| onComplete       | `(e:egret.Event) => void` | 当设置skinName为外部exml文件路径时，加载并完成EXML解析后调度。 |      |

## eui-group

[eui.Group](https://docs.egret.com/uieditor/docs/api/eui/eui.Group)  

> Group 是自动布局的容器基类。如果包含的子项内容太大需要滚动显示，可以在在 Group 外部包裹一层 Scroller 组件(将 Group 实例赋值给 Scroller 组件的 viewport 属性)。Scroller 会为 Group 添加滚动的触摸操作功能，并显示垂直或水平的滚动条。

父类组件混入：[IViewport](/components/eui#iviewport)

| 属性名       | 类型                             | 描述                               | 创建 | 清除 |
| ------------ | -------------------------------- | :--------------------------------- | :--- | :--- |
| numElements  | `number\|string`                 | 布局元素子项的数量                 |      |
| touchThrough | `boolean`                        | 触摸组件的背景透明区域是否可以穿透 |      |
| hasState     | `(stateName: string) => boolean` |                                    |      |

## eui-image

[eui.Image](https://docs.egret.com/uieditor/docs/api/eui/eui.Image)  

> Image 控件允许您在运行时显示 JPEG、PNG 等图片文件文件。Image 继承至 Bitmap，因此您可以直接对其 bitmapData 属性，赋值从外部加载得到的位图数据以显示对应图片。同时，Image 还提供了更加方便的 source 属性，source 属性可以接受一个网络图片url作为值，赋值为url后，它内部会自动去加载并显示图片。并且您同样也可以直接把 BitmapData 对象赋值给 source 属性以显示图片。

父类组件混入：[bitmap](/components/egret#bitmap),[BaseLayout](/components/eui#baselayout)

| 属性名     | 类型                       | 描述                                                      | 创建 | 清除 |
| ---------- | -------------------------- | :-------------------------------------------------------- | :--- | :--- |
| source     | `string\|egret.Texture`    | 用于位图填充的源。可以是一个字符串或者 egret.Texture 对象 |      |
| onComplete | `(e: egret.Event) => void` | 当图片加载完成后调度                                      |      |

## eui-label

[eui.Label](https://docs.egret.com/uieditor/docs/api/eui/eui.Label)  

> Label 是可以呈示一行或多行统一格式文本的UI组件。要显示的文本由 text 属性确定。文本格式由样式属性指定，例如 fontFamily 和 size。因为 Label 运行速度快且占用内存少，所以它特别适合用于显示多个小型非交互式文本的情况，例如，项呈示器和 Button 外观中的标签。在 Label 中，将以下三个字符序列识别为显式换行符：CR（“\r”）、LF（“\n”）和 CR+LF（“\r\n”）。如果没有为 Label 指定宽度，则由这些显式换行符确定的最长行确定 Label 的宽度。如果指定了宽度，则指定文本将在组件边界的右边缘换行，如果文本扩展到低于组件底部，则将被剪切。

父类组件混入：[textField](/components/egret#textfield),[BaseLayout](/components/eui#baselayout)

| 属性名 | 类型     | 描述       | 创建 | 清除 |
| ------ | -------- | :--------- | :--- | :--- |
| style  | `string` | 文本样式。 |      |

## eui-bitmapLabel

[eui.BitmapLabel](https://docs.egret.com/uieditor/docs/api/eui/eui.BitmapLabel)  

> BitmapLabel 组件是一行或多行不可编辑的位图文本

父类组件混入：[displayObject](/components/egret#displayobject),[BaseLayout](/components/eui#baselayout)

| 属性名        | 类型             | 描述                                                                | 创建 | 清除 |
| ------------- | ---------------- | :------------------------------------------------------------------ | :--- | :--- |
| text          | `string`         | 要显示的文本内容                                                    |      |
| font          | `Object`         | 要使用的字体的名称或用逗号分隔的字体名称列表，类型必须是 BitmapFont |      |
| letterSpacing | `number\|string` | 一个整数，表示字符之间的距离                                        |      |
| lineSpacing   | `number\|string` | 一个整数，表示行与行之间的垂直间距量                                |      |
| smoothing     | `boolean`        | 控制在缩放时是否进行平滑处理                                        |      |
| textHeight    | `number\|string` | 获取位图文本测量高度                                                |      |
| textWidth     | `number\|string` | 获取位图文本测量宽度                                                |      |
| verticalAlign | `string`         | 文字的垂直对齐方式                                                  |      |

## eui-rect

[eui.Rect](https://docs.egret.com/uieditor/docs/api/eui/eui.Rect)  

> Rect 组件矩形绘图元素。此组件可响应鼠标事件。

父类组件混入：[eui-component](/components/eui#eui-component)

| 属性名        | 类型                             | 描述                                                     | 创建 | 清除 |
| ------------- | -------------------------------- | :------------------------------------------------------- | :--- | :--- |
| ellipseHeight | `number\|string`                 | 用于绘制圆角的椭圆的高度 (以像素为单位)                  |      |
| ellipseWidth  | `number\|string`                 | 用于绘制圆角的椭圆的宽度(以像素为单位)                   |      |
| fillAlpha     | `number\|string`                 | 填充透明度,默认值为1                                     |      |
| fillColor     | `number\|string`                 | 填充颜色                                                 |      |
| strokeAlpha   | `number\|string`                 | 边框透明度,注意：当 strokeWeight 为0时，不显示边框       |      |
| strokeColor   | `number\|string`                 | 边框颜色,注意：当 strokeWeight 为 0 时，不显示边框       |      |
| strokeWeight  | `number\|string`                 | 边框粗细(像素),注意：当 strokeWeight 为 0 时，不显示边框 |      |
| graphics      | [Graphics](/components#graphics) | 设置一系列 `graphics` 操作                               |      |

## eui-scroller

[eui.Group](https://docs.egret.com/uieditor/docs/api/eui/eui.Scroller)  

> Scroller 组件显示一个称为视域的单个可滚动组件，以及水平滚动条和垂直滚动条。该视域必须实现 IViewport 接口。

父类组件混入：[eui-component](/components/eui#eui-component)

| 属性名              | 类型             | 描述                                                                                                         | 创建 | 清除 |
| ------------------- | ---------------- | :----------------------------------------------------------------------------------------------------------- | :--- | :--- |
| bounces             | `boolean`        | 是否启用回弹，当启用回弹后，ScrollView中内容在到达边界后允许继续拖动，在用户拖动操作结束后，再反弹回边界位置 |      |
| scrollPolicyH       | `string`         | 指示在哪些条件下可以滚动并且显示水平滑动条                                                                   |      |
| scrollPolicyV       | `string`         | 指示在哪些条件可以滚动并且显示垂直滑动条                                                                     |      |
| throwSpeed          | `number\|string` | 调节滑动结束时滚出的速度                                                                                     |      |
| viewport            | `eui.IViewport`  | 要滚动的视域组件                                                                                             |      |
| horizontalScrollBar | `eui.HScrollBar` | 水平滚动条                                                                                                   |      |
| verticalScrollBar   | `eui.VScrollBar` | 垂直滚动条                                                                                                   |      |

**`viewport` 需要通过 `attach` 声明**， 点 [这里](/guide/basic#attach) 回顾，里面有一个 `eui-scroller` 的例子。
