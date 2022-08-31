import { proxyHelper } from '../utils'
import { Instance, IContainer, ICustomClass } from '../../type'
import { CONSTANTS } from '../../constants'

export class ArrayContainer extends egret.EventDispatcher implements IContainer, ICustomClass {
  __target = []
  addChild(child: any) {
    this.__target.push(child)
  }
  removeChild(child: any) {
    this.__target.splice(this.__target.indexOf(child), 1)
  }
  addChildAt(child: any, index: number) {
    this.__target.splice(index, 0, child)
  }
  getChildIndex(child: any) {
    return this.__target.indexOf(child)
  }
  reAttach() {
    this.__target = [...this.__target]
    const _this = this as unknown as Instance<ArrayContainer>
    if (_this[CONSTANTS.INFO_KEY].targetInfo) {
      const [target, targetKey] = _this[CONSTANTS.INFO_KEY].targetInfo
      target[targetKey] = this.__target
    }
  }
}

const ArrayContainerProxy = proxyHelper({ constructor: ArrayContainer })

const arrayContainer = {
  __Class: ArrayContainerProxy,
}
export default arrayContainer
