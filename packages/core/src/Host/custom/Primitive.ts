import { PropSetterParameters } from './../../type'
import { proxyHelper } from '../utils'
import type { Instance, IContainer } from '../../type'
import { FLAG } from '../../type'
import { NormalProp, EventProp } from '../common'
export class Primitive extends egret.EventDispatcher implements IContainer {
  __target: any
  // = new ArrayContainer()
  // __isMouted = false
  constructor(...args) {
    super()
    const props = { ...args[args.length - 1] }
    if ('object' in props) {
      this.__target = props.object
    } else {
      throw `primitive must have \`object\` prop`
    }
  }
  // = new ArrayContainer();
  // elements = new Set<Instance>()
  get object() {
    return this.__target
  }
  addChild(child: any, childInstance) {
    if ('addChild' in this.__target) {
      this.__target.addChild(child, childInstance)
      // this.elements.add(childInstance)
    } else {
      throw `please promise addChild method to ${this.__target.constructor.name}`
    }
  }
  removeChild(child: any, childInstance) {
    this.__target.removeChild(child, childInstance)
    // this.elements.delete(childInstance)
  }
  addChildAt(child: any, index: number, childInstance) {
    this.__target.addChildAt(child, index, childInstance)
    // this.elements.add(childInstance)
  }
  getChildIndex(child: any) {
    return this.__target.getChildIndex(child)
  }
}

const objectDiffKey = `${FLAG.COSTOM_DIFF_PREFIX}object` as const
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
  // {
  // let { mountedApplyProps, memoizedProps } = instance.__renderInfo;
  // memoizedProps = { ...memoizedProps };
  // delete memoizedProps.object;
  // {
  // if (instance.__isMouted) {
  // }
  // instance.__isMouted = true
  // this.__target = prop;
  // const parent = instance.__renderInfo.parent;
  // if (this.__isMouted) {
  //   for (const element of this.elements) {
  //     hostConfig.appendChild(instance, element);
  //   }
  //   if (mountedApplyProps) {
  //     hostConfig.appendChild(parent, instance);
  //     applyProps(instance, memoizedProps);
  //   } else {
  //     applyProps(instance, memoizedProps);
  //     hostConfig.appendChild(parent, instance);
  //   }
  // }
  // this.__isMouted = true;
  // const elements = [...this.elements];
  // for (const element of elements) {
  //   this.removeChild(getActualInstance(element), element);
  // }
  // this.elements = new Set(elements);
  // const parent = instance.__renderInfo.parent;
  // parent.removeChild(getActualInstance(this), this);
  // }
  // },
}

const pass = NormalProp.passWithType()
const primitiveProxy = new Proxy(primitive, {
  get(target, p: string) {
    if (p in target) return target[p]
    else if (p.startsWith(FLAG.COSTOM_DIFF_PREFIX)) return undefined
    else if (p.startsWith('on')) return EventProp.eventSetter
    else return pass
  },
})
export default primitiveProxy
