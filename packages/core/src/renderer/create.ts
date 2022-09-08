import React, { startTransition } from 'react'
import type { TransitionTracingCallbacks, FiberRoot } from 'react-reconciler'
import { ConcurrentRoot } from 'react-reconciler/constants'
import { reconciler } from './index'
import { DevThrow } from '../utils'
import { attachInfo, detachInfo } from './utils'
import { defaultOnRecoverableError } from '../outside'
import { IContainer, Instance } from '../type'
import { isProduction, isBrowser } from '../constants'
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

  render(children: React.ReactNode, options: { sync?: boolean; concurrent?: boolean } = {}) {
    const root = this._internalRoot
    const { sync = false, concurrent = false } = options
    if (root === null) {
      return DevThrow(`Cannot update an unmounted root.`)
    }
    if (!this.rendered) {
      this.rendered = true
      if (++rendererCount === 1 && !isProduction && isBrowser) {
        proxyHackForDevTools()
      }
    }
    const update = () => {
      reconciler.updateContainer(children, root, null, null)
    }
    if (sync) {
      reconciler.flushSync(update, void 0)
    } else if (concurrent) {
      startTransition(update)
    } else {
      update()
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

      if (--rendererCount === 0 && !isProduction && isBrowser) {
        unProxyHackForDevTools()
      }
    } else {
      console.warn(`renderer is unmounted!`)
    }
  }
}

export function createEgreactRoot(containerNode: IContainer, options: CreateRootOptions = {}) {
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
