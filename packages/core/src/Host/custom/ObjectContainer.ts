import { NormalProp } from '../common'
import { proxyHelper } from '../utils'
import { Instance } from '../../type'
import { CONSTANTS } from '../../constants'

const errorTip = `objectContainer can't add child directly. Please add \`attach\` prop to child`
export class ObjectContainer extends egret.EventDispatcher {
  __target = {} as { [k in string]: any }
  addChild() {
    throw errorTip
  }
  reAttach(this: Instance<ObjectContainer>) {
    this.__target = { ...this.__target }
    if (this[CONSTANTS.INFO_KEY].targetInfo) {
      const [target, targetKey] = this[CONSTANTS.INFO_KEY].targetInfo
      target[targetKey] = this.__target
    }
  }
}

const ObjectContainerProxy = proxyHelper({
  constructor: ObjectContainer,
})

const objectContainer = {
  __Class: ObjectContainerProxy,
}
const objectContainerProxy = new Proxy(objectContainer, {
  get(target, key: string | symbol) {
    if (key in target) return target[key]
    else if (typeof key === 'symbol') return undefined
    else if (key.startsWith(CONSTANTS.CUSTOM_DIFF_PREFIX)) return undefined
    else return NormalProp.pass
  },
})
export default objectContainerProxy
