import Reconciler from 'react-reconciler'
import { DefaultEventPriority } from 'react-reconciler/constants'
import { catalogueMap } from '../Host/index'
import TextNode from '../Host/custom/TextNode'
import {
  getActualInstance,
  applyProps,
  diffProps,
  DiffSet,
  is,
  attachInfo,
  reduceKeysToTarget,
  detachInfo,
  getRenderInfo,
  DevThrow,
} from '../utils'
// import { Pool } from '../utils/Pool'
import { getEventPriority } from '../outside'
import { IContainer, IElementProps, Instance } from '../type'
import { deleteCompatibleDomAttributes } from '../devtool'
import { CONSTANTS, isProduction } from '../constants'

type HostConfig = Reconciler.HostConfig<
  string, // host type
  IElementProps, // pass props
  Instance<IContainer>, // container
  Instance<any>, // egret instance created by egreact
  Instance<TextNode>, // textInstance
  any, // SuspenseInstance
  any, // HydratableInstance
  any, // PublicInstance
  any, // HostContext
  DiffSet, // UpdatePayload [reconstruct,diffSet]
  any, // ChildSetter
  any, // TimeoutHandle
  any // NoTimeout
> & {
  // types is not defined in react-recoil@0.28.0 but use actually
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
  const { attach, mountedApplyProps = false, noUsePool = false, ...props } = newProps
  const isPrimitive = type === 'primitive'
  const instanceProp = catalogueMap[type]

  if (!instanceProp) {
    throw `\`${type}\` is not a host component! Did you forget to extend it?`
  }

  let args = []
  if (!is.und(newProps.args)) {
    // 最外层不是数组转为数组
    args = is.arr(newProps.args) ? newProps.args : [newProps.args]
  }
  const hasArgs = args.length > 0

  // const usePool = Pool.enable && !hasArgs && !noUsePool && Pool.isRegisteredClass(instanceProp.__Class)
  const instance: Instance = attachInfo(
    // last parameter is props, let constructor do something
    // usePool ? Pool.get(instanceProp.__Class) :
    new instanceProp.__Class(...args, props),
    {
      type,
      root: rootContainerInstance,
      fiber: internalInstanceHandle,
      propsHandlers: instanceProp,
      primitive: isPrimitive,
      args: hasArgs,
      mountedApplyProps,
      noUsePool,
      attach,
    },
  )

  // mountedApplyProps 为真时，不在创建时应用 props，而是在挂载时应用 props
  if (!mountedApplyProps) applyProps(instance, props)
  else instance[CONSTANTS.INFO_KEY].memoizedProps = { ...props }

  return instance
}

const appendChild: HostConfig['appendChild'] = function (parentInstance, child) {
  const info = getRenderInfo(child)
  info.parent = parentInstance

  const attach = info.attach
  const isAttach = is.str(attach)

  if (isAttach) {
    const [target, targetKey, prefixKeys] = reduceKeysToTarget(parentInstance, attach)

    if (target === null) {
      const prefixKey = prefixKeys.join('-')
      return DevThrow(`\`${targetKey}\` depends on \`${prefixKey}\`, you must set \`${prefixKey}\` before`)
    }

    info.targetInfo = [target, targetKey, target[targetKey]]
    target[targetKey] = getActualInstance(child)
  } else if (child instanceof TextNode) {
    if ('text' in parentInstance) {
      child.setContainer(parentInstance)
    } else {
      return DevThrow(
        `parent ${parentInstance.constructor.name} is incorrect, text instance must be in a text container, such as textField, bitmapText, eui-label`,
      )
    }
  } else {
    parentInstance.addChild(getActualInstance(child), child)
  }

  if (info.mountedApplyProps) {
    applyProps(child, info.memoizedProps)
  }
}

const insertBefore: HostConfig['insertBefore'] = function (
  parentInstance: Instance<IContainer>,
  child: Instance,
  beforeChild: Instance,
) {
  if (beforeChild[CONSTANTS.INFO_KEY].targetInfo) throw `please keep the order of elements which have attach prop`
  const actualTarget = getActualInstance(child)
  const actualBefore = getActualInstance(beforeChild)
  parentInstance.addChildAt(actualTarget, parentInstance.getChildIndex(actualBefore, beforeChild), child)
}

const removeChild: HostConfig['removeChild'] = function (parentInstance: Instance<IContainer>, child: Instance) {
  if (child) {
    const info = getRenderInfo(child)
    // detachDeletedInstance 中处理
    if (info.targetInfo) return
    else if (child instanceof TextNode) {
      child.removeContainer()
    } else {
      parentInstance.removeChild(getActualInstance(child))
    }
  }
}
// 用于移除实例后的清理引用
const detachDeletedInstance: HostConfig['detachDeletedInstance'] = (instance) => {
  const info = getRenderInfo(instance)
  if (!info) return

  if (info.targetInfo) {
    const [target, targetKey, defaultValue] = info.targetInfo
    target[targetKey] = defaultValue
  }

  info.propsHandlers.__detach?.(instance)

  if (!isProduction) {
    deleteCompatibleDomAttributes(instance)
  }

  for (let [, reset] of Object.entries(info.memoizedResetter)) {
    reset(true)
  }

  // 对象池回收
  // if (Pool.enable && !info.noUsePool && !info.args && Pool.isRegisteredClass(instance.constructor)) {
  // instance?.removeChildren?.()
  // Pool.recover(instance)
  // }

  detachInfo(instance)
}

const prepareUpdate: HostConfig['prepareUpdate'] = (instance, _type, oldProps, newProps) => {
  const { args: argsN = [], attach: attachN, mountedApplyProps: nm, children: cN, ...restNew } = newProps
  const { args: argsO = [], attach: attachO, mountedApplyProps: om, children: cO, ...restOld } = oldProps

  const diff = diffProps(instance, restNew, restOld)
  if (diff.changes.length || oldProps.attach !== newProps.attach) return diff

  return null
}

const commitUpdate: HostConfig['commitUpdate'] = function (instance, diff, _type, oldProps, newProps) {
  const info = getRenderInfo(instance)

  if (diff.changes.length) applyProps(instance, diff)

  if (oldProps.attach !== newProps.attach) {
    if (oldProps.attach === undefined || newProps.attach === undefined) {
      return DevThrow(
        `please keep prop \`attach\` state of existence, because it determined how to add into parent instance when child instance created`,
      )
    }

    const attach = newProps.attach
    const parent = info.parent
    info.attach = attach

    const [target, targetKey] = reduceKeysToTarget(parent, attach)

    if (target === null) return

    // 清除前一个 attach 副作用
    const [oTarget, oTargetKey, defaultValue] = info.targetInfo!
    oTarget[oTargetKey] = defaultValue

    info.targetInfo = [target, targetKey, target[targetKey]]
    target[targetKey] = getActualInstance(instance)
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
  /* 创建实例 */
  createInstance,
  createTextInstance: (text) => attachInfo(new TextNode(text)),

  /* 节点操作 */
  appendChild,
  appendInitialChild: appendChild,
  appendChildToContainer: appendChild,
  insertBefore,
  insertInContainerBefore: insertBefore,
  removeChild,
  removeChildFromContainer: removeChild,
  clearContainer: () => null,
  detachDeletedInstance,

  /* 属性对比和应用更新 */
  prepareUpdate,
  commitUpdate,
  shouldSetTextContent: (_type, props) => 'text' in props,
  commitTextUpdate: (instance, _oldText, newText) => (instance.text = newText),
  resetTextContent: (instance: { text: string }) => (instance.text = ''),
  prepareForCommit: () => null,
  resetAfterCommit: () => null,

  /* ref 返回值 */
  getPublicInstance: (renderInstance) => renderInstance,

  /* 事件优先级 */
  getCurrentEventPriority,

  /* 不移除节点情况下 显示/隐藏 */
  hideInstance: (renderInstance) => 'visible' in renderInstance && (renderInstance.visible = false),
  unhideInstance: (renderInstance) => 'visible' in renderInstance && (renderInstance.visible = true),
  hideTextInstance: (TextNode: TextNode) => (TextNode.text = ''),
  unhideTextInstance: (TextNode: TextNode, text: string) => (TextNode.text = text),

  /* 无/未知作用 */
  getRootHostContext: () => null,
  getChildHostContext: (parentHostContext: any) => parentHostContext,
  finalizeInitialChildren: () => false,
  preparePortalMount: () => null,

  /* 是否可以变更树，必须开启 */
  supportsMutation: true,
  /* 树持久化，关闭 */
  supportsPersistence: false,
  /* 是否开启水合，未实现 ssr，关闭 */
  supportsHydration: false,
  /* 是否只有一个渲染器，关闭 */
  isPrimaryRenderer: false,

  /* 定时器相关 */
  noTimeout: -1,
  now: performance?.now ?? Date.now,
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
}

export const reconciler = Reconciler(hostConfig)
import { injectIntoDevTools } from '../devtool'

if (!isProduction) {
  injectIntoDevTools(reconciler)
}

export * from './create'
