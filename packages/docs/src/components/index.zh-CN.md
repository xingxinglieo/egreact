---
title: 接口
order: 1
toc: menu
nav:
  title: 组件
  order: 2
---

为了提高属性处理的复用率和提供良好的类型定义，在原生组件中有两种复用方式：  
- 父类组件混入，对应 egret 中显示对象类的继承，拥有父类组件的所有属性。
- 属性接口混入，不同组件上的 prop，拥有相同的接口，且这个接口有子属性，就会采用这种方式。
      
  比如 `Rectangle` 这个接口，在分别是 `displayObject` 的 `scrollRect` 和 `bitmap` 的 `scale9Grid` 的接口，它们都会混入这个接口及子属性，唯一不同的就是前缀名。

```
// displayObject scrollRect 及子属性
scrollRect
scrollRect-height
scrollRect-width
...

// bitmap scale9Grid 及子属性
scale9Grid
scale9Grid-height
scale9Grid-width
...
```  

> 原生组件是根据 [egret 文档](https://docs.egret.com/engine/docs/api/engine/egret.Base64Util)设置相应的 prop，只要未明确表明是只读属性就会被囊括进来，未全部验证，所以**有些属性可能无法设置**（可能是只读属性，可能不是直接赋值设置）。
## Graphics

[egret.Graphics](https://docs.egret.com/engine/docs/api/engine/egret.Graphics)

> Graphics 类包含一组可用来创建矢量形状的方法。支持绘制的显示对象包括 Sprite 和 Shape 对象。这些类中的每一个类都包括 graphics 属性，该属性是一个 Graphics 对象。以下是为便于使用而提供的一些辅助函数：drawRect()、drawRoundRect()、drawCircle() 和 drawEllipse()。

| 属性名    | 类型                                                                                                                  | 描述 | 创建                                                         | 清除               |
| --------- | --------------------------------------------------------------------------------------------------------------------- | :--- | :----------------------------------------------------------- | :----------------- |
| `${name}` | `[string, ...any[]][]\|egret.Graphics\|(graphics:egret.Graphics, instance:any)=> void\|((isRemove: boolean) => void)` |      | 传入序列数组时，执行序列操作；**比较时，将二层数组铺平比较** | `graphics.clear()` |

`[string, ...any[]][]` 第一个 `string` 是执行的函数名，后面的值是传入函数的参数
``` tsx | pure
const actions = [
  ['beginFill', 0x000000],
  ['drawRect', 0, 0, 300, 100],
  ['endFill'],
]
// 将执行以下操作
graphics.beginFill(0x000000)
graphics.drawRect(0, 0, 300, 100)
graphics.endFill()
```


## Point
[egret.Point](https://docs.egret.com/engine/docs/api/engine/egret.Point)

> Point 对象表示二维坐标系统中的某个位置，其中 x 表示水平轴，y 表示垂直轴。

| 属性名      | 类型                        | 描述           | 创建                                     | 清除 |
| ----------- | --------------------------- | :------------- | :--------------------------------------- | :--- |
| `${name}`   | `[]\|number[]\|egret.Point` |                | 传入数组时， `new egret.Ponit(...value)` |
| `${name}-x` | `string\|number`            | 该点的水平坐标 |                                          |
| `${name}-y` | `string\|number`            | 该点的垂直坐标 |                                          |

## Rectangle
[egret.Rectangle](https://docs.egret.com/engine/docs/api/engine/egret.Rectangle)

> Rectangle 对象是按其位置（由它左上角的点 (x, y) 确定）以及宽度和高度定义的区域。Rectangle 类的 x、y、width 和 height 属性相互独立；更改一个属性的值不会影响其他属性。但是，right 和 bottom 属性与这四个属性是整体相关的。例如，如果更改 right 属性的值，则 width属性的值将发生变化；如果更改 bottom 属性，则 height 属性的值将发生变化。

| 属性名                | 类型                            | 描述                                                           | 创建                                         | 清除 |
| --------------------- | ------------------------------- | :------------------------------------------------------------- | :------------------------------------------- | :--- |
| `${name}`             | `[]\|number[]\|egret.Rectangle` |                                                                | 传入数组时， `new egret.Rectangle(...value)` |
| `${name}-height`      | `string\|number`                | 矩形的高度（以像素为单位）                                     |                                              |
| `${name}-width`       | `string\|number`                | 矩形的宽度（以像素为单位）                                     |                                              |
| `${name}-left`        | `string\|number`                | 矩形左上角的 x 坐标                                            |                                              |
| `${name}-right`       | `string\|number`                | x 和 width 属性的和                                            |                                              |
| `${name}-top`         | `string\|number`                | 矩形左上角的 y 坐标                                            |                                              |
| `${name}-bottom`      | `string\|number`                | y 和 height 属性的和                                           |                                              |
| `${name}-x`           | `string\|number`                | 矩形左上角的 x 坐标                                            |                                              |
| `${name}-y`           | `string\|number`                | 矩形左上角的 y 坐标                                            |                                              |
| `${name}-bottomRight` | [Point](/components#point)      | 由 right 和 bottom 属性的值确定的 Rectangle 对象的右下角的位置 |                                              |
| `${name}-topLeft`     | [Point](/components#point)      | 由该点的 x 和 y 坐标确定的 Rectangle 对象左上角的位置          |                                              |

## Texture
[egret.Texture](https://docs.egret.com/engine/docs/api/engine/egret.Texture)

> 纹理类是对不同平台不同的图片资源的封装在HTML5中，资源是一个HTMLElement对象在OpenGL / WebGL中，资源是一个提交GPU后获取的纹理idTexture类封装了这些底层实现的细节，开发者只需要关心接口即可

| 属性名                      | 类型                | 描述                              | 创建                               | 清除 |
| --------------------------- | ------------------- | :-------------------------------- | :--------------------------------- | :--- |
| `${name}`                   | `[]\|egret.Texture` |                                   | 传入数组时， `new egret.Texture()` |
| `${name}-bitmapData`        | `egret.Bitmap`      | 被引用的 BitmapData 对象          |                                    |
| `${name}-disposeBitmapData` | `boolean`           | 销毁纹理时是否销毁对应 BitmapData |                                    |
| `${name}-ktxData`           | `ArrayBuffer`       | 被引用的 KTXData 对象             |                                    |


## LayoutBase

[eui.LayoutBase](http://docs.egret.com/uieditor/docs/api/eui/eui.LayoutBase),[eui.BasicLayout](http://docs.egret.com/uieditor/docs/api/eui/eui.BasicLayout),[eui.TileLayout](http://docs.egret.com/uieditor/docs/api/eui/eui.TileLayout),[eui.VerticalLayout](http://docs.egret.com/uieditor/docs/api/eui/eui.VerticalLayout),[eui.HorizontalLayout](http://docs.egret.com/uieditor/docs/api/eui/eui.HorizontalLayout)

>  容器布局基类。若要创建使用 Group 容器的自定义布局，必须扩展 LayoutBase 或其子类之一。子类必须实现 updateDisplayList() 方法（定位 target Group 的子项并调整这些子项的大小）和 measure() 方法（计算 target 的默认大小）。 | 传入字符时，创建对应的实例 

| 属性名                         | 类型                                                        | 描述                                                                                                                                    | 创建 | 清除 |
| ------------------------------ | ----------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- | :--- | :--- |
| `${name}`                      | `'basic'\|'tile'\|'horizontal'\|'vertical'\|eui.LayoutBase` |                                                                                                                                         |
| `${name}-gap`                  | `number\|string`                                            | 布局元素之间的间隔（以像素为单位）                                                                                                      |      |
| `${name}-horizontalAlign`      | `string`                                                    | 指定如何在水平方向上对齐单元格内的元素                                                                                                  |      |
| `${name}-verticalAlign`        | `string`                                                    | 指定如何在垂直方向上对齐单元格内的元素。支持的值有：VerticalAlign.TOP、VerticalAlign.MIDDLE、VerticalAlign.BOTTOM、JustifyAlign.JUSTIFY |      |
| `${name}-paddingBottom`        | `number\|string`                                            | 容器的底边缘与所有容器的布局元素的底边缘之间的最少像素数                                                                                |      |
| `${name}-paddingLeft`          | `number\|string`                                            | 容器的左边缘与第一个布局元素的左边缘之间的像素数                                                                                        |      |
| `${name}-paddingBottom`        | `number\|string`                                            | 容器的底边缘与所有容器的布局元素的底边缘之间的最少像素数                                                                                |      |
| `${name}-paddingRight`         | `number\|string`                                            | 容器的右边缘与最后一个布局元素的右边缘之间的像素数                                                                                      |      |
| `${name}-paddingTop`           | `number\|string`                                            | 容器的顶边缘与所有容器的布局元素的顶边缘之间的最少像素数                                                                                |      |
| `${name}-columnAlign`          | `string`                                                    | 指定如何将完全可见列与容器宽度对齐                                                                                                      |      |
| `${name}-columnCount`          | `number\|string`                                            | 实际列计数                                                                                                                              |      |
| `${name}-columnWidth`          | `number\|string`                                            | 包含实际列宽（以像素为单位）                                                                                                            |      |
| `${name}-horizontalGap`        | `number\|string`                                            | 列之间的水平空间（以像素为单位）                                                                                                        |      |
| `${name}-orientation`          | `string`                                                    | 指定是逐行还是逐列排列元素                                                                                                              |      |
| `${name}-requestedColumnCount` | `number\|string`                                            | 要显示的列数                                                                                                                            |      |
| `${name}-requestedRowCount`    | `number\|string`                                            | 要显示的行数                                                                                                                            |      |
| `${name}-rowAlign`             | `string`                                                    | 指定如何将完全可见行与容器高度对齐                                                                                                      |      |
| `${name}-rowCount`             | `number\|string`                                            | 行计数                                                                                                                                  |      |
| `${name}-rowHeight`            | `number\|string`                                            | 行高（以像素为单位）                                                                                                                    |      |
| `${name}-verticalGap`          | `number\|string`                                            | 行之间的垂直空间（以像素为单位）                                                                                                        |      |
| `${name}-useVirtualLayout`     | `boolean`                                                   | 若要配置容器使用虚拟布局，请为与容器关联的布局的 useVirtualLayout 属性设置为 true                                                       |      |


