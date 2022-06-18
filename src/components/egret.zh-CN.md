---
title: egret
order: 2
toc: menu
---

## displayObject

[egret.DisplayObject](https://docs.egret.com/engine/docs/api/engine/egret.DisplayObject)  
> DisplayObject 类是可放在显示列表中的所有对象的基类。该显示列表管理运行时中显示的所有对象。使用 DisplayObjectContainer 类排列显示列表中的显示对象。DisplayObjectContainer 对象可以有子显示对象，而其他显示对象（如 Shape 和 TextField 对象）是“叶”节点，没有子项，只有父级和同级。DisplayObject 类有一些基本的属性（如确定坐标位置的 x 和 y 属性），也有一些高级的对象属性（如 Matrix 矩阵变换）。
> DisplayObject 类包含若干广播事件。通常，任何特定事件的目标均为一个特定的 DisplayObject 实例。例如，added 事件的目标是已添加到显示列表的目标 DisplayObject 实例。若只有一个目标，则会将事件侦听器限制为只能监听在该目标上（在某些情况下，可监听在显示列表中该目标的祖代上）。但是对于广播事件，目标不是特定的 DisplayObject 实例，而是所有 DisplayObject 实例（包括那些不在显示列表中的实例）。这意味着您可以向任何DisplayObject 实例添加侦听器来侦听广播事件。

| 属性名                | 类型                                                                            | 描述                                                                                                                                       | 创建                                    | 清除                                  |
| --------------------- | ------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------- | :------------------------------------ |
| width                 | `string\|number`                                                                | 表示显示对象的宽度，以像素为单位                                                                                                           | 以`'%'`结尾时，会赋值给 `percentWidth`  | 以`'%'` 结尾时，会重置 `percentWidth` |
| height                | `string\|number`                                                                | 表示显示对象的高度，以像素为单位                                                                                                           | 以`'%'`结尾时，会赋值给 `percentHeight` | 以`'%'`结尾时，会重置 `percentHeight` |
| x                     | `string\|number`                                                                | 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 x 坐标                                                                 |                                         |
| y                     | `string\|number`                                                                | 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 y 坐标                                                                 |                                         |
| zIndex                | `string\|number`                                                                | 设置对象的 Z 轴顺序（前后顺序）                                                                                                            |                                         |
| scaleX                | `string\|number`                                                                | 表示从注册点开始应用的对象的水平缩放比例（百分比）                                                                                         |                                         |
| scaleY                | `string\|number`                                                                | 表示从对象注册点开始应用的对象的垂直缩放比例（百分比）                                                                                     |                                         |
| skewX                 | `string\|number`                                                                | 表示DisplayObject的x方向斜切                                                                                                               |                                         |
| skewY                 | `string\|number`                                                                | 表示DisplayObject的y方向斜切                                                                                                               |                                         |
| anchorOffsetX         | `string\|number`                                                                | 表示从对象绝对锚点X                                                                                                                        |                                         |
| anchorOffsetY         | `string\|number`                                                                | 表示从对象绝对锚点Y                                                                                                                        |                                         |
| rotation              | `string\|number`                                                                | 表示 DisplayObject 实例距其原始方向的旋转程度，以度为单位                                                                                  |                                         |
| alpha                 | `string\|number`                                                                | 表示指定对象的 Alpha 透明度值                                                                                                              |                                         |
| tint                  | `string\|number`                                                                | 给当前对象设置填充色                                                                                                                       |                                         |
| visible               | `boolean`                                                                       | 显示对象是否可见                                                                                                                           |                                         |
| touchEnabled          | `boolean`                                                                       | 指定此对象是否接收触摸或其他用户输入                                                                                                       |                                         |
| sortableChildren      | `boolean`                                                                       | 允许对象使用 zIndex 排序                                                                                                                   |                                         |
| cacheAsBitmap         | `boolean`                                                                       | 如果设置为 true，则 Egret 运行时将缓存显示对象的内部位图表示形式                                                                           |                                         |
| blendMode             | `string`                                                                        | BlendMode 枚举中的一个值，用于指定要使用的混合模式，确定如何将一个源（新的）图像绘制到目标（已有）的图像上                                 |                                         |
| matrix                | `egret.Matrix`                                                                  | 一个 Matrix 对象，其中包含更改显示对象的缩放、旋转和平移的值                                                                               |                                         |
| filters               | `(egret.CustomFilter\|egret.Filter)[]`                                          | 包含当前与显示对象关联的每个滤镜对象的索引数组                                                                                             |                                         |
| mask                  | `egret.DisplayObject\|egret.Rectangle\|void`,[Rectangle](/components#rectangle) | 调用显示对象被指定的 mask 对象遮罩                                                                                                         |                                         |
| scrollRect            | [Rectangle](/components#rectangle)                                              | 显示对象的滚动矩形范围                                                                                                                     |                                         |
| onTouchMove           | `(e: egret.TouchEvent)=>void`                                                   | 当用户触碰设备时进行调度，而且会连续调度，直到接触点被删除。                                                                               |                                         |
| onTouchBegin          | `(e: egret.TouchEvent)=>void`                                                   | 当用户第一次触摸启用触摸的设备时（例如，用手指触摸手机屏幕）调度。                                                                         |                                         |
| onTouchEnd            | `(e: egret.TouchEvent)=>void`                                                   | 当用户移除与启用触摸的设备的接触时（例如，将手指从屏幕上抬起）调度。                                                                       |                                         |
| onTouchTap            | `(e: egret.TouchEvent)=>void`                                                   | 当用户在启用触摸设备上的已启动接触的同一 DisplayObject 实例上抬起接触点时（例如，手机点击屏幕后抬起）调度。                                |                                         |
| onTouchReleaseOutside | `(e: egret.TouchEvent)=>void`                                                   | 当用户在启用触摸设备上的已启动接触的不同 DisplayObject 实例上抬起接触点时（例如，按住屏幕上的某个对象,然后从它上面挪开后再松开手指）调度。 |                                         |
| onAdded               | `(e: egret.Event)=>void`                                                        | 将显示对象添加到显示列表中时调度。                                                                                                         |                                         |
| onAddedToStage        | `(e: egret.Event)=>void`                                                        | 在将显示对象直接添加到舞台显示列表或将包含显示对象的子树添加至舞台显示列表中时调度。                                                       |                                         |
| onRemoved             | `(e: egret.Event)=>void`                                                        | 将要从显示列表中删除显示对象时调度。                                                                                                       |                                         |
| onRemovedFromStage    | `(e: egret.Event)=>void`                                                        | 在从显示列表中直接删除显示对象或删除包含显示对象的子树时调度。                                                                             |                                         |
| onEnterFrame          | `(e: egret.Event)=>void`                                                        | [广播事件] 播放头进入新帧时调度。                                                                                                          |                                         |
| onRender              | `(e: egret.Event)=>void`                                                        | [广播事件] 将要更新和呈现显示列表时调度。                                                                                                  |                                         |
> 有 Touch 事件的实例默认会开启 touchEnable

## displayObjectContainer

[egret.DisplayObjectContainer](https://docs.egret.com/engine/docs/api/engine/egret.DisplayObjectContainer)  

> DisplayObjectContainer 类是基本显示列表构造块：一个可包含子项的显示列表节点。
  
父类组件混入：[displayObject](/components/egret#displayobject)
| 属性名           | 类型     | 描述                 | 创建                            | 清除                                                     |
| ---------------- | -------- | :------------------- | :------------------------------ | :------------------------------------------------------- |
| childrenSortMode | `string` | 设置子项目的排序方式 | `setChildrenSortMode(newValue)` | `setChildrenSortMode(egret.ChildrenSortMode['DEFAULT'])` |

## shape

[egret.Shape](https://docs.egret.com/engine/docs/api/engine/egret.Shape)  
  
> 此类用于使用绘图应用程序编程接口 (API) 创建简单形状。Shape 类含有 graphics 属性，通过该属性您可以访问各种矢量绘图方法。  
父类组件混入：[displayObject](/components/egret#displayobject)

| 属性名   | 类型                             | 描述                       | 创建 | 清除 |
| -------- | -------------------------------- | :------------------------- | :--- | :--- |
| graphics | [Graphics](/components#graphics) | 设置一系列 `graphics` 操作 |      |

## sprite

[egret.Sprite](https://docs.egret.com/engine/docs/api/engine/egret.Sprite)  

> Sprite 类是基本显示列表构造块：一个可包含子项的显示列表节点。
  
父类组件混入：[displayObjectContainer](/components/egret#displayobjectContainer)

| 属性名   | 类型                             | 描述                       | 创建 | 清除 |
| -------- | -------------------------------- | :------------------------- | :--- | :--- |
| graphics | [Graphics](/components#graphics) | 设置一系列 `graphics` 操作 |      |

## bitmap

[egret.Bitmap](https://docs.egret.com/engine/docs/api/engine/egret.Bitmap)  

> Bitmap 类表示用于显示位图图片的显示对象。利用 Bitmap() 构造函数，可以创建包含对 BitmapData 对象引用的 Bitmap 对象。创建了 Bitmap 对象后，使用父级 DisplayObjectContainer 实例的 addChild() 或 addChildAt() 方法可以将位图放在显示列表中。一个 Bitmap 对象可在若干 Bitmap 对象之中共享其 texture 引用，与缩放或旋转属性无关。由于能够创建引用相同 texture 对象的多个 Bitmap 对象，因此，多个显示对象可以使用相同的 texture 对象，而不会因为每个显示对象实例使用一个 texture 对象而产生额外内存开销。
  
父类组件混入：[displayObject](/components/egret#displayobject)

| 属性名       | 类型                               | 描述                                   | 创建 | 清除 |
| ------------ | ---------------------------------- | :------------------------------------- | :--- | :--- |
| pixelHitTest | `boolean`                          | 是否开启精确像素碰撞                   |      |
| smoothing    | `boolean`                          | 控制在缩放时是否对位图进行平滑处理     |      |
| fillMode     | `string`                           | 确定位图填充尺寸的方式                 |      |
| texture      | [Texture](/components#texture)     | 矩形区域，它定义素材对象的九个缩放区域 |      |
| scale9Grid   | [Rectangle](/components#rectangle) | 被引用的 Texture 对象                  |      |

## bitmapText

[egret.BitmapText](https://docs.egret.com/engine/docs/api/engine/egret.BitmapText)  

> 位图字体采用了Bitmap+SpriteSheet的方式来渲染文字。
  
父类组件混入：[displayObject](/components/egret#displayobject)

| 属性名        | 类型                     | 描述                                                                | 创建 | 清除 |
| ------------- | ------------------------ | :------------------------------------------------------------------ | :--- | :--- |
| text          | `string`                 | 要显示的文本内容                                                    |      |
| font          | `null\|egret.BitmapFont` | 要使用的字体的名称或用逗号分隔的字体名称列表，类型必须是 BitmapFont |      |
| letterSpacing | `string\|number`         | 一个整数，表示字符之间的距离                                        |      |
| lineSpacing   | `string\|number`         | 一个整数，表示行与行之间的垂直间距量                                |      |
| smoothing     | `boolean`                | 控制在缩放时是否进行平滑处理                                        |      |
| textAlign     | `string`                 | 文本的水平对齐方式                                                  |      |
| verticalAlign | `string`                 | 文字的垂直对齐方式                                                  |      |

## textField

[egret.TextField](https://docs.egret.com/engine/docs/api/engine/egret.TextField)  

> TextField是egret的文本渲染类，采用浏览器/设备的API进行渲染，在不同的浏览器/设备中由于字体渲染方式不一，可能会有渲染差异如果开发者希望所有平台完全无差异，请使用BitmapText。

父类组件混入：[displayObject](/components/egret#displayobject)

| 属性名            | 类型                          | 描述                                               | 创建 | 清除 |
| ----------------- | ----------------------------- | :------------------------------------------------- | :--- | :--- |
| text              | `string`                      | 作为文本字段中当前文本的字符串                     |      |
| background        | `boolean`                     | 指定文本字段是否具有背景填充                       |      |
| bold              | `boolean`                     | 是否显示为粗体                                     |      |
| border            | `boolean`                     | 指定文本字段是否具有边框                           |      |
| italic            | `boolean`                     | 是否显示为斜体                                     |      |
| displayAsPassword | `boolean`                     | 指定文本字段是否是密码文本字段                     |      |
| multiline         | `boolean`                     | 表示字段是否为多行文本字段                         |      |
| wordWrap          | `boolean`                     | 一个布尔值，表示文本字段是否按单词换行             |      |
| backgroundColor   | `string\|number`              | 文本字段背景的颜色                                 |      |
| borderColor       | `string\|number`              | 文本字段边框的颜色                                 |      |
| lineSpacing       | `string\|number`              | 一个整数，表示行与行之间的垂直间距量               |      |
| maxChars          | `string\|number`              | 文本字段中最多可包含的字符数（即用户输入的字符数） |      |
| scrollV           | `string\|number`              | 文本在文本字段中的垂直位置                         |      |
| maxScrollV        | `string\|number`              | scrollV 的最大值                                   |      |
| numLines          | `string\|number`              | 文本行数                                           |      |
| size              | `string\|number`              | 文本的字号大小                                     |      |
| stroke            | `string\|number`              | 表示描边宽度                                       |      |
| strokeColor       | `string\|number`              | 表示文本的描边颜色                                 |      |
| textColor         | `string\|number`              | 文本颜色                                           |      |
| fontFamily        | `string`                      | 要使用的字体的名称或用逗号分隔的字体名称列表       |      |
| inputType         | `string`                      | 弹出键盘的类型                                     |      |
| restrict          | `string`                      | 表示用户可输入到文本字段中的字符集                 |      |
| textAlign         | `string`                      | 文本的水平对齐方式                                 |      |
| verticalAlign     | `string`                      | 文字的垂直对齐方式                                 |      |
| type              | `string`                      | 文本字段的类型                                     |      |
| textFlow          | `egret.ITextElement[]`        | 设置富文本                                         |      |      |
| onChange          | `(e: egret.Event)=>void`      | 输入文本有用户输入时调度。                         |      |
| onFocusIn         | `(e: egret.FocusEvent)=>void` | 聚焦输入文本后调度。                               |      |
| onFocusOut        | `(e: egret.FocusEvent)=>void` | 输入文本失去焦点后调度。                           |      |
