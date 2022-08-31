import egretProps from './egret/index'
import euiProps from './eui/index'
import customProps from './custom'
import type { IPropsHandlers, IElementProps } from '../type'

export type NodeProps<T> = {
  children?: React.ReactNode
  ref?: React.Ref<T>
  key?: React.Key
} & IElementProps

type InferClass<T> = T extends {
  __Class: new (...args: any[]) => infer U
}
  ? U
  : never

/**
 * @description 用于将 IPropsHandlers 转换为 JSX Element 的工具类型
 * 它会将所有 `__` 开头的属性剔除，再取所有函数的第一个参数类型作为属性的类型
 */
export type TransProp<T> = {
  [key in Exclude<keyof T, `${string}__${string}`>]?: T[key] extends (args: any) => any
    ? Parameters<T[key]>[0]['newValue']
    : T[key]
} & NodeProps<InferClass<T>>

declare global {
  namespace JSX {
    interface IntrinsicElements {
      displayObject: TransProp<typeof egretProps.displayObject>
      displayObjectContainer: TransProp<typeof egretProps.displayObjectContainer>
      shape: TransProp<typeof egretProps.shape>
      sprite: TransProp<typeof egretProps.sprite>
      bitmap: TransProp<typeof egretProps.bitmap>
      bitmapText: TransProp<typeof egretProps.bitmapText>
      textField: TransProp<typeof egretProps.textField>

      'eui-component': TransProp<typeof euiProps.component>
      'eui-group': TransProp<typeof euiProps.group>
      'eui-image': TransProp<typeof euiProps.image>
      'eui-bitmapLabel': TransProp<typeof euiProps.bitmapLabel>
      'eui-label': TransProp<typeof euiProps.label>
      'eui-rect': TransProp<typeof euiProps.rect>
      'eui-scroller': TransProp<typeof euiProps.scroller>
      'eui-button': TransProp<typeof euiProps.button>
      'eui-dataGroup': TransProp<typeof euiProps.dataGroup>
      'eui-editableText': TransProp<typeof euiProps.editableText>
      'eui-list': TransProp<typeof euiProps.list>
      'eui-itemRenderer': TransProp<typeof euiProps.itemRenderer>

      objectContainer: TransProp<typeof customProps.objectContainer>
      arrayContainer: TransProp<typeof customProps.arrayContainer>
      primitive: TransProp<typeof customProps.primitive>
      font: TransProp<typeof customProps.font>
    }
  }
}

export interface Catalogue {
  [name: string]: IPropsHandlers
}
export let catalogueMap: Catalogue = {}
export const extend = (newCatalogue: Catalogue) => {
  return (catalogueMap = { ...catalogueMap, ...newCatalogue })
}

export type EventCategoryInfo = {
  category: any
  withPrefix: boolean // 是否去除前缀
}
export const EVENT_CATEGORY_MAP: {
  [key: string]: EventCategoryInfo
} = {
  Touch: {
    category: egret.TouchEvent,
    withPrefix: true,
  },
  Item: {
    category: eui.ItemTapEvent,
    withPrefix: true,
  },
  Ui: {
    category: eui.UIEvent,
    withPrefix: false,
  },
  Focus: {
    category: egret.FocusEvent,
    withPrefix: true,
  },
}

extend({
  ...Object.entries({ ...egretProps, ...customProps }).reduce((acc, [key, val]) => {
    acc[key] = val
    return acc
  }, {} as any),
  ...Object.keys(euiProps).reduce((acc, key) => {
    acc[`eui-${key}`] = euiProps[key]
    return acc
  }, {} as any),
})
