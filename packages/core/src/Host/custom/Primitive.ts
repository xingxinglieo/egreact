import { PropSetterParameters } from './../../type'
import { proxyHelper } from '../utils'
import { isEvent } from '../../utils'
import type { Instance, IContainer } from '../../type'
import { CONSTANTS } from '../../constants'
import { NormalProp, EventProp } from '../common'

export class Primitive extends egret.EventDispatcher implements IContainer {
  __target: any
  constructor(...args) {
    super()
    const { object, constructor } = args[args.length - 1]

    if (typeof object === 'object' && object !== null) {
      this.__target = object
    } else if (constructor !== {}.constructor && typeof constructor === 'function') {
      this.__target = new constructor(...args.slice(0, -1))
    } else {
      throw `primitive must have a \`object\` or a \`constructor\` prop`
    }
  }
  get object() {
    return this.__target
  }
  addChild(child: any, childInstance) {
    if ('addChild' in this.__target) {
      this.__target.addChild(child, childInstance)
    } else {
      throw `please promise addChild method to ${this.__target.constructor.name}`
    }
  }
  removeChild(child: any, childInstance) {
    this.__target.removeChild(child, childInstance)
  }
  addChildAt(child: any, index: number, childInstance) {
    this.__target.addChildAt(child, index, childInstance)
  }
  getChildIndex(child: any) {
    return this.__target.getChildIndex(child)
  }
}

const objectDiffKey = `${CONSTANTS.CUSTOM_DIFF_PREFIX}object` as const
const primitive = {
  __Class: proxyHelper({
    constructor: Primitive,
  }),
  object: ({}: PropSetterParameters<object, Instance<Primitive>>) => {
    return (isRemove: boolean) => {
      if (!isRemove) throw `please use key to refresh object in primitive`
    }
  },
  constructor: ({}: PropSetterParameters<Function, Instance<Primitive>>) => {
    return (isRemove: boolean) => {
      if (!isRemove) throw `please use key to refresh constructor in primitive`
    }
  },
  [objectDiffKey]: (n, o) => n === o,
}

const primitiveProxy = new Proxy(primitive, {
  get(target, p: string) {
    if (p in target) return target[p]
    else if (typeof p === 'symbol' || p.startsWith(CONSTANTS.CUSTOM_DIFF_PREFIX)) return undefined
    else if (isEvent(p)) return EventProp.eventSetter
    else return NormalProp.pass
  },
})
export default primitiveProxy
