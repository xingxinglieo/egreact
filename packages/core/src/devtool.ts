import { getCanvas, findEgretAncestor } from './utils'
import { catalogueMap } from './Host/index'
import { throttle } from 'lodash'
import { Instance } from './type'
function caculateScale() {
  return (
    // document.body.clientHeight / egret.lifecycle.stage.stageHeight
    Math.ceil(+(document.body.clientWidth / egret.lifecycle.stage.stageWidth).toFixed(3) * 100) /
    100
  )
}

const getComputedStyle = window.getComputedStyle
const emptyCSSStyleSheet = {
  ...getComputedStyle(document.createElement('div')),
  ...{
    borderLeftWidth: '0',
    borderRightWidth: '0',
    borderTopWidth: '0',
    borderBottomWidth: '0',
    marginLeft: '0',
    marginRight: '0',
    marginTop: '0',
    marginBottom: '0',
    paddingLeft: '0',
    paddingRight: '0',
    paddingTop: '0',
    paddingBottom: '0',
  },
}
export function getBoundingClientRect(instance: Instance<unknown>) {
  const egretInstance = findEgretAncestor(instance)
  const canvasRect = getCanvas().getBoundingClientRect()
  const point = egretInstance.localToGlobal(0, 0)
  const scale = caculateScale()
  const x = point.x * scale + canvasRect.left
  const y = point.y * scale + canvasRect.top
  const width = egretInstance.width * scale
  const height = egretInstance.height * scale
  return { x, y, width, height, left: x, top: y }
}

// https://github.com/facebook/react/blob/29c2c633159cb2171bb04fe84b9caa09904388e8/packages/react-devtools-shared/src/backend/views/utils.js#L113
export function proxyGetComputedStyle() {
  window.getComputedStyle = function (el, pseudo) {
    if (
      Object.entries(catalogueMap).some(
        ([n, catalogue]) => catalogue.__Class && el instanceof catalogue.__Class,
      )
    ) {
      return emptyCSSStyleSheet
    } else {
      return getComputedStyle.call(this, el, pseudo)
    }
  }
}
export function unProxyGetComputedStyle() {
  window.getComputedStyle = getComputedStyle
}

const addEventListener = window.addEventListener
const removeEventListener = window.removeEventListener
type EventHandler = Parameters<typeof addEventListener>[1]

// 前三个是事件参数，最后一个是代理的事件处理
type ProxyEventInfo = [string, EventHandler, boolean | { capture: boolean }, EventHandler?, any?]
const eventInfoCollection: ProxyEventInfo[] = []

function findMatchEventIndex([type1, handler1, options1]: ProxyEventInfo) {
  return eventInfoCollection.findIndex(([type2, handler2, options2]) => {
    const capture1 = typeof options1 === 'boolean' ? options1 : options1?.capture ?? false
    const capture2 = typeof options2 === 'boolean' ? options2 : options2?.capture ?? false
    if (type1 === type2 && handler1 === handler2 && capture1 === capture2) {
      return true
    }
    return false
  })
}
function extreMatchEvent(info: ProxyEventInfo): ProxyEventInfo | null {
  const index = findMatchEventIndex(info)
  if (index > -1) {
    return eventInfoCollection.splice(index, 1)[0]
  } else return null
}

function findTargetByPosition(
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
  let notpTouchThrough = false
  if (children) {
    for (let index = children.length - 1; index >= 0; index--) {
      const child = children[index]
      if (child.$maskedObject) {
        continue
      }
      var target = findTargetByPosition(child, stageX, stageY)
      // @ts-ignore
      if (target && target.ispTouchThrough !== true) {
        notpTouchThrough = true
        break
      }
    }
  }
  if (target) {
    return target
  }
  if (notpTouchThrough) {
    return displayObject
  }
  return displayObject.$hitTest(stageX, stageY)
}
export function proxyListener() {
  window.addEventListener = function (type, listener, options = false) {
    if (
      [
        'click',
        'mousedown',
        'mouseover',
        'mouseup',
        'pointerdown',
        'pointerover',
        'pointerup',
      ].includes(type)
    ) {
      const proxyHandler: EventHandler = function (e: MouseEvent) {
        const { pageX: x, pageY: y } = e
        const r = getCanvas().getBoundingClientRect()
        r.x += window.scrollX
        r.y += window.scrollY
        if (x > r.x && x < r.x + r.width && y > r.y && y < r.y + r.height) {
          const scale = caculateScale()
          const target = findTargetByPosition(
            egret.lifecycle.stage,
            (x - r.x) / scale,
            (y - r.y) / scale,
          ) as any
          e = {
            ...e,
            preventDefault: e.preventDefault.bind(e),
            stopPropagation: e.stopPropagation.bind(e),
            target,
          }
        }
        if (e.target) {
          listener.call(this, e)
        }
      }
      if (findMatchEventIndex([type, listener, options]) === -1) {
        addEventListener.call(window, type, proxyHandler, options)
        const info: ProxyEventInfo = [type, listener, options, proxyHandler]
        if (type === 'pointerover') {
          const throllerProxyHandler = throttle(proxyHandler, 300)
          const canvas = getCanvas()
          canvas.addEventListener('pointermove', throllerProxyHandler, options)
          info.push(throllerProxyHandler)
        }
        eventInfoCollection.push(info)
      }
    } else {
      addEventListener.call(window, type, listener, options)
    }
  }

  window.removeEventListener = function (type, listener, options = false) {
    const info = extreMatchEvent([type, listener, options])
    if (info) {
      removeEventListener.call(window, type, info[3], options)
      if (type === 'pointerover' && info[4]) {
        getCanvas().removeEventListener('pointermove', info[4], options)
      }
    } else {
      removeEventListener.call(window, type, listener, options)
    }
  }
}
export function unProxyListener() {
  window.addEventListener = addEventListener
  window.removeEventListener = removeEventListener
  while (eventInfoCollection.length) {
    const info = eventInfoCollection.pop()
    window.removeEventListener(info[0], info[3] as EventHandler, info[2])
    window.addEventListener(info[0], info[1], info[2])
  }
}
