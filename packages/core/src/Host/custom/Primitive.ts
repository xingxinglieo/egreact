import { PropSetterParameters } from './../../type'
import { proxyHelper } from '../utils'
import { isEvent, DevThrow, is } from '../../utils'
import type { Instance, IContainer, ICustomClass } from '../../type'
import { CONSTANTS } from '../../constants'
import { NormalProp, EventProp } from '../common'
import { proxyGetPropsHandlers } from '../utils'

export class Primitive extends egret.EventDispatcher implements IContainer, ICustomClass {
  __target: any
  constructor(...args: any[]) {
    super()
    const props = args[args.length - 1]
    const { object, constructor } = props

    if (object !== undefined && object !== null) {
      this.__target = object
    } else if (props.hasOwnProperty('constructor') && typeof constructor === 'function') {
      this.__target = new constructor(...args.slice(0, -1))
    } else {
      DevThrow(`primitive must have an \`object\` or a \`constructor\` prop`)
    }
  }
  get object() {
    return this.__target
  }
  addChild(child: any, childInstance: any) {
    if (is.fun(this.__target.addChild)) {
      this.__target.addChild(child, childInstance)
    } else {
      DevThrow(`please promise addChild method to ${this.__target.constructor.name}`)
    }
  }
  removeChild(child: any, childInstance: any) {
    if (is.fun(this.__target.removeChild)) {
      this.__target.removeChild(child, childInstance)
    } else {
      DevThrow(`please promise removeChild method to ${this.__target.constructor.name}`)
    }
  }
  addChildAt(child: any, index: number, childInstance: any) {
    if (is.fun(this.__target.addChildAt)) {
      this.__target.addChildAt(child, index, childInstance)
    } else {
      DevThrow(`please promise addChildAt method to ${this.__target.constructor.name}`)
    }
  }
  getChildIndex(child: any, childInstance: any) {
    if (is.fun(this.__target.getChildIndex)) {
      return this.__target.getChildIndex(child, childInstance)
    } else {
      DevThrow(`please promise getChildIndex method to ${this.__target.constructor.name}`)
      return 0
    }
  }
}

const objectDiffKey = `${CONSTANTS.CUSTOM_DIFF_PREFIX}object` as const
const primitive = {
  __Class: proxyHelper({
    constructor: Primitive,
  }),
  object: ({}: PropSetterParameters<object, Instance<Primitive>>) => {
    return (isRemove: boolean) => {
      if (!isRemove) {
        DevThrow(`please use key to refresh object in primitive`)
      }
    }
  },
  constructor: ({}: PropSetterParameters<Function, Instance<Primitive>>) => {
    return (isRemove: boolean) => {
      if (!isRemove) {
        DevThrow(`please use key to refresh constructor in primitive`)
      }
    }
  },
  [objectDiffKey]: (n: any, o: any) => n === o,
}

const primitiveProxy = new Proxy(primitive, {
  get: proxyGetPropsHandlers,
})
export default primitiveProxy
