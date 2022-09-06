---
title: 进阶使用
toc: menu
order: 4
---

## 自定义原生组件

egreact 中定义了一套简单的接口描述一个原生组件，所有原生组件皆由此实现，并且开放了这个接口。如果你想拓展原生组件，你可以通过以下三步完成：

1. 定义组件描述对象
2. 拓展 JSX 类型
3. 用 `extend` 函数传入第一步定义的对象

### 组件描述对象

此对象接口如下

``` typescript
type EventInfo = {
  once: boolean // 是否是 once
  capture: boolean // 是否是 capture
  priority: number // 优先级，默认 0
}
type PropResetter = void | ((removed: boolean) => void) // removed 代表是否是移除属性
type PropSetter<P, I = Instance, T = P> = (args: {
  newValue: P // 新值
  oldValue: P | typeof CONSTANTS.PROP_MOUNT // 旧值，CONSTANTS.PROP_MOUNT 代表属性挂载
  instance: I // 创建的实例
  target: T // 实际用于增删操作的实例，比如 layout-gap 就是 instance["layout"]
  targetKey: string // 实际用于增删操作的实例的key，比如 layout-gap 就是 "gap"
  keys: string[] // 被切割的key
  eInfo?: EventInfo // 在符合事件格式的 prop 将被传入
}) => PropResetter
export type DiffHandler<T> = (newValue: T, oldValue: T) => boolean

interface IPropHandler{
    __Class: new (...args: any) => any, // 创建实例时对应的类
    [key in string]: PropResetter, // 属性更新时执行的函数
    [key in `__diff_${string}`]: DiffHandler // 属性对比时执行的函数
}
```

以 `shape` 组件定义为例，

``` typescript
import { Setters } from 'egreact'
const shape = {
  ...Setters.egret.displayObject,
  __Class: egret.Shape,
  graphics: ({
    newValue,
    instance,
  }:{ newValue: ['string',...any[]] | Function,instance: { graphics: egret.Graphics }}) => {
    if (is.arr(newValue)) {
      for (const action of newValue) {
        instance.graphics[action[0]](...action.slice(1))
      }
      return () => instance.graphics.clear()
    } else if (is.fun(newValue)) {
      return newValue(instance.graphics, instance)
    }
  },
  __diff_graphics: (np: any, op: any) => {
    if (is.arr(np) && is.arr(op)) {
      np = np.flat(1)
      op = op.flat(1)
      if (np.length !== op.length) return false
      for (let i = 0; i < np.length; i++) {
        if (np[i] !== op[i]) return false
      }
      return true
    } else return np === op
  }
}
```

- `...Setters.egret.displayObject` 用于继承其他组件描述对象，对应 egret 的继承关系，如果你需要继承 egreact 的原生组件，也可以采用这种方式。  
  > 为什么不采用类继承？因为类继承`复用和类型`的灵活性太差。  

- `__Class: egret.Shape` 声明创建实例的类
- `graphics`，自定义 `graphics` 的 Setter，里面的操作应该是对应的更新操作，在每次更新时都会执行这个函数，。Setter 的返回值是 Resetter，用于清除这一次更新的副作用，在下一次更新前执行，它会被传入一个参数，代表是否是移除属性。如果你用过 `useEffect`，应该对这种模式很熟悉。
- `__diff_graphics`，自定义 `graphics` 的 diffProp，在每次 react 渲染所在组件时都会执行，传入 `newValue` 和 `oldVale`，**返回 `false` 时代表 prop 需要更新（才会执行 Setter）**。

### 拓展 JSX

``` typescript
declare global {
  namespace JSX {
    shape: {
      // width,height,...
      graphics: ['string',...any[]] | Function
      // ...
    }
  }
}
```

如果将 `shape` 类型像上面一样一个一个编写，也是件麻烦事，因为除了 `shape` 自己新增的属性外，还有 `displayObject` 的属性需要加上去。好在 egreact 提供了一个工具类型 `TransProp`，它会将你的 Setter 的 `newValue` 类型作为 prop 的类型。

``` typescript
import { TransProp } from 'egreact'
import shape from 'shape.ts'
declare global {
  namespace JSX {
    shape: TransProp<typeof shape>
  }
}
```

### 使用 extend

使用 `extend` 告诉 egreact 你定义了这个组件

``` typescript
extend({ shape })
```

至此一个自定义原生组件就可以使用了。

### 事件

事件与 prop 没什么区别，只需要 `on` 开头即可，Setter 的参数会多一个 `eInfo`

``` typescript
const onClick: PropSetter<(e: egret.TouchEvent) => void> = ({ newValue, instance, eInfo }) => {
  instance.addEventListener(egret.TouchEvent.TOUCH_TAP, newValue, instance)
  instance.touchEnabled = true
  return () => instance.removeEventListener(egret.TouchEvent.TOUCH_TAP, newValue, instance)
}
const handler = {
  // ...
    onClick,
  // ...
}
```
