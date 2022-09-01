import { PropSetterParameters } from './../../type'
import { EventProp, NormalProp, rectangleProp } from '../common'
import { mixinHelper } from '../utils'

const normalEventType = [
  'onChange',
  'onChanging',
  'onComplete',
  'onAdded',
  'onAddedToStage',
  'onRemoved',
  'onRemovedFromStage',
  'onEnterFrame',
  'onRender',
  'onAddedOnce',
  'onAddedToStageOnce',
  'onRemovedOnce',
  'onRemovedFromStageOnce',
  'onEnterFrameOnce',
  'onRenderOnce',
] as const

type NormalEventType = typeof normalEventType[number]

const touchEventType = ['onTouchMove', 'onTouchBegin', 'onTouchEnd', 'onTouchTap', 'onTouchReleaseOutside'] as const

type TouchEventType = typeof touchEventType[number]

type EventSetter = typeof EventProp.eventSetter
type TouchEventSetter = typeof EventProp.touchEventSetter

const normalEventTypeSets = normalEventType.reduce(
  (acc, key) => ((acc[key] = EventProp.eventSetter), acc),
  {} as {
    [key in NormalEventType]: EventSetter
  },
)

const touchEventTypeSets = touchEventType.reduce(
  (acc, key) => ((acc[key] = EventProp.touchEventSetter), acc),
  {} as {
    [key in TouchEventType]: TouchEventSetter
  },
)

// extends PropsSets
// type TypeWithPriority = EventProp.GetEventKey<TouchEventType>
type TypeWithoutPriority = EventProp.GetEventKeyWithoutNum<TouchEventType>

// type c = TouchEventTypeSetsWithPriority["onTouchEnd2"]
type TouchEventTypeSets = {
  // [key in TypeWithoutPriority | TypeWithPriority]: TouchEventSetter
  [key in TypeWithoutPriority]: TouchEventSetter
}
const displayObjectPropsHandlers = mixinHelper
  .set({
    ...touchEventTypeSets,
    ...normalEventTypeSets,
    ...({} as TouchEventTypeSets),
    __Class: egret.DisplayObject,
    width: ({ newValue, instance }: PropSetterParameters<number | string, eui.UIComponent>) => {
      const isPercent = typeof newValue === 'string' && newValue[newValue.length - 1] === '%'
      if (isPercent) {
        const percent = [...newValue]
        percent.pop()
        instance.percentWidth = Number(percent.join(''))
      } else {
        instance.width = Number(newValue)
      }
      return () => {
        // @ts-ignore 实际初始值是 null
        if (isPercent) instance.percentWidth = null
      }
    },
    height: ({ newValue, instance }: PropSetterParameters<number | string, eui.UIComponent>) => {
      const isPercent = typeof newValue === 'string' && newValue[newValue.length - 1] === '%'
      if (isPercent) {
        const percent = [...newValue]
        percent.pop()
        instance.percentHeight = Number(percent.join(''))
      } else {
        instance.height = Number(newValue)
      }
      return () => {
        // @ts-ignore 实际初始值是 null
        if (isPercent) instance.percentHeight = null
      }
    },
    x: NormalProp.num,
    y: NormalProp.num,
    zIndex: NormalProp.num,
    scaleX: NormalProp.num,
    scaleY: NormalProp.num,
    skewX: NormalProp.num,
    skewY: NormalProp.num,
    anchorOffsetX: NormalProp.num,
    anchorOffsetY: NormalProp.num,
    rotation: NormalProp.num,
    alpha: NormalProp.num,
    tint: NormalProp.num,
    visible: NormalProp.boo,
    touchEnabled: NormalProp.boo,
    sortableChildren: NormalProp.boo,
    cacheAsBitmap: NormalProp.boo,
    blendMode: NormalProp.str,
    name: NormalProp.str,
    matrix: NormalProp.pass<egret.Matrix | void>,
    filters: NormalProp.pass<(egret.CustomFilter | egret.Filter)[]>,
    mask: NormalProp.pass<egret.DisplayObject | egret.Rectangle | void>,
  })
  .mixin(rectangleProp, 'mask')
  .mixin(rectangleProp, 'scrollRect')
  .get()

export default displayObjectPropsHandlers
