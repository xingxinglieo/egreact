import { getActualInstance, is } from '../utils'
import { CONSTANTS } from '../constants'
import { DiffHandler, PropSetter, EventSet, PropSetterParameters } from '../type'

export interface PropsHandlers {
  [e: `${typeof CONSTANTS.CUSTOM_DIFF_PREFIX}${string}`]: (newProp: any, oldProp: any) => boolean
}

export interface IProp {
  __setter: PropSetter<any>
  __Class?: new (...args: any[]) => any
}

export const isMountProp = (value: any): value is typeof CONSTANTS.PROP_MOUNT => value === CONSTANTS.PROP_MOUNT

export module EventProp {
  export type GetEventKeyWithoutNum<T extends string> = `${T}${'Once' | ''}${'Capture' | ''}`
  // export type
  export const eventSetterWithType = <T extends egret.Event>() => {
    const eventHandler: EventSet<(event: T) => any> = (props) => {
      type InnerListener = Function
      type OuterListener = Function
      const { newValue, targetKey, eInfo } = props
      const instance = props.instance as typeof props.instance & {
        // 内部的监听器集合 addListener 实际传入的监听器
        memorizedListeners: { [k in string]: [InnerListener, OuterListener] }
      }
      const memorizedListeners = instance.memorizedListeners || (instance.memorizedListeners = {})
      const actualInstance = getActualInstance(instance) as egret.DisplayObject
      const { type, once, capture, priority, keys } = eInfo
      const isMountEvent = !(targetKey in memorizedListeners)
      const canDefaultTouchEnabled =
        keys.includes('Touch') &&
        !('touchEnabled' in instance[CONSTANTS.INFO_KEY].memoizedProps) &&
        'touchEnabled' in actualInstance

      if (isMountEvent) {
        if (canDefaultTouchEnabled) {
          // 有 touch 事件默认开启 touchEnabled
          actualInstance.touchEnabled = true
        }

        // 通过引用来改变调用，无需多次调用 addListener 和 removeListener
        const innerListener = function (...args: any[]) {
          // 最新的属性值
          memorizedListeners[targetKey][1].apply(this, args)
        }
        memorizedListeners[targetKey] = [innerListener, newValue]

        actualInstance[once ? 'once' : 'addEventListener'](type, innerListener, actualInstance, capture, priority)
      } else {
        memorizedListeners[targetKey][1] = newValue
      }

      return (isRemove) => {
        if (isRemove) {
          if (canDefaultTouchEnabled) {
            actualInstance.touchEnabled = false
          }

          const innerListener = memorizedListeners[targetKey][0]
          actualInstance.removeEventListener(type, innerListener, instance, capture)
          delete memorizedListeners[targetKey]
        }
      }
    }
    return eventHandler
  }
  export const eventSetter = eventSetterWithType()
  export const touchEventSetter = eventSetterWithType<egret.TouchEvent>()
  export const uiEventSetter = eventSetterWithType<eui.UIEvent>()
  export const focusEventSetter = eventSetterWithType<egret.FocusEvent>()

  export const uiEventSetters = {
    onUiResize: EventProp.uiEventSetter,
    onUiResizeOnce: EventProp.uiEventSetter,
    onUiMove: EventProp.uiEventSetter,
    onUiMoveOnce: EventProp.uiEventSetter,
    onUiCreationComplete: EventProp.uiEventSetter,
    onUiCreationCompleteOnce: EventProp.uiEventSetter,
  }
}

export module NormalProp {
  export const boo: PropSetter<boolean | `${boolean}`> = ({ newValue, target, targetKey }) => (
    (target[targetKey] = newValue === 'false' ? false : Boolean(newValue)), void 0
  )

  export const num: PropSetter<string | number> = ({ newValue, target, targetKey }) => (
    (target[targetKey] = Number(newValue)), void 0
  )

  export const str: PropSetter<string | number> = ({ newValue, target, targetKey }) => (
    (target[targetKey] = String(newValue)), void 0
  )

  export const pass = <T = any>({ newValue, target, targetKey }: PropSetterParameters<T>) => (
    /* ts 4.7 不调用可以传入范型 */
    (target[targetKey] = newValue), void 0
  )

  // 解决无法传范型的问题
  export const passWithType =
    <T>(test: ((newProp: any) => boolean)[] = [], propName?: any) =>
    (args: PropSetterParameters<T>) => {
      if (!(test.length === 0 || test.some((test) => test(args.newValue)))) {
        console.error(`${propName ? 'value of' : ''} \`${propName || args.newValue}\` is not correct`)
      }
      return pass<T>(args)
    }

  export const instance =
    <P>(constructor: new (...args: any) => any) =>
    ({ newValue, target, targetKey, keys }: PropSetterParameters<P>) => {
      if (newValue instanceof constructor) {
        target[targetKey] = newValue
      } else {
        target[targetKey] = new constructor(...(is.arr(newValue) ? newValue : [newValue]))
      }
    }

  // 数组逐一对比
  export const flatArrDiffWithLevel = (level = Infinity) => {
    const flatArr = (np: any, op: any) => {
      if (is.arr(np) && is.arr(op)) {
        np = np.flat(level)
        op = op.flat(level)
        if (np.length !== op.length) return false
        for (let i = 0; i < np.length; i++) {
          if (np[i] !== op[i]) return false
        }
        return true
      } else return np === op
    }
    return flatArr
  }
}

export module Graphics {
  export type FunProp = (
    graphics: egret.Graphics,
    instance: { graphics: egret.Graphics },
  ) => void | ((isRemove: boolean) => void)

  export type GetGraphicsProp<K extends keyof egret.Graphics> = egret.Graphics[K] extends (...args: any) => any
    ? [K, ...Parameters<egret.Graphics[K]>]
    : never

  // 利用分布条件类型
  export type GenerateGraphicsProp<T extends keyof egret.Graphics> = T extends any ? GetGraphicsProp<T> : never

  export type GraphicActions =
    | 'beginFill'
    | 'endFill'
    | 'clear'
    | 'lineStyle'
    | 'drawRect'
    | 'drawRoundRect'
    | 'drawCircle'
    | 'drawEllipse'
    | 'moveTo'
    | 'lineTo'
    | 'curveTo'
    | 'cubicCurveTo'
    | 'drawArc'

  export type Prop = GenerateGraphicsProp<GraphicActions>[] | FunProp

  export const setter: PropSetter<Prop, { graphics: egret.Graphics }> = ({ newValue, instance }) => {
    if (is.arr(newValue)) {
      for (const action of newValue) {
        // @ts-ignore
        instance.graphics[action[0]](...action.slice(1))
      }
      return () => instance.graphics.clear()
    } else if (is.fun(newValue)) {
      return newValue(instance.graphics, instance)
    }
  }

  // graphics 铺平一层来比较
  export const diff = NormalProp.flatArrDiffWithLevel(1)
}

export const graphicsProp = {
  __Class: Object,
  __setter: Graphics.setter,
  __diff: Graphics.diff,
}

export module Point {
  export type Prop = [] | number[] | egret.Point
  export const setter: PropSetter<Prop> = NormalProp.instance(egret.Point)
  export const diff: DiffHandler<Prop> = NormalProp.flatArrDiffWithLevel()
}

export const pointProp = {
  __Class: egret.Point,
  __setter: Point.setter,
  __diff: Point.diff,
  x: NormalProp.num,
  y: NormalProp.num,
}

export module Rectangle {
  export type Prop = [] | number[] | egret.Rectangle
  export const setter: PropSetter<Prop> = NormalProp.instance(egret.Rectangle)
  export const diff: DiffHandler<Prop> = NormalProp.flatArrDiffWithLevel()
}

export const rectangleProp = {
  __Class: egret.Rectangle,
  __setter: Rectangle.setter,
  __diff: Rectangle.diff,
  height: NormalProp.num,
  width: NormalProp.num,
  left: NormalProp.num,
  right: NormalProp.num,
  top: NormalProp.num,
  bottom: NormalProp.num,
  x: NormalProp.num,
  y: NormalProp.num,
  bottomRight: pointProp,
  topLeft: pointProp,
}

export module Texture {
  export type Prop = [] | egret.Texture
  export const setter: PropSetter<Prop> = NormalProp.instance(egret.Texture)
  export const diff: DiffHandler<Prop> = NormalProp.flatArrDiffWithLevel()
}

export const textureProp = {
  __Class: egret.Texture,
  __setter: Texture.setter,
  __diff: Texture.diff,
  bitmapData: NormalProp.pass<egret.Bitmap | void>,
  // WithType
  // <egret.Bitmap>(),
  disposeBitmapData: NormalProp.boo,
  ktxData: NormalProp.pass<ArrayBuffer | void>,
}

export module LayoutBase {
  export type Prop = 'basic' | 'tile' | 'horizontal' | 'vertical' | eui.LayoutBase
}

export const layoutBaseHandlers = {
  __Class: eui.LayoutBase,
  __setter: ({ newValue, target, targetKey }: PropSetterParameters<LayoutBase.Prop>) => {
    let value: eui.LayoutBase
    if (newValue === 'basic') {
      value = new eui.BasicLayout()
    } else if (newValue === 'tile') {
      value = new eui.TileLayout()
    } else if (newValue === 'horizontal') {
      value = new eui.HorizontalLayout()
    } else if (newValue === 'vertical') {
      value = new eui.VerticalLayout()
    } else if (newValue instanceof eui.LayoutBase) {
      value = newValue
    } else {
      throw `prop which type is LayoutBase must be "basic" | "tile" | "horizontal" | "vertical" | eui.LayoutBase`
    }
    target[targetKey] = value
  },

  // 共有的属性
  horizontalAlign: NormalProp.str,
  verticalAlign: NormalProp.str,
  paddingBottom: NormalProp.num,
  paddingLeft: NormalProp.num,
  paddingRight: NormalProp.num,
  paddingTop: NormalProp.num,

  // Tile 的独有属性
  columnAlign: NormalProp.str,
  columnCount: NormalProp.num,
  columnWidth: NormalProp.num,
  horizontalGap: NormalProp.num,
  orientation: NormalProp.str,
  requestedColumnCount: NormalProp.num,
  requestedRowCount: NormalProp.num,
  rowAlign: NormalProp.str,
  rowCount: NormalProp.num,
  rowHeight: NormalProp.num,
  verticalGap: NormalProp.num,

  // Linear 独有属性
  gap: NormalProp.num,

  // 根据组件来支持的属性
  useVirtualLayout: NormalProp.boo,
}

export const euiBaseLayoutProp = {
  bottom: NormalProp.num,
  left: NormalProp.num,
  right: NormalProp.num,
  top: NormalProp.num,
  explicitHeight: NormalProp.num,
  explicitWidth: NormalProp.num,
  horizontalCenter: NormalProp.str,
  verticalCenter: NormalProp.str,
  includeInLayout: NormalProp.boo,
  maxHeight: NormalProp.num,
  maxWidth: NormalProp.num,
  minHeight: NormalProp.num,
  minWidth: NormalProp.num,
  percentHeight: NormalProp.num,
  percentWidth: NormalProp.num,
  ...EventProp.uiEventSetters,
}
