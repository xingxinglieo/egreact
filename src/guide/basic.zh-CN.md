---
title: 基础使用
toc: menu
order: 3
---

## renderer 渲染入口

### Egreact

`Egreact` 是渲染的入口，它是一个 `react-dom` 组件，从这里开始使用 tsx 编写 egret 应用。

``` tsx | pure
import React from 'react'
import { Egreact } from 'egreact'

export default () => (
  <div>
    <Egreact>
        {/* write your egreact host component */}
    </Egreact>
  </div>
)
```

`Egreact` 在挂载后，内部会生成并执行 egreact 渲染器。
> tip：在 Egreact 的子组件处于 egreact 渲染器上下文中，不能使用 react-dom 等其他渲染器的原生组件，同理，egreact 的原生组件也不能在其他渲染器的上下文中使用。

<API hideTitle src="./Props/Egreact.tsx"></API>

egret 配置项和 `egretOptions` 详见[入口文件说明](https://docs.egret.com/engine/docs/projectConfig/indexFile)。  
  
`contextsFrom` 见 [ContextBridge](/guide/basic#contextbridge)

ref 暴露了这些内部生成的对象

``` tsx | pure
interface EgreactRef {
  container: egret.DisplayObjectContainer // 传入或创建的根容器
  root: EgreactRoot // 渲染器根实例，见下方类型定义
  contexts: Context<any>[] // 传入或收集的 contexts
  dom?: HTMLDivElement // 若 renderDom 为真，则为渲染的 dom
}
```

### createEgreactRoot

可以不使用组件 `Egreact`，直接使用 `createEgreactRoot` 渲染

``` tsx | pure
import { createEgreactRoot } from 'egreact'

class ReactRender extends egret.DisplayObjectContainer {
  root = createEgreactRoot(this)
  constructor(reactNode: React.ReactNode) {
    super()
    this.root.render(reactNode)
    // 必须，否则会内存泄漏
    this.addEventListener(egret.Event.REMOVED, () => this.root.unmount(), this)
  }
}

const displayObjectContainer = new egret.displayObjectContainer();
displayObjectContainer.addChild(new ReactRender(<displayObjectContainer></displayObjectContainer>))
```

类型定义如下  

``` tsx | pure
// CreateRootOptions 与 react-dom 的 options 同义
// @link https://beta.reactjs.org/learn/add-react-to-a-website#you-can-reuse-components
export type CreateRootOptions = {
  unstable_strictMode?: boolean
  unstable_concurrentUpdatesByDefault?: boolean
  identifierPrefix?: string
  onRecoverableError?: (error: any) => void
  transitionCallbacks?: TransitionTracingCallbacks
}

class EgreactRoot{
  render(children: React.ReactNode, options: { sync: boolean }) => void // sync 是否同步渲染
  unmount() => void // 需要卸载整个组件树调用
}

function createEgreactRoot(
  containerNode: egret.DisplayObjectContainer,
  options: CreateRootOptions = {},
): EgreactRoot
```

## prop and event 属性和事件

以 `eui-group` 最常用的属性 `layout` 说明在 egreact 中是如何处理 prop 的。

``` tsx | pure
<eui-group layout="horizontal" layout-gap={10} ></eui-group>
```

首先 `layout` 支持的类型为 `'basic' | 'tile' | 'horizontal' | 'vertical' | eui.LayoutBase` 。如果属性所需值为某类实例，而传入的是非对应实例，内部会按照规则创建对应的实例，赋值时会根据 prop name找到对应的 target  

``` tsx | pure
group['layout'] = new eui.HorizontalLayout()
  
group['layout']['gap'] = 10
```

如果改变了 `layout`

``` tsx | pure
<eui-group layout="vertical" layout-gap={10} ></eui-group>
```

会新创建一个 `new eui.VerticalLayout()` 并重新赋值，其子属性也会重新赋值一遍。

### 如何判断 prop 更新？

每次渲染，prop 是否需要更新，需要经由 `diffProp` 算法进行判断。  
若无特殊说明，prop 的 `newValue` 和 `oldValue` 的判断大概逻辑如下：  
  
将类型分类为三种大致类型，基本类型、数组类型、其他引用类型，

- 前后大致类型不一致，需要更新。
- 前后大致类型一致，基本类型和其他引用类型采用全等比较，数组类型会在第一层逐个比较。

所以，如果直接传入对象，应该保持其引用而不是在 tsx 中直接 `new`，而数组可以直接字面量声明。

``` tsx | pure
// ❌
<bitmap scale9Grid={new egret.Rectangle(0,0,0,0)}></bitmap>

// ✅
const rectangle = new egret.Rectangle(0,0,0,0)
<bitmap scale9Grid={rectangle}></bitmap>

// ✅
<bitmap scale9Grid={[0,0,0,0]}></bitmap>
```

### attach 改变加入父实例的方式

`attach` 是用于声明以赋值的方式加入父组件的 prop，每个 egreact 组件都支持这个 prop，声明了 `attach` 的组件被称为 attach component。以 `eui-scroll` 为例：

``` tsx | pure
<eui-scroller>
    <eui-group attach="viewport"></eui-group>
</eui-scroller>
```

`eui-scroller` 的视口必须通过 `viewport` 属性赋值声明，通过 attach component 就可以改变加入的方式为赋值：`scroller['viewport'] = group`；  
  
与 prop name 类似，attach component 也支持连字符访问到父组件更深的对象。  

``` tsx | pure
// scroller['a']['b']['c'] = group
<eui-scroller>
    <eui-group attach="a-b-c"></eui-group>
</eui-scroller>
```

`attach` 有以下限制：

- `attach` 不能剔除或增加，因为组件在创建时就决定了加入父组件的方式

``` tsx | pure
const Test = () => {
  const [props, setProps] = useState<any>({ attach: 'a' })
  useEffect(() => {
    // ❌ 剔除了 attach 属性，将会报错
    setProps({})
  }, [])
  return (
    <eui-scroller>
      <eui-group {...props}></eui-group>
    </eui-scroller>
  )
}
```

- 所有 attach component 都应该写在父组件内最前面

``` tsx | pure
// ❌ 一旦 `show` 由 `false` 到 `true` 就会报错
<eui-scroller>
    {show ? <displayObject></displayObject> : null}
    <eui-group attach="viewport"></eui-group>
</eui-scroller>

// ✅
<eui-scroller>
    <eui-group attach="viewport"></eui-group>
    {show ? <displayObject></displayObject> : null}
</eui-scroller>
```

在 react fiber 中，attach component 仍然被认为是传统的子组件，一旦有子组件插入在其之前，就需要获取它在父实例中的位置，但因为它并不在父实例的列表中，就会报错。  
  
除此之外，即使没有子组件插入，也应该遵循此规则：attach component 在前面统一明确地声明，避免渲染结果“看似”与组件编排不一致的情况。

### args 构造函数参数

`args` 是用于传递构造函数参数的 prop，内部创建 egret 实例的 egreact 组件都支持这个 prop，仅在执行构造函数时作用一次，后续也不会影响更新。

``` tsx | pure
// 在组件中
const texture = new egret.Texture();
<bitmap args={[texture]} />

// 只有一个参数时可以省去外层数组
<bitmap args={texture} />

// 在创建实例时
new Bitmap(...args);
```

### mountedApplyProps 挂载后应用属性

`mountedApplyProps` 是用于声明是否在挂载后才更新属性的 prop，仅在挂载时作用一次。

``` tsx | pure
// 设置前
<displayObjectContainer>
  <displayObject x={100} />
</displayObjectContainer>

const child = new egret.DisplayObject()
child['x'] = 100;
parent.addChild(child)

// 设置后
<displayObjectContainer>
  <displayObject x={100} mountedApplyProps/>
</displayObjectContainer>

const child = new egret.DisplayObject()
parent.addChild(child)
child['x'] = 100;
```

### event

以 `on` 开头的 prop 会被识别是事件，如 `onTouchTap`  

``` tsx
/**
 * iframe: 100
 * defaultShowCode: true
 */
import React, { useState } from 'react'
import { Egreact } from 'egreact'
export default () => {
  const [x, setX] = useState(0)
  return (
    <Egreact>
      <sprite
        onTouchTap={(e) => setX(e.stageX)}
        graphics={[
          ['beginFill', 0x000000],
          ['drawRect', 0, 0, 300, 100],
          ['endFill'],
        ]}>
        <textField size={16}>{'stageX:' + x}</textField>
      </sprite>
    </Egreact>
  )
}
```

支持 Once、Capture、优先级三种修饰后缀，同时使用时，需要按照 `Once -> Capture -> 优先级` 的顺序书写。

``` tsx | pure
// 声明优先级为 1
onTouchTap1
// 声明 Once
onTouchTapOnce
// 声明 Capture
onTouchTapCapture
// 三个同时使用需要符合顺序
onTouchTapOnceCapture12
// 不符合预期，事件将被识别为 TouchTapCapture
onTouchTapCaptureOnce12
```

因为事件往往采用字面量形式声明并传入函数，为避免频繁地移除和添加事件，内部采用引用的方式对监听函数进行更新，实际监听的函数并非传入的函数。

## 改造 exml

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

如果项数较多，为了复用 eui 的虚拟列表能力，egreact 导出了一个组件 `ItemRendererClass` 适配 `eui.DataGroup`

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
  // 渲染器渲染时是否更新 children，仅在 useRenderer 为 true 有效
  updateChildren?: boolean | ReadonlyArray<unknown>
}
```

在 useRenderer 模式下，eui-itemRenderer 并不会跟随父组件一起 re-render，这在大部分情况下可以视作性能优化，但是如果使用了父组件的 state，它们将不会跟随 state 刷新。

```tsx | pure
import { ItemRendererClass } from 'egreact'
import { useState, useEffect } from 'react'
function Test(){
  const [width, setWidth] = useState(200);
  useEffect(()=>{
    setWidth(400)
  },[])
  return
  <eui-dataGroup dataProvider={data}>
	  <ItemRendererClass>
		  {(data, itemRendererInstance) => 
        <eui-itemRenderer width="100%">
          {/* 当 width 更新时，并不会更新 */}
          <eui-image source={data.url} key={data.url} width={width} />
        </eui-itemRenderer>}
	  </ItemRendererClass>
  </eui-dataGroup>
}
```

这个问题有两种解决方式，一种方式是关闭 useRenderer 模式，第二种是设置 updateChildren，它的参数为布尔值或者依赖数组
```tsx | pure
	  <ItemRendererClass updateChildren>
      {/* 使用 useCallback 指定更新 */}
		  {
        useCallback(
        (data, itemRendererInstance) => 
        <eui-itemRenderer width="100%">
          {/* 当 width 更新时，并不会更新 */}
          <eui-image source={data.url} key={data.url} width={width} />
        </eui-itemRenderer>,
        [width])
        }
	  </ItemRendererClass>
```

```tsx | pure
    {/* 或者传入依赖数组 */}
	  <ItemRendererClass updateChildren={[width]}>
		  {
        (data, itemRendererInstance) => 
        <eui-itemRenderer width="100%">
          {/* 当 width 更新时，并不会更新 */}
          <eui-image source={data.url} key={data.url} width={width} />
        </eui-itemRenderer>
      }
	  </ItemRendererClass>
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
### vscode 插件 exml2egreact

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



## ContextBridge 桥接 Context

`ContextBridge` 是用于桥接上文渲染器的 `contexts` 的组件，在 `Egreact` 中内置，通过 `contextsFrom` 控制是否开启或者 `contexts` 的来源。以 `redux` 为例说明为什么需要这个机制。

``` tsx
/**
 * iframe: 150
 * defaultShowCode: true
 */
import React from 'react'
import Test from './components/Test.tsx'
import { Egreact } from 'egreact'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { RootState, store } from './store'
import { increment } from './store/counterSlice'
import ErrorBoundary from './components/ErrorBoundary.tsx' 


const App = () => {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()
  return (
    <div>
      <h2 onClick={() => dispatch(increment())}>
        i have been click {count} times!
      </h2>
      <ErrorBoundary>
        <Egreact contextsFrom={false}>
          <Test />
        </Egreact>
      </ErrorBoundary>
    </div>
  )
}
export default () =>(<Provider store={store}><App/></Provider>)
```

在这个案例中，`contextsFrom` 设置为 `false`，即不做处理。在 `Egreact` 父组件中，使用了 `redux` 的 `Provider` 组件，它的内部使用了 `context` 。  
在 `Egreact`内部创建了一个新的渲染器，它与父组件的渲染器并没有任何关联，若不做处理，是没有 `redux` 的 `context`，所以会报错。如果删去 `contextsFrom={false}` 会怎么样呢？

``` tsx
/**
 * iframe: 200
 */
import React from 'react'
import Test from './components/Test.tsx'
import { Egreact } from 'egreact'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { RootState, store } from './store'
import { increment } from './store/counterSlice'
import ErrorBoundary from './components/ErrorBoundary.tsx' 


const App = () => {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()
  return (
    <div>
      <h2 onClick={() => dispatch(increment())}>
        i have been click {count} times!
      </h2>
      <ErrorBoundary>
        <Egreact>
          <Test />
        </Egreact>
      </ErrorBoundary>
    </div>
  )
}
export default () =>(<Provider store={store}><App/></Provider>)
```

它成功运行了，而且点击时组件的状态会同步，这正是 `ContextBridge` 所发挥的作用！在 `Egreact` 内部，会通过 dom 节点获取 `fiber` 节点并回溯到根结点，收集路径上的 `contexts`,再通过 `ContextBridge` 桥接到 `egreact` 渲染器中。你也可以传递 `contexts` 数组直接指定 `contexts` 的来源。

如果想在多渲染器共享 Context，此功能已经抽出一个 npm 包 [react-context-bridge](https://www.npmjs.com/package/react-context-bridge)

## React DevTools 开发者工具

得益于 React DevTools 对自定义渲染器的支持，只需要调用一个简单的 api 就能在 Devtools 中展示 egreact 的组件树。然而，Devtools 并未支持对自定义渲染器 picker 的适配接口，egreact 通过拦截监听器等操作完美适配了 picker。

<img src="https://xingxinglieo.github.io/egreact/devtools.png" width="666" />

<!-- ## Pool 对象池 <Badge type="warning">不稳定</Badge>

> 不稳定，在大量元素频繁切换时会布局错乱，目前已经默认关闭。

@1.3.0 新增，原生组件被移除时，被回收至池中，当创建同类时直接从池中取出。

[池的默认大小]()，可以通过 setInfo 设置大小
``` typescript
import { Pool } from 'egreact'
// 全局开启
Pool.enable = true;
// 设置每个类默认的最大容量
Pool.defaultSize = 500;
// 设置单独的最大容量
Pool.setInfo({
  constructor: egret.DisplayObject,
  size: 1000
})
```

egreact 对回收的对象会自动清除显式赋值的副作用，但挂载后未知的副作用需要手动去除。若未清除副作用对复用产生影响，可以使用 `noUsePool` 属性声明不参与对象池。

``` tsx | pure
// 直接使用构造函数创建且不会被回收
<eui-group noUsePool></eui-group>
``` -->