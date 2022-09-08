export namespace CONSTANTS {
  /* 标识 */

  // 第一次挂载标识
  export const PROP_MOUNT = '__PROP_MOUNT' as const

  // 默认属性前缀标识
  export const DEFAULT = '__default' as const

  // 默认移除前缀标识
  export const DEFAULT_REMOVE = `${DEFAULT}_remove` as const

  // 自定义diff函数名前缀标识
  export const CUSTOM_DIFF_PREFIX = '__diff_' as const

  /* 键名 */

  // 将实例挂载在 info/memoizedProp/target/fiber 的键，方便 devtool 查看
  export const INFO_KEY = '__renderInfo' as const
  export const STATE_NODE_KEY = '__stateNode' as const
  export const TARGET_KEY = '__target' as const
  export const FIBER_KEY = '__fiber' as const

  /* 常量 */

  // 对象池默认的大小
  export const POOL_DEFAULT_SIZE = 300 as const
}

export const isProduction = process.env.NODE_ENV === 'production'

export const isBrowser =
  typeof navigator !== 'undefined' &&
  (navigator.product === 'ReactNative' || navigator.product === 'NativeScript' || navigator.product === 'NS')
    ? false
    : typeof window !== 'undefined' && typeof document !== 'undefined'
