export namespace CONSTANTS {
  /* 第一次挂载标识*/
  export const PROP_MOUNT = '__PROP_MOUNT' as const

  /* 默认属性前缀标识 */
  export const DEFAULT = '__default' as const

  export const DEFAULT_REMOVE = `${DEFAULT}_remove` as const
  /* 自定义diff函数名前缀标识 */
  export const CUSTOM_DIFF_PREFIX = '__diff_' as const

  export const INFO_KEY = '__renderInfo' as const
}

type ExtensionObj = { [key: string]: any }

export type EventInfo = {
  type: string
  name: string
  once: boolean
  capture: boolean
  priority: number
  keys: string[]
}
export type PropResetter = void | ((removed: boolean) => void)
export type PropSetter<P, I = Instance, T = P> = (args: {
  newValue: P
  oldValue: P | typeof CONSTANTS.PROP_MOUNT
  instance: I
  target: T // 实际用于增删操作的实例
  targetKey: string // 实际用于增删操作的实例的key
  keys: string[] // 被切割的key
  [key: string]: any
}) => PropResetter

export type EventSet<P, I = Instance, T = P> = (args: {
  newValue: P
  oldValue: P | typeof CONSTANTS.PROP_MOUNT
  instance: I
  target: T // 实际用于增删操作的实例
  targetKey: string // 实际用于增删操作的实例的key
  keys: string[] // 被切割的key
  eInfo: EventInfo
  [key: string]: any
}) => PropResetter

export type PropSetterParameters<P, I = Instance, T = P> = Parameters<PropSetter<P, I, T>>[0]

export type DiffHandler<T> = (np: T, op: T) => boolean

/**
 * @export
 * @description propsHandler 用于描述一个 host 组件的属性类型及属性处理，
 * 通常包含一个 __Class 属性和多个与 __Class 创建实例属性同名用于处理属性的方法
 * @member __Class 用于创建实际载体的类，如 egret.Sprite
 * @menber args 仅用于描述类传入类的参数
 */
export type IPropsHandlers = {
  [key: `${typeof CONSTANTS.CUSTOM_DIFF_PREFIX}${string}`]: DiffHandler<unknown>
} & {
  __Class: new (...args: any[]) => any
  args?: (...args: any[]) => any
}

/**
 * @export
 * @interface
 * @description 其方法名源于 egret.DisplayObjectContainer，
 * 是用于描述 container 的接口，实现以下必须方法即可作为 Container，如 ArrayContainer
 * @param childInstance __Class 创建的实例
 * @param child  实际用于增删操作的实例，通常与 instance 相同，
 * 但有时会是 instance 上的__target 属性
 * @method attach 用于自定义如何处理 attach
 */
export interface IContainer {
  addChild: (child: any, childInstance?: any) => void
  removeChild: (child: any, childInstance?: any) => void
  addChildAt: (child: any, index: number, childInstance?: any) => void
  getChildIndex: (child: any) => number
  attach?: () => void
}

import { Fiber } from 'react-reconciler'
/**
 * @export
 * @interface
 * @description renderInfo 用于实例在渲染器生命周期中记录与渲染器相关的信息
 * @member
 * @member type host 类型
 * @member root 根实例，一般是 egret.lifecycle.stage
 * @member fiber react 的 fiberNode
 * @member instance 被挂载的实例
 * @member primitive 是否是 primitive 组件
 * @member container 是否是根组件的实例
 * @member parent 父实例
 * @member attach 如果存在 attach 属性，将不会走 IContainer 的挂载方法，
 * 比如 attach="a.b.c" 将会直接赋值 a.b.c = child
 * @member targetInfo [target,tarkey,defaultValue]
 * 记录 attach 所需的信息，比如 attach="a.b.c"，targetInfo 为[a.b, "c", a.b.c]
 * defaultValue 是取未赋值时的属性值，用于属性移除或实例移除的属性重置
 * @member propsHandlers 此实例对应的 IPropsHandlers
 * @member mountedApplyProps = false 存储 mountedApplyProps 属性，
 * 如果为真，将在加入父级后再应用 props
 * @member memoizedDefault 保存赋值属性的初始值，用于属性移除或实例移除的属性重置
 * @member memoizedProps 保存上一次更新时 props，将用于下一次更新的对比
 * @member memoizedResetter 保存清除副作用的方法，用于属性移除或实例移除的属性重置，
 * 如果某个属性 reset 方法存在，将替代 memoizedDefault 直接清除转而执行 reset 方法
 */
export interface IRenderInfo {
  type: string
  root: Instance<egret.DisplayObjectContainer>
  fiber: Fiber
  instance: Instance
  primitive: boolean
  container: boolean
  parent?: Instance<IContainer>
  attach?: string
  targetInfo?: [any, string, any]
  propsHandlers: IPropsHandlers
  mountedApplyProps?: boolean
  memoizedDefault: { [key: string]: any }
  memoizedProps: { [key: string]: any }
  memoizedResetter: {
    [key: string]: (removed: boolean) => void
  }
}

export type Instance<I = ExtensionObj> = I & {
  [CONSTANTS.INFO_KEY]: IRenderInfo
  __target?: any // 实际用于增删操作的实例
}

/**
 * @export
 * @interface
 * @description 描述 host 组件可传入的属性
 */
export type IElementProps = {
  [x: string]: unknown
  args?: any[]
  attach?: string
  mountedApplyProps?: boolean
}
