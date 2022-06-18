import Reconciler from 'react-reconciler'
import { catalogueMap } from '../Host/index'
import { ConcurrentRoot, DefaultEventPriority } from 'react-reconciler/constants'
import RenderString from '../Host/custom/RenderString'
import {
  getActualInstance,
  applyProps,
  diffProps,
  DiffSet,
  is,
  attachInfo,
  reduceKeysToTarget,
  detachInfo
} from '../utils'
import { getEventPriority } from '../outside'
import { CONSTANTS, IContainer, IElementProps, Instance } from '../type'


type HostConfig = Reconciler.HostConfig<
  string, // host type
  IElementProps, // pass props
  Instance<IContainer>, // container
  Instance<any>, // egret instance creacted by egreact
  Instance<RenderString>, // textInstance
  any, // SuspenseInstance
  any, // HydratableInstance
  any, // PublicInstance
  any, // HostContext
  DiffSet, // UpdatePayload [reconstruct,diffSet]
  any, // ChildSetter
  any, // TimeoutHandle
  any // NoTimeout
> & {
  // types is not defined in react-recoil@0.28.0 but use atually
  detachDeletedInstance: (instance: Instance) => void
  getCurrentEventPriority: () => number
}

/**
 *
 * @copyright Copyright (c) 2020 Paul Henschel
 * @link https://github.com/pmndrs/react-three-fiber/blob/a575409cf872ae11583d9f1a162bef96ee19e6be/packages/fiber/src/core/renderer.ts#L71
 */
const createInstance: HostConfig['createInstance'] = function (
  type,
  newProps,
  rootContainerInstance: Instance<egret.DisplayObjectContainer>,
  _hostContext,
  internalInstanceHandle,
) {
  const isPrimitive = type === 'primitive'
  let { args = [], attach, mountedApplyProps = false, ...props } = newProps
  const name = `${type[0].toUpperCase()}${type.slice(1)}` // 首字母大写

  const instanceProp = catalogueMap[name]
  if (!instanceProp) {
    throw `\`${name}\` is not host component! Did you forget to extend it?`
  }
  // args = is.fun(instanceProp.args) ? instanceProp.args(args) : args
  if (!is.arr(args)) args = [args] // 最外层不是数组转为数组
  const instance: Instance = attachInfo(new instanceProp.__Class(...args, props), {
    root: rootContainerInstance,
    fiber: internalInstanceHandle,
    propsHandlers: instanceProp,
    primitive: isPrimitive,
    mountedApplyProps,
    attach,
  })
  if (!mountedApplyProps) applyProps(instance, props)
  else {
    // mountedApplyProps 为真时，不在创建时应用 props，而是在挂载时应用 props
    instance[CONSTANTS.INFO_KEY].memoizedProps = { ...props }
  }
  return instance
}

const appendChild: HostConfig['appendChild'] = function (parentInstance, child) {
  // if (
  //   !child[CONSTANTS.INFO_KEY].attach &&
  //   parentInstance instanceof eui.Scroller &&
  //   !parentInstance.viewport
  // ) {
  //   child[CONSTANTS.INFO_KEY].attach = 'viewport'
  // }
  child[CONSTANTS.INFO_KEY].parent = parentInstance
  const attach = child[CONSTANTS.INFO_KEY].attach
  const isAttach = is.str(attach)
  if (isAttach) {
    // const [target, targetKey, keys] = reduceKeysToTarget(parent, attach)
    if (is.fun(child.attach)) {
      // const detach = child.attach({
      //   newValue: child,
      //   oldValue: CONSTANTS.PROP_MOUNT,
      //   instance: parent,
      //   target,
      //   targetKey,
      //   keys,
      // })
      // if (is.fun(detach)) {
      //   child[CONSTANTS.INFO_KEY].memoizedReset['attach'] = detach
      // }
    } else {
      const attach = child[CONSTANTS.INFO_KEY].attach
      const [target, targetKey] = reduceKeysToTarget(parentInstance, attach)
      child[CONSTANTS.INFO_KEY].targetInfo = [target, targetKey, target[targetKey]]
      target[targetKey] = getActualInstance(child)
    }
  } else if (child instanceof RenderString) {
    if ('text' in parentInstance) {
      child.setParent(parentInstance)
    } else {
      throw `parent ${parentInstance.constructor.name} is incorrect, text instance must be in a text container, such as textField, bitmapText, eui-label`
    }
  } else {
    parentInstance.addChild(getActualInstance(child), child)
  }
  // }
  if (child[CONSTANTS.INFO_KEY].mountedApplyProps) {
    applyProps(child, child[CONSTANTS.INFO_KEY].memoizedProps)
  }
}

const insertBefore: HostConfig['insertBefore'] = function (
  parentInstance: Instance<IContainer>,
  child: Instance,
  beforeChild: Instance,
) {
  if (beforeChild[CONSTANTS.INFO_KEY].targetInfo)
    throw `please keep the order of elements which have attach prop`
  const actualTarget = getActualInstance(child)
  const actualBefore = getActualInstance(beforeChild)
  parentInstance.addChildAt(actualTarget, parentInstance.getChildIndex(actualBefore), child)
}

const removeChild: HostConfig['removeChild'] = function (
  parentInstance: Instance<IContainer>,
  child: Instance<egret.DisplayObject>,
) {
  if (child) {
    for (let [_key, reset] of Object.entries(child[CONSTANTS.INFO_KEY].memoizedResetter)) {
      // if (isEvent(key))
      reset(true)
    }

    if (child[CONSTANTS.INFO_KEY].targetInfo) {
      const [target, targetKey, defaultValue] = child[CONSTANTS.INFO_KEY].targetInfo
      target[targetKey] = defaultValue
    } else if (child instanceof RenderString) {
      child.text = ''
      child.setParent(null)
    } else {
      parentInstance.removeChild(getActualInstance(child))
    }
  }
}

const commitUpdate: HostConfig['commitUpdate'] = function (
  instance,
  diff,
  _type,
  oldProps,
  newProps,
) {
  if (diff.changes.length) applyProps(instance, diff)

  if (oldProps.attach !== newProps.attach) {
    if (oldProps.attach === undefined || newProps.attach === undefined) {
      throw `please keep prop \`attach\` state of existence, because it determined how to add into parent instance when this instance created`
    }

    const attach = newProps.attach
    const parent = instance[CONSTANTS.INFO_KEY].parent
    instance[CONSTANTS.INFO_KEY].attach = attach

    const [target, targetKey, keys] = reduceKeysToTarget(parent, attach)
    if (is.fun(instance.attach)) {
      // instance[CONSTANTS.INFO_KEY].memoizedReset['attach'](false)
      // const detach = instance.attach({
      //   newValue: instance,
      //   oldValue: instance,
      //   instance: parent,
      //   target,
      //   targetKey,
      //   keys,
      // })
      // if (is.fun(detach)) {
      //   instance[CONSTANTS.INFO_KEY].memoizedReset['attach'] = detach
      // }
    } else {
      // 清除前一个 attch 副作用
      const [otarget, otargetKey, defaultValue] = instance[CONSTANTS.INFO_KEY].targetInfo
      otarget[otargetKey] = defaultValue

      instance[CONSTANTS.INFO_KEY].targetInfo = [target, targetKey, target[targetKey]]
      target[targetKey] = getActualInstance(instance)
    }
  }
}

export const getCurrentEventPriority = () => {
  const currentEvent = window.event
  if (currentEvent === undefined) {
    return DefaultEventPriority
  }
  return getEventPriority(currentEvent.type)
}

export const hostConfig: HostConfig = {
  createInstance,
  createTextInstance: (text) => {
    const instance = new RenderString(text)
    return attachInfo(instance)
  },
  // 用于移除实例后的清理引用
  detachDeletedInstance: detachInfo,
  removeChild,
  appendChild,
  appendInitialChild: appendChild,
  insertBefore,
  supportsMutation: true,
  isPrimaryRenderer: false,
  noTimeout: -1,
  appendChildToContainer: appendChild,
  removeChildFromContainer: removeChild,
  insertInContainerBefore: insertBefore,
  getRootHostContext: () => null,
  getChildHostContext: (parentHostContext: any) => parentHostContext,
  finalizeInitialChildren: () => false,
  prepareUpdate(instance, _type, oldProps, newProps) {
    const {
      args: argsN = [],
      attach: attachN,
      mountedApplyProps: nm,
      children: cN,
      ...restNew
    } = newProps
    const {
      args: argsO = [],
      attach: attachO,
      mountedApplyProps: om,
      children: cO,
      ...restOld
    } = oldProps

    const diff = diffProps(instance, restNew, restOld)
    if (diff.changes.length || oldProps.attach !== newProps.attach) return diff

    return null
  },
  commitUpdate,
  commitTextUpdate(instance, oldText, newText) {
    instance.text = newText
  },
  resetTextContent(instance: Instance<egret.TextField>) {
    instance.text = ''
  },
  shouldSetTextContent: (_type, props) => {
    return 'text' in props
  },
  getPublicInstance: (renderInstance) => renderInstance,
  prepareForCommit: () => null,
  preparePortalMount: () => null,
  resetAfterCommit: () => {},
  clearContainer: () => false,
  getCurrentEventPriority,
  hideInstance: (renderInstance) => {
    if (renderInstance instanceof egret.DisplayObject) {
      renderInstance.visible = false
    }
  },
  unhideInstance: (renderInstance) => {
    if (renderInstance instanceof egret.DisplayObject) {
      renderInstance.visible = true
    }
  },
  hideTextInstance: (renderString: RenderString) => {
    renderString.text = ''
  },
  unhideTextInstance: (renderString: RenderString, text: string) => {
    renderString.text = text
  },
  now:
    typeof performance !== 'undefined' && is.fun(performance.now)
      ? performance.now
      : is.fun(Date.now)
      ? Date.now
      : undefined,
  supportsPersistence: false,
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  supportsHydration: false,
}

export const reconciler = Reconciler(hostConfig)
import { injectIntoDevTools } from '../devtool'
injectIntoDevTools(reconciler)

export * from './create'
