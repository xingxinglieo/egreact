// 外部代码，免于测试
/**
 *
 * @copyright Copyright egret inject.
 */
export function findTargetByPosition(
  displayObject: egret.DisplayObject,
  stageX: number,
  stageY: number,
): egret.DisplayObject | null {
  if (!displayObject.visible) {
    return null
  }
  const matrix = displayObject.$getInvertedConcatenatedMatrix()
  const x = matrix.a * stageX + matrix.c * stageY + matrix.tx
  const y = matrix.b * stageX + matrix.d * stageY + matrix.ty
  const rect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect
  if (rect && !rect.contains(x, y)) {
    return null
  }
  if (this?.$mask && !displayObject.$mask.$hitTest(stageX, stageY)) {
    return null
  }
  const children = displayObject.$children
  let notTouchThrough = false
  if (children) {
    for (let index = children.length - 1; index >= 0; index--) {
      const child = children[index]
      if (child.$maskedObject) {
        continue
      }
      var target = findTargetByPosition(child, stageX, stageY)
      // @ts-ignore
      if (target && target.ispTouchThrough !== true) {
        notTouchThrough = true
        break
      }
    }
  }
  if (target) {
    return target
  }
  if (notTouchThrough) {
    return displayObject
  }
  return displayObject.$hitTest(stageX, stageY)
}

import {
  DiscreteEventPriority,
  ContinuousEventPriority,
  DefaultEventPriority,
} from 'react-reconciler/constants'

/**
 *
 * @copyright Copyright (c) Facebook, Inc. and its affiliates.
 * @link https://github.com/facebook/react/blob/12a738f1a87889bb5f7c4159641573fd04140664/packages/react-dom/src/events/ReactDOMEventListener.js#L410
 */
export function getEventPriority(domEventName: string) {
  switch (domEventName) {
    // Used by SimpleEventPlugin:
    case 'cancel':
    case 'click':
    case 'close':
    case 'contextmenu':
    case 'copy':
    case 'cut':
    case 'auxclick':
    case 'dblclick':
    case 'dragend':
    case 'dragstart':
    case 'drop':
    case 'focusin':
    case 'focusout':
    case 'input':
    case 'invalid':
    case 'keydown':
    case 'keypress':
    case 'keyup':
    case 'mousedown':
    case 'mouseup':
    case 'paste':
    case 'pause':
    case 'play':
    case 'pointercancel':
    case 'pointerdown':
    case 'pointerup':
    case 'ratechange':
    case 'reset':
    case 'resize':
    case 'seeked':
    case 'submit':
    case 'touchcancel':
    case 'touchend':
    case 'touchstart':
    case 'volumechange':
    // Used by polyfills:
    // eslint-disable-next-line no-fallthrough
    case 'change':
    case 'selectionchange':
    case 'textInput':
    case 'compositionstart':
    case 'compositionend':
    case 'compositionupdate':
    // Only enableCreateEventHandleAPI:
    // eslint-disable-next-line no-fallthrough
    case 'beforeblur':
    case 'afterblur':
    // Not used by React but could be by user code:
    // eslint-disable-next-line no-fallthrough
    case 'beforeinput':
    case 'blur':
    case 'fullscreenchange':
    case 'focus':
    case 'hashchange':
    case 'popstate':
    case 'select':
    case 'selectstart':
      return DiscreteEventPriority
    case 'drag':
    case 'dragenter':
    case 'dragexit':
    case 'dragleave':
    case 'dragover':
    case 'mousemove':
    case 'mouseout':
    case 'mouseover':
    case 'pointermove':
    case 'pointerout':
    case 'pointerover':
    case 'scroll':
    case 'toggle':
    case 'touchmove':
    case 'wheel':
    // Not used by React but could be by user code:
    // eslint-disable-next-line no-fallthrough
    case 'mouseenter':
    case 'mouseleave':
    case 'pointerenter':
    case 'pointerleave':
      return ContinuousEventPriority
    // case 'message': {
    //   // We might be in the Scheduler callback.
    //   // Eventually this mechanism will be replaced by a check
    //   // of the current priority on the native scheduler.
    //   const schedulerPriority = getCurrentSchedulerPriorityLevel();
    //   switch (schedulerPriority) {
    //     case ImmediateSchedulerPriority:
    //       return DiscreteEventPriority;
    //     case UserBlockingSchedulerPriority:
    //       return ContinuousEventPriority;
    //     case NormalSchedulerPriority:
    //     case LowSchedulerPriority:
    //       // TODO: Handle LowSchedulerPriority, somehow. Maybe the same lane as hydration.
    //       return DefaultEventPriority;
    //     case IdleSchedulerPriority:
    //       return IdleEventPriority;
    //     default:
    //       return DefaultEventPriority;
    //   }
    // }
    default:
      return DefaultEventPriority
  }
}

/* global reportError */
export const defaultOnRecoverableError =
  typeof reportError === 'function'
    ? // In modern browsers, reportError will dispatch an error event,
      // emulating an uncaught JavaScript error.
      reportError
    : (error: any) => {
        // In older browsers and test environments, fallback to console.error.
        // eslint-disable-next-line react-internal/no-production-logging
        console['error'](error)
      }