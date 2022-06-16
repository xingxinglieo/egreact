/*
https://github.com/pmndrs/react-three-fiber/blob/master/packages/fiber/src/core/renderer.ts

MIT License

Copyright (c) 2020 Paul Henschel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
import Reconciler from 'react-reconciler'
import { catalogueMap } from './Host/index'
import { LegacyRoot } from 'react-reconciler/constants'
import RenderString from './Host/custom/RenderString'
import {
  getActualInstance,
  applyProps,
  diffProps,
  DiffSet,
  is,
  findEgretAncestor,
  // isEvent,
  affixInfo,
  reduceKeysToTarget,
} from './utils'
import type { IContainer, IElementProps, Instance } from './type'

type HostConfig = Reconciler.HostConfig<
  string, // Type 元素标签
  IElementProps, // Props 传入元素的 props
  Instance<IContainer>, // Container 顶层的容器
  Instance<any>, // Instance 创建的 egret实例
  Instance<RenderString>, // TextInstance 文本实例
  any, // SuspenseInstance
  any, // HydratableInstance
  any, // PublicInstance
  any, // HostContext
  DiffSet, // UpdatePayload [reconstruct,diffSet]
  any, // ChildSetter
  any, // TimeoutHandle
  any // NoTimeout
>

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
  const instance: Instance = affixInfo(new instanceProp.__Class(...args, props), {
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
    instance.__renderInfo.memoizedProps = { ...props }
  }
  return instance
}

const appendChild: HostConfig['appendChild'] = function (parentInstance, child) {
  // if (
  //   !child.__renderInfo.attach &&
  //   parentInstance instanceof eui.Scroller &&
  //   !parentInstance.viewport
  // ) {
  //   child.__renderInfo.attach = 'viewport'
  // }
  child.__renderInfo.parent = parentInstance
  const attach = child.__renderInfo.attach
  const isAttach = is.str(attach)
  if (isAttach) {
    // const [target, targetKey, keys] = reduceKeysToTarget(parent, attach)
    if (is.fun(child.attach)) {
      // const detach = child.attach({
      //   newValue: child,
      //   oldValue: FLAG.PROP_MOUNT,
      //   instance: parent,
      //   target,
      //   targetKey,
      //   keys,
      // })
      // if (is.fun(detach)) {
      //   child.__renderInfo.memoizedReset['attach'] = detach
      // }
    } else {
      const attach = child.__renderInfo.attach
      const [target, targetKey] = reduceKeysToTarget(parentInstance, attach)
      child.__renderInfo.targetInfo = [target, targetKey, target[targetKey]]
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
  if (child.__renderInfo.mountedApplyProps) {
    applyProps(child, child.__renderInfo.memoizedProps)
  }
}
const insertBefore: HostConfig['insertBefore'] = function (
  parentInstance: Instance<IContainer>,
  child: Instance,
  beforeChild: Instance,
) {
  if (beforeChild.__renderInfo.targetInfo)
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
    for (let [_key, reset] of Object.entries(child.__renderInfo.memoizedResetter)) {
      // if (isEvent(key))
      reset(true)
    }

    if (child.__renderInfo.targetInfo) {
      const [target, targetKey, defaultValue] = child.__renderInfo.targetInfo
      target[targetKey] = defaultValue
    } else if (child instanceof RenderString) {
      child.text = ''
      child.setParent(null)
    } else {
      parentInstance.removeChild(getActualInstance(child))
    }
  }
}

export const hostConfig: HostConfig = {
  createInstance,
  createTextInstance: (text) => {
    const instance = new RenderString(text)
    return affixInfo(instance)
  },
  // 用于移除实例后的清理引用
  // @ts-ignore 在 detachDeletedInstance Reconciler 类型没有定义
  detachDeletedInstance: (instance: Instance) => {
    if (instance.__renderInfo) {
      delete instance.__renderInfo
    }
  },
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
  commitUpdate(instance, diff, _type: string, oldProps, newProps) {
    if (diff.changes.length) applyProps(instance, diff)

    if (oldProps.attach !== newProps.attach) {
      if (oldProps.attach === undefined || newProps.attach === undefined) {
        throw `please keep prop \`attach\` state of existence, because it determined how to add into parent instance when this instance created`
      }

      const attach = newProps.attach
      const parent = instance.__renderInfo.parent
      instance.__renderInfo.attach = attach

      const [target, targetKey, keys] = reduceKeysToTarget(parent, attach)
      if (is.fun(instance.attach)) {
        // instance.__renderInfo.memoizedReset['attach'](false)
        // const detach = instance.attach({
        //   newValue: instance,
        //   oldValue: instance,
        //   instance: parent,
        //   target,
        //   targetKey,
        //   keys,
        // })
        // if (is.fun(detach)) {
        //   instance.__renderInfo.memoizedReset['attach'] = detach
        // }
      } else {
        // 清除前一个 attch 副作用
        const [otarget, otargetKey, defaultValue] = instance.__renderInfo.targetInfo
        otarget[otargetKey] = defaultValue

        instance.__renderInfo.targetInfo = [target, targetKey, target[targetKey]]
        target[targetKey] = getActualInstance(instance)
      }
    }
  },
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

const reconciler = Reconciler(hostConfig)

import packagejson from '../package.json'
export function findFiberByHostInstance(instance: Instance) {
  return instance?.__renderInfo?.fiber ?? null
}
if (__DEV__) {
  reconciler.injectIntoDevTools({
    bundleType: 0,
    rendererPackageName: 'egreact',
    version: packagejson.version,
    findFiberByHostInstance,
  })
}
export function createRenderer(containerNode: egret.DisplayObjectContainer) {
  let fiberRoot
  return function render(child: React.ReactNode) {
    // We must do this only once
    if (!fiberRoot) {
      fiberRoot = reconciler.createContainer(
        affixInfo(containerNode),
        LegacyRoot,
        null,
        false,
        null,
        '',
        console.error,
        null,
      )
    }
    reconciler.updateContainer(child, fiberRoot, null)
    return fiberRoot
  }
}
