import { PropSetterParameters } from './../../type'
import { proxyHelper } from '../utils'
import { isEvent } from '../../utils'
import type { Instance, IContainer } from '../../type'
import { CONSTANTS } from '../../type'
import { NormalProp, EventProp } from '../common'
export class Primitive extends egret.EventDispatcher implements IContainer {
  __target: any
  constructor(...args) {
    super()
    const props = { ...args[args.length - 1] }
    if ('object' in props) {
      this.__target = props.object
    } else {
      throw `primitive must have \`object\` prop`
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

const objectDiffKey = `${CONSTANTS.COSTOM_DIFF_PREFIX}object` as const
const primitive = {
  __Class: proxyHelper({
    constructor: Primitive,
  }),
  object: ({}: PropSetterParameters<any, Instance<Primitive>>) => {
    return (isRemove: boolean) => {
      if (!isRemove) throw new Error('please use key to refresh object in primitive')
    }
  },
  [objectDiffKey]: (n, o) => n === o,
}

const pass = NormalProp.passWithType()
const primitiveProxy = new Proxy(primitive, {
  get(target, p: string) {
    if (p in target) return target[p]
    else if (p.startsWith(CONSTANTS.COSTOM_DIFF_PREFIX)) return undefined
    else if (isEvent(p)) return EventProp.eventSetter
    else return pass
  },
})
export default primitiveProxy
