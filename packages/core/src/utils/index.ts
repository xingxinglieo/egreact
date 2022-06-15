/*
https://github.com/pmndrs/react-three-fiber/blob/master/packages/fiber/src/core/utils.ts

MIT License

Copyright (c) 2020 Paul Henschel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
import { getBoundingClientRect } from '../devtool'
import { EVENT_CATEGORT_MAP } from '../Host'
import type { PropSetter, IElementProps, Instance, IRenderInfo, EventInfo } from '../type'
import { FLAG } from '../type'
const hyphenateRE = /\B([A-Z])/g

/**
 * @description 驼峰转连字
 */
export function hyphenate(str: string) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
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

export type Changes = [key: string, value: unknown, isEvent: boolean, keys: string[]]
export type DiffSet = {
  memoized: { [key: string]: any }
  changes: Changes[]
}
export const isDiffSet = (def: any): def is DiffSet =>
  def && !!(def as DiffSet).memoized && !!(def as DiffSet).changes

export type EquConfig = {
  /** Compare arrays by reference equality a === b (default), or by shallow equality */
  arrays?: 'reference' | 'shallow'
  /** Compare objects by reference equality a === b (default), or by shallow equality */
  objects?: 'reference' | 'shallow'
  /** If true the keys in both a and b must match 1:1 (default), if false a's keys must intersect b's */
  strict?: boolean
}
export const is = {
  obj: (a: any) => a === Object(a) && !is.arr(a) && typeof a !== 'function',
  fun: (a: any): a is (...args: any) => any => typeof a === 'function',
  str: (a: any): a is string => typeof a === 'string',
  num: (a: any): a is number => typeof a === 'number',
  boo: (a: any): a is boolean => typeof a === 'boolean',
  und: (a: any) => a === void 0,
  arr: (a: any): a is Array<any> => Array.isArray(a),
  equ(
    a: any,
    b: any,
    { arrays = 'shallow', objects = 'reference', strict = true }: EquConfig = {},
  ) {
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

/**
 * @description 附加 __renderInfo
 */
export function affixInfo<T = unknown>(
  instance: any,
  info: Partial<IRenderInfo> = {},
): Instance<T> {
  if (!(is.obj(instance) || is.arr(instance))) {
    throw `instance must be an object`
  } else if (!instance.__renderInfo) {
    instance.__renderInfo = {
      type: '',
      primitive: false,
      root: egret.lifecycle.stage,
      fiber: null,
      parent: null,
      propsHandlers: {},
      memoizedDefualt: {},
      memoizedProps: {},
      memoizedResetter: {},
      ...info,
    }
  }
  if (__DEV__) {
    // devtool need to get rect of element
    // https://github.com/facebook/react/blob/29c2c633159cb2171bb04fe84b9caa09904388e8/packages/react-devtools-shared/src/backend/views/utils.js#L108
    instance.getBoundingClientRect = () => getBoundingClientRect(instance)

    // https://github.com/facebook/react/blob/327e4a1f96fbb874001b17684fbb073046a84938/packages/react-devtools-shared/src/backend/views/Highlighter/Overlay.js#L193
    instance.nodeType = 1

    // https://github.com/facebook/react/blob/327e4a1f96fbb874001b17684fbb073046a84938/packages/react-devtools-shared/src/backend/views/Highlighter/Overlay.js#L233
    instance.nodeName = instance.__class__

    instance.ownerDocument = document
  }

  return instance
}

// 找一个 egret 的祖先（有宽高）。
export function findEgretAncestor(o: Instance<unknown>): Instance<egret.DisplayObject> | null {
  while (!(getActualInstance(o) instanceof egret.DisplayObject)) {
    if (!o.__renderInfo.fiber.return) {
      return null
    }
    o = o.__renderInfo.fiber.return.stateNode
  }
  return getActualInstance(o)
}

export const isEvent = (key: string) => /^on([A-Z][a-z]+)+\d*$/.test(key) // 是否为事件

/**
 * @description diff 属性
 */
export function diffProps(
  instance: Instance,
  { children: cN, key: kN, ref: rN, attach: na, ...props }: IElementProps = {},
  { children: cP, key: kP, ref: rP, attach: oa, ...previous }: IElementProps = {},
  // remove = false,
): DiffSet {
  if (!instance.__renderInfo) affixInfo(instance)
  const info = instance.__renderInfo
  const entries = Object.entries(props)
  const changes: DiffSet['changes'] = []
  const previousKeys = Object.keys(previous)
  for (let i = 0; i < previousKeys.length; i++) {
    if (!props.hasOwnProperty(previousKeys[i])) entries.push([previousKeys[i], FLAG.DEFAULT_REMOVE])
  }
  // 从少key到多key，保证添加的顺序，否则会出错
  entries.sort((a, b) => a[0].split('-').length - b[0].split('-').length)
  entries.forEach(([key, value]) => {
    const isRemove = value === FLAG.DEFAULT_REMOVE
    let keys = key.split('-')
    const prefixKeys = [...keys]
    prefixKeys.pop()
    const prefixKey = prefixKeys.join('-')
    // 前缀属性改变
    const prefixPropIndex =
      prefixKey === '' ? -1 : changes.findIndex(([prefixPropKey]) => prefixPropKey === prefixKey)
    /**
     * 因为属性和其前缀属性(如果存在)之间是联动的，所以需要按照属性的顺序进行操作
     * entries.sort 排序已经保证其 key 顺序是从少 key 到多 key
     * 比如 layout 和 layout-paddingBottom 属性
     * 1 如果layout-paddingBottom 的前缀 layout 属性改变
     * 无论如何, layout-paddingBottom 属性都需要做出操作
     *  1.1 layout-paddingBottom 是 Remove，则插入在 layout 之前，
     *  因为 layout 也可能是 remove，这样就保证了 layout-paddingBottom 移除在 layout 移除之前
     *  1.2 否则，无论有没有更新，则插入在 layout 之后，
     *  因为 layout 更新后可能是新的实例, 需要重新应用所有后缀属性
     * 2 否则走正常的操作
     */
    const isPrefixPropChange = prefixPropIndex !== -1
    if (isPrefixPropChange) {
      if (isRemove) {
        return changes.splice(prefixPropIndex, 0, [key, FLAG.DEFAULT_REMOVE, false, keys])
      } else {
        return changes.splice(prefixPropIndex + 1, 0, [key, value, false, keys])
      }
    }

    // 自定义的属性对比，
    const customDiff = info.propsHandlers[`${FLAG.COSTOM_DIFF_PREFIX}${key}`]
    if (customDiff) {
      if (customDiff(value, previous[key])) return
    } else {
      if (is.equ(value, previous[key])) return

      if (isEvent(key)) {
        return changes.push([key, value, true, keys])
      }
    }
    changes.push([key, value, false, keys])
  })

  const memoized: { [key: string]: any } = { ...props }

  return { memoized, changes }
}

/**
 * @description key 用分隔符分割，target 逐个 key 访问到目标对象
 */
export function reduceKeysToTarget(target: any, key: string, separator = '-') {
  const prefixKeys = key.split(separator)
  const targetKey = prefixKeys.pop()
  try {
    target = prefixKeys.reduce((target, key) => target[key], target)
    if (target instanceof Object) return [target, targetKey, prefixKeys] as const
    else throw ``
  } catch (e) {
    const prefixKey = prefixKeys.join(separator)
    throw `\`${key}\` depends on \`${prefixKey}\`, you must set \`${prefixKey}\` before`
  }
}

export const DEFAULT_EVENT_CATEGORT = egret.Event
const eventReg = /(([A-Z][a-z]+)|([0-9]+))/g
/**
 * @description 将 event 的 key 转换为 type,once,capture,priority 4个部分
 * 注意 Once Capture Priority 是作为后缀且，且某个可以缺失，但顺序不能颠倒
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
  let category: any
  if (Object.keys(EVENT_CATEGORT_MAP).includes(words[0]) && EVENT_CATEGORT_MAP[words[0]]) {
    const categoryInfo = EVENT_CATEGORT_MAP[words[0]]
    if (!categoryInfo.withPrefix) words.shift()
    category = categoryInfo.category
  } else {
    category = DEFAULT_EVENT_CATEGORT
  }
  info.type = category[words.join('_').toUpperCase()]
  return info
}

/**
 * @description 将属性和事件改变应用到实例 This function applies a set of changes to the instance
 */
export function applyProps(instance: Instance, data: IElementProps | DiffSet) {
  const info = instance.__renderInfo
  const oldMemoizedProps = info.memoizedProps
  const { memoized, changes } = isDiffSet(data) ? data : diffProps(instance, data)

  // Prepare memoized props
  if (info) info.memoizedProps = memoized
  changes.forEach(([key, newValue, isEvent, keys]) => {
    const oldValue = oldMemoizedProps.hasOwnProperty(key) ? oldMemoizedProps[key] : FLAG.PROP_MOUNT
    const isRemove = newValue === FLAG.DEFAULT_REMOVE
    if (isEvent) {
      const einfo = splitEventKeyToInfo(key)
      const setter = info.propsHandlers[einfo.name] as PropSetter<any>
      if (!is.fun(setter)) {
        return console.error(`\`${key}\` maybe not a valid event`)
      }

      // 无论如何都会先清除副作用

      info.memoizedResetter[key]?.(isRemove)

      // 如果 propsHandler 存在，则返回值中必须有 set 和 reset 两个函数
      // if (!is.fun(set))
      // throw `Return type of EventHandler ${key} must be a function,meaning set event`
      if (isRemove) {
        // delete info.memoizedEvents[key]
        delete info.memoizedResetter[key]
      } else {
        const resetter = setter({
          newValue,
          oldValue,
          instance,
          target: instance,
          targetKey: key,
          keys,
          einfo,
        })
        // const reset = set()
        // info.memoizedEvents[key] = newValue
        if (!is.fun(resetter))
          throw `Return type of set of EventHandler ${key} must be a function,meaning remove event`
        info.memoizedResetter[key] = resetter
      }
    } else {
      const [target, targetKey] = reduceKeysToTarget(instance, keys.join('-'))

      // 存储一下初始值
      if (!info.memoizedDefualt.hasOwnProperty(key)) {
        info.memoizedDefualt[key] = target[targetKey]
      }

      if (!is.fun(info.propsHandlers[key])) {
        console.error(`\`${key}\` maybe not a valid prop in ${instance.constructor.name}`)
      }

      const defaultPropsHandler =
        ({ newValue, target, targetKey }) =>
        () => ((target[targetKey] = newValue), void 0)
      const setter = (info.propsHandlers[key] ?? defaultPropsHandler) as PropSetter<any>

      const lastResetter = info.memoizedResetter[key]
      const resetter = setter({
        newValue,
        oldValue,
        instance,
        target,
        targetKey,
        keys,
      })
      // 移除情况 清除副作用
      if (isRemove) {
        if (lastResetter) {
          // 如果有清除副作用函数优先使用
          lastResetter(true)
        } else {
          // 否则用储存的默认值
          target[targetKey]?.dispose?.()
          target[targetKey] = info.memoizedDefualt[key]
        }
        delete info.memoizedResetter[key]
        delete info.memoizedDefualt[key]
      } else {
        // 如果需要清除副作用需要清除
        if (lastResetter) lastResetter(false)
        else target[targetKey]?.dispose?.()
        if (resetter) info.memoizedResetter[key] = resetter
      }
    }
  })
  return instance
}

/**
 * @description 从 react-dom 的 dom 中获取 fiber node
 * 并从此节点遍历到根结点,收集路径上的 Provider 的 Context
 */
export function collectContextsFromDom(dom: any) {
  if (!(dom instanceof HTMLElement)) return []
  const fiberKey = Object.keys(dom).filter((key) => key.startsWith('__react'))[0]
  if (!fiberKey) {
    console.error(`dom must created by react-dom`)
    return []
  }
  let fiber = dom[fiberKey]
  const contexts: React.Context<any>[] = []
  while (fiber) {
    if (fiber.type?._context) {
      contexts.push(fiber.type._context)
    }
    fiber = fiber.return
  }
  return contexts
}

export * from './ContextBridge'
export * from './ErrorBoundary'
