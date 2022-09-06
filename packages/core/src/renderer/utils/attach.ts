import { addCompatibleDomAttributes } from '../../devtool'
import { CONSTANTS, isProduction } from '../../constants'
import { Instance, IRenderInfo } from '../../type'
import { is } from '../../utils'

/**
 * @description 附加 __renderInfo
 */
export function attachInfo<T = unknown>(instance: any, info: Partial<IRenderInfo> = {}): Instance<T> {
  if (!(is.obj(instance) || is.arr(instance))) {
    throw `instance must be an object`
  } else if (!instance[CONSTANTS.INFO_KEY]) {
    instance[CONSTANTS.INFO_KEY] = {
      type: '',
      primitive: false,
      container: false,
      // noUsePool: false,
      args: false,
      root: egret.lifecycle.stage,
      fiber: null,
      parent: null,
      propsHandlers: {},
      memoizedDefault: {},
      memoizedProps: {},
      memoizedResetter: {},
      ...info,
    }
  }

  if (!isProduction) {
    addCompatibleDomAttributes(instance)
  }

  return instance
}

export function getRenderInfo(instance: any): IRenderInfo {
  return instance?.[CONSTANTS.INFO_KEY]
}

export function detachInfo(instance: any) {
  if (is.obj(instance) || is.arr(instance)) {
    delete instance[CONSTANTS.INFO_KEY]
  }
}
