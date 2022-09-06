import React from 'react'
import type { PropSetter, IElementProps, Instance, IRenderInfo, EventInfo, ExtensionObj } from '../type'
import { CONSTANTS, isProduction } from '../constants'
import { EVENT_CATEGORY_MAP } from '../Host'
import { Fiber } from 'react-reconciler'

const hyphenateRE = /\B([A-Z])/g
/**
 * @description 驼峰转连字
 */
export function hyphenate(str: string) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
}

export const isEvent = (key: string) => /^on([A-Z][a-z]+)+\d*$/.test(key) // 是否为事件

export const isMountProp = (value: any): value is typeof CONSTANTS.PROP_MOUNT => value === CONSTANTS.PROP_MOUNT


export const DevThrow = (e: string | Error) => {
  if (isProduction) {
    console.error(e instanceof Error ? e.message : e)
  } else {
    throw e
  }
}

/**
 * @description 获取用于操作的实际 instance
 */
export function getActualInstance(instance: Instance<any>) {
  return instance.__target ?? instance
}

export function getCanvas() {
  return document.querySelector('.egret-player > canvas') as HTMLCanvasElement
}

export type EquConfig = {
  /** Compare arrays by reference equality a === b (default), or by shallow equality*/
  arrays?: 'reference' | 'shallow'
  /** Compare objects by reference equality a === b (default), or by shallow equality */
  objects?: 'reference' | 'shallow'
  /** If true the keys in both a and b must match 1:1 (default), if false a's keys must intersect b's */
  strict?: boolean
}

/**
 *
 * @copyright Copyright (c) 2020 Paul Henschel
 * @link https://github.com/pmndrs/react-three-fiber/blob/a575409cf872ae11583d9f1a162bef96ee19e6be/packages/fiber/src/core/utils.ts#L85
 */
export const is = {
  obj: (a: any) => a === Object(a) && !is.arr(a) && typeof a !== 'function',
  fun: (a: any): a is (...args: any) => any => typeof a === 'function',
  str: (a: any): a is string => typeof a === 'string',
  num: (a: any): a is number => typeof a === 'number',
  boo: (a: any): a is boolean => typeof a === 'boolean',
  und: (a: any) => a === void 0,
  arr: (a: any): a is Array<any> => Array.isArray(a),
  equ(a: any, b: any, { arrays = 'shallow', objects = 'reference', strict = true }: EquConfig = {}) {
    // Wrong type or one of the two undefined, doesn't match
    if (typeof a !== typeof b || !!a !== !!b) return false
    // Atomic, just compare a against b
    if (is.str(a) || is.num(a)) return a === b
    const isObj = is.obj(a)
    if (isObj && objects === 'reference') return a === b
    const isArr = is.arr(a)
    if (isArr && arrays === 'reference') return a === b
    // Array or Object, shallow compare first to see if it's a match
    if ((isArr || isObj) && a === b) return true
    // Last resort, go through keys
    let i
    for (i in a) if (!(i in b)) return false
    for (i in strict ? b : a) if (a[i] !== b[i]) return false
    if (is.und(i)) {
      if (isArr && a.length === 0 && b.length === 0) return true
      if (isObj && Object.keys(a).length === 0 && Object.keys(b).length === 0) return true
      if (a !== b) return false
    }
    return true
  },
}

// 找一个 egret 的祖先（有宽高）。
export function findEgretAncestor(o: Instance<unknown>): Instance<egret.DisplayObject> | null {
  while (!(getActualInstance(o) instanceof egret.DisplayObject)) {
    let fiber = o[CONSTANTS.INFO_KEY].fiber.return
    while (fiber && fiber.stateNode === null) {
      fiber = fiber.return
    }
    if (fiber) o = fiber.stateNode
  }
  return getActualInstance(o)
}

/**
 * @description key 用分隔符分割，target 逐个 key 访问到目标对象
 * target 为 null 表示出错
 */
export function reduceKeysToTarget(target: any, key: string, separator = '-') {
  const prefixKeys = key.split(separator)
  const targetKey = prefixKeys.pop()!
  try {
    target = prefixKeys.reduce((target, key) => target[key], target)
    if (target instanceof Object) {
      return [target, targetKey, prefixKeys] as const
    }
  } catch (e) {}
  return [null, targetKey, prefixKeys] as const
}

export const DEFAULT_EVENT_CATEGORY = egret.Event
const eventReg = /(([A-Z][a-z]+)|([0-9]+))/g
/**
 * @description 将 event 的 key 转换为 type,once,capture,priority 4个部分
 * 注意 Once Capture Priority 是作为后缀，某个可以缺失，但顺序不能颠倒
 */
export function splitEventKeyToInfo(key: string): EventInfo {
  const words: string[] = []
  const info: EventInfo = {
    type: '',
    name: '',
    once: false,
    capture: false,
    priority: 0,
    keys: [],
  }
  key.replace(eventReg, (match) => (words.push(match), ''))
  info.keys = [...words]
  const endIndex = Math.max(words.length - 3, 0)
  // 获取后缀
  for (let i = words.length - 1; i >= endIndex; i--) {
    let word = words[i]
    if (/^\d+$/.test(word)) {
      info.priority = parseInt(word)
      words.pop()
      word = words[--i]
    }
    if (word === 'Capture') {
      info.capture = true
      words.pop()
      word = words[--i]
    }
    if (word === 'Once') {
      info.once = true
      words.pop()
      word = words[--i]
    }
  }

  info.name = `on${words.join('')}`
  // TODO: 修改 MAP 方式 为 其他
  let category: any
  if (Object.keys(EVENT_CATEGORY_MAP).includes(words[0]) && EVENT_CATEGORY_MAP[words[0]]) {
    const categoryInfo = EVENT_CATEGORY_MAP[words[0]]
    if (!categoryInfo.withPrefix) words.shift()
    category = categoryInfo.category
  } else {
    category = DEFAULT_EVENT_CATEGORY
  }
  info.type = category[words.join('_').toUpperCase()]
  return info
}

/**
 * @description 从 react-dom 的 dom 中获取 fiber node
 * 并从此节点遍历到根结点,收集路径上的 Provider 的 Context
 */
export function collectContextsFromDom(dom: any) {
  if (!(dom instanceof HTMLElement)) {
    console.error(`prop is not a HTMLElement`)
    return []
  }
  const fiberKey = Object.keys(dom).find(
    (key) => key.startsWith('__react') && (dom as any)[key]?.stateNode === dom,
  ) as keyof typeof dom
  if (!fiberKey) {
    console.error(`dom must be created by react-dom`)
    return []
  }
  let fiber = dom[fiberKey] as unknown as Fiber['return']
  const contexts: React.Context<any>[] = []
  while (fiber) {
    if (fiber.type?._context) {
      contexts.push(fiber.type._context)
    }
    fiber = fiber.return
  }
  return contexts
}
