import React from 'react'
import type { TransitionTracingCallbacks, FiberRoot } from 'react-reconciler'
import { ConcurrentRoot } from 'react-reconciler/constants'
import { reconciler } from './index'
import { attachInfo, detachInfo, DevThrow } from '../utils'
import { defaultOnRecoverableError } from '../outside'
import { Instance } from '../type'
import { isProduction } from '../constants'
import { proxyHackForDevTools, unProxyHackForDevTools } from '../devtool'

export type CreateRootOptions = {
  unstable_strictMode?: boolean
  unstable_concurrentUpdatesByDefault?: boolean
  identifierPrefix?: string
  onRecoverableError?: (error: any) => void
  transitionCallbacks?: TransitionTracingCallbacks
}

let rendererCount = 0
export class EgreactRoot {
  public rendered = false
  constructor(private _internalRoot: FiberRoot) {}

  render(children: React.ReactNode, options: { sync?: boolean } = {}) {
    const root = this._internalRoot
    const { sync = false } = options
    if (root === null) {
      return DevThrow(`Cannot update an unmounted root.`)
    }
    if (!this.rendered) {
      this.rendered = true
      if (++rendererCount === 1 && !isProduction) {
        proxyHackForDevTools()
      }
    }
    if (sync) {
      reconciler.flushSync(() => {
        reconciler.updateContainer(children, root, null, null)
      }, void 0)
    } else {
      reconciler.updateContainer(children, root, null, null)
    }
  }
  unmount() {
    const root = this._internalRoot
    if (root !== null) {
      const container = root.containerInfo
      this._internalRoot = null
      reconciler.flushSync(() => {
        reconciler.updateContainer(null, root, null, null)
      }, void 0)
      detachInfo(container)

      if (--rendererCount === 0 && !isProduction) {
        unProxyHackForDevTools()
      }
    }
  }
}

export function createEgreactRoot(containerNode: egret.DisplayObjectContainer, options: CreateRootOptions = {}) {
  let isStrictMode = false
  let concurrentUpdatesByDefaultOverride = false
  let identifierPrefix = ''
  let onRecoverableError = defaultOnRecoverableError
  let transitionCallbacks = null

  if (options.unstable_strictMode === true) {
    isStrictMode = true
  }
  if (options.unstable_concurrentUpdatesByDefault === true) {
    concurrentUpdatesByDefaultOverride = true
  }
  if (options.identifierPrefix !== undefined) {
    identifierPrefix = options.identifierPrefix
  }
  if (options.onRecoverableError !== undefined) {
    onRecoverableError = options.onRecoverableError
  }
  if (options.transitionCallbacks !== undefined) {
    transitionCallbacks = options.transitionCallbacks
  }

  const root = reconciler.createContainer(
    containerNode as Instance<typeof containerNode>,
    ConcurrentRoot,
    null,
    isStrictMode,
    concurrentUpdatesByDefaultOverride,
    identifierPrefix,
    onRecoverableError,
    transitionCallbacks,
  )
  attachInfo(containerNode, { fiber: root, container: true })
  return new EgreactRoot(root)
}
