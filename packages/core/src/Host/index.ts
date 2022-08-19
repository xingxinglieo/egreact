import egretProps from './egret/index'
import euiProps from './eui/index'
import customProps from './custom'
import { Pool } from '../utils/Pool'
import { detachRenderString } from './custom/RenderString'
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
      // 'eui-hScrollBar': TransProp<typeof euiProps.hScrollBar>
      // 'eui-vScrollBar': TransProp<typeof euiProps.vScrollBar>

      font: TransProp<typeof customProps.font>
      arrayContainer: TransProp<typeof customProps.arrayContainer>
      objectContainer: TransProp<typeof customProps.objectContainer> & {
        [k in string]: any
      }
      primitive: TransProp<typeof customProps.primitive> & {
        [k in string]: any
      } & {
        mountedApplyProps?: false // primitive 不允许插入后再应用属性，因为它的实例本身就是由 object 创造
      }
    }
  }
}

Pool.registerClass([
  ...[
    egret.DisplayObject,
    egret.DisplayObjectContainer,
    egret.Shape,
    egret.Sprite,
    egret.Bitmap,
    egret.BitmapText,
    eui.Component,
    eui.Image,
    eui.BitmapLabel,
    eui.Rect,
    eui.Scroller,
  ].map((clz) => ({ constructor: clz })),
  // 需要特殊处理
  ...[
    {
      constructor: eui.Group,
      resetter: (instance: eui.Group) => {
        instance.scrollH = 0
        instance.scrollV = 0
      },
    },
    { constructor: eui.Label, resetter: detachRenderString },
    { constructor: egret.TextField, resetter: detachRenderString },
  ],
])

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
    acc[`${key[0].toUpperCase()}${key.slice(1)}`] = val
    return acc
  }, {} as any),
  ...Object.keys(euiProps).reduce((acc, key) => {
    acc[`Eui-${key}`] = euiProps[key]
    return acc
  }, {} as any),
})

import { Link, LinkProps } from 'react-router-dom'
export const EgreactLink: React.ForwardRefExoticComponent<TransProp<typeof euiProps.label> & LinkProps> = Link as any
