import { proxyHelper, proxyGetPropsHandlers } from '../utils'
import { Instance, ICustomClass } from '../../type'
import { CONSTANTS } from '../../constants'
import { DevThrow } from '../../utils'

export class ObjectContainer implements ICustomClass {
  __target = {} as { [k in string]: any }
  addChild() {
    DevThrow(`objectContainer can't add child directly. Please add \`attach\` prop to child`)
  }
  reAttach(this: Instance<ObjectContainer>) {
    if (this[CONSTANTS.INFO_KEY].targetInfo) {
      this.__target = { ...this.__target }
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
  get: proxyGetPropsHandlers,
})
export default objectContainerProxy
