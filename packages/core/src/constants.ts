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

  // egreact 渲染所需信息挂载键
  export const INFO_KEY = '__renderInfo' as const

  // 将实例挂载在 memoizedProp 的键，方便 devtool 查看
  export const STATE_NODE_KEY = '__stateNode' as const

  // 将 fiber 挂载在 memoizedProp 的键，方便 devtool 查看
  export const FIBER_KEY = '__fiber' as const

  /* 常量 */

  // 对象池默认的大小
  export const POOL_DEFAULT_SIZE = 300 as const
}

export const isProduction = process.env.NODE_ENV === 'production'
