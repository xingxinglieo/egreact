import { FLAG } from '../type'
import { IPropsHandlers } from '../type'

type ToUnionOfFunction<T> = T extends any ? (x: T) => any : never
// 联合类型转交叉类型
export type UnionToIntersection<T> = ToUnionOfFunction<T> extends (x: infer P) => any ? P : never
export type LiteralObj<T> = T extends object ? { [K in keyof T]: T[K] } : never
module Mixin {
  /* 混入函数的类型 */

  // 转换 P-__setter 的键为 P
  type TranslateHandlerKey<T extends object> = {
    [K in keyof T as K extends `${infer P}-__setter` ? P : K]: T[K]
  }

  // 转换 P-__diff 的键为 `${FLAG.COSTOM_DIFF_PREFIX}${P}`
  type TranslateDiffKey<T extends object> = {
    [K in keyof T as K extends `${infer P}-__diff`
      ? `${typeof FLAG.COSTOM_DIFF_PREFIX}${P}`
      : K]: T[K]
  }

  // 铺平对象，比如 {a:{b:string},b:number} 会转换为 { a-b:sring,b:number }
  type _FlattenObject<T extends IPropsHandlers, S extends string> = {
    [K in Exclude<keyof T, Symbol>]: T[K] extends IPropsHandlers
      ? _FlattenObject<T[K], `${S}${K}-`>
      : { [_ in `${S}${K}`]: T[K] }
  }[Exclude<keyof T, Symbol>]

  // 给所有键加上前缀
  type WrapKey<T, S extends string> = {
    [K in Exclude<keyof T, Symbol> as `${S}-${K}`]: T[K]
  }

  export type FlattenObject<T extends IPropsHandlers, K extends string> = TranslateDiffKey<
    TranslateHandlerKey<WrapKey<LiteralObj<UnionToIntersection<_FlattenObject<T, ''>>>, K>>
  >

  // 完成上述类型相对应的函数转换
  // S extends [string] 用于字面量推断，传入的字符串会推断为字面量而非 string
  export const mixin = <T, P extends IPropsHandlers, S extends [string]>(
    target: T,
    obj: P,
    ...key: S
  ) => {
    const entries: [string[], any][] = []
    // 铺平收集键值对
    const collectTranslateKey = (obj: P, prefixKey: string[]) => {
      for (const [key, value] of Object.entries(obj)) {
        if ('__setter' in value) {
          collectTranslateKey(value, [...prefixKey, key])
        } else {
          entries.push([[...prefixKey, key], value])
        }
      }
    }
    collectTranslateKey(obj, key)
    // 将键值对的键转换为连字符
    const flattenObj = entries.reduce((obj, [keys, value]) => {
      if (keys[keys.length - 1] === '__setter') {
        keys.pop()
        obj[keys.join('-')] = value
      } else if (keys[keys.length - 1] === '__diff') {
        keys.pop()
        obj[FLAG.COSTOM_DIFF_PREFIX + keys.join('-')] = value
      } else {
        obj[keys.join('-')] = value
      }
      return obj
    }, {} as Mixin.FlattenObject<P, S[0]>)
    return { ...target, ...flattenObj }
  }
}

// 此工具转为链式调用写法更加清晰
export const mixinHelper = {
  store: {},
  set<P extends { store: any }, T>(this: P, target: T) {
    return {
      ...this,
      store: target,
    }
  },
  mixin<P extends { store: any }, T extends IPropsHandlers, S extends [string]>(
    this: P,
    obj: T,
    ...name: S
  ) {
    type C = P extends { store: infer D } ? D : never
    type SD = S extends [infer U] ? U : never
    return {
      ...this,
      store: Mixin.mixin(this.store as C, obj as T, name[0] as SD),
    }
  },
  get<P extends { store: any }>(this: P) {
    type C = P extends { store: infer D } ? D : never
    return this.store as C
  },
}

// 用于有 __target 实例的代理
export const proxyHelper = <T extends new (...args: any[]) => any>(config: {
  constructor: T // 类
  targetKey?: string // 可以用.分隔
  excludeKeys?: string[] // 排除判断的键
  setCallback?: (target: any, key, value: any) => void // set 后的回调函数
  configs?: ProxyHandler<InstanceType<T>> // 其他 proxy 配置
}) => {
  let {
    constructor,
    targetKey = '__target',
    excludeKeys = ['__renderInfo'],
    setCallback = () => void 0,
    configs = {},
  } = config

  excludeKeys = [...excludeKeys, '__renderInfo']
  const keys = targetKey.split('.')
  targetKey = keys.pop()
  const name = 'Proxy' + constructor.name
  let proxyConstructor = {
    [name]: function (...args) {
      const instance = new constructor(...args)
      instance['$name'] = name
      return new Proxy(instance, {
        set(target, p, value) {
          // 优先设置原实例
          if (p in target || excludeKeys.includes(p as string)) {
            const oldValue = target[p]
            target[p] = value
            setCallback.call(target, {
              instance: target,
              target: target,
              propName: p,
              value,
              oldValue,
            })
          } else {
            // 否则设置内置实例
            const _target = target
            target = keys.reduce((t, p) => t[p], target)
            const oldValue = target[targetKey][p]
            target[targetKey][p] = value
            setCallback.call(_target, {
              instance: _target,
              target: target[targetKey],
              propName: p,
              value,
              oldValue,
            })
          }
          return true
        },
        get(target, p) {
          // 如果原实例有优先返回原实例的
          if (p in target) return target[p]
          else {
            // 否则返回内置实例的
            target = keys.reduce((t, p) => t[p], target)
            return target[targetKey][p]
          }
        },
        // 用于 instanceof 判断，否则会返回 proxy 的原型导致 instanceof 判断失败
        getPrototypeOf() {
          return proxyConstructor.prototype
        },
        ...configs,
      })
    },
    // 返回一个新类，它的实例是经过 proxy 处理的
    // return
  }[name] as unknown as T
  return proxyConstructor
}
