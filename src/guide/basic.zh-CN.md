---
title: 基础使用
toc: menu
order: 3
---

## 入口

### Egreact
`Egreact` 是渲染的入口，从这里开始使用 tsx 编写 egret 应用。
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
egret 配置项和 `options` 详见[入口文件说明](https://docs.egret.com/engine/docs/projectConfig/indexFile)。  
  
`contextsFrom` 见 [ContextBridge](/guide/basic#contextbridge)

### createRenderer
可以不使用组件 `Egreact` ,直接使用 `renderer` 渲染

``` tsx | pure
import { createRenderer } from 'egreact'

// rootContainer 要加入显示列表
const rootContainer = new egret.DisplayObjectContainer()

// 第一次调用参数是根容器，第二次调用参数是渲染的组件
createRenderer(rootContainer)(<displayObjectContainer></displayObjectContainer>)
```

## props

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

### diffProp
每次渲染，prop 是否需要更新，需要经由 `diffProp` 算法进行比较。  
若无特殊说明，prop 的 `newValue` 和 `oldValue` 的 `diffProp` 大概逻辑如下：  
  
将类型分类为三种大致类型，基本类型、数组类型、其他引用类型，
- 前后大致类型不一致，需要更新。
- 前后大致类型一致，基本类型和其他引用类型采用全等比较，数组类型会在第一层逐个比较。

所以，如果直接传入对象，应该保持其引用而不是在 tsx 中直接 `new`，而数组可以直接字面量声明。
``` tsx | pure
// ❌
<bitmap scale9Grid={new Rectangle()}></bitmap>

// ✅
<bitmap scale9Grid={[0,0,0,0]}></bitmap>
```
### attach
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

### args
`args` 是用于传递构造函数参数的 prop，每个 egreact 组件都支持这个 prop，仅在执行构造函数时作用一次，后续也不会影响更新。
``` tsx | pure
// 在组件中
const texture = new egret.Texture();
<bitmap args={[texture]} />

// 只有一个参数时可以省去外层数组
<bitmap args={texture} />

// 在创建实例时
new Bitmap(...args);
```
### mountedApplyProps
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



## events

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
## ContextBridge

`ContextBridge` 是用于继承上文渲染器的 `contetxs` 的组件，在 `Egreact` 中内置，通过 `contextsFrom` 控制是否开启或者 `contetxs` 的来源。以 `redux` 为例说明为什么需要这个机制。
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

