import { Reconciler } from 'react-reconciler'

import { getCanvas, findEgretAncestor, is, getActualInstance, throttle } from './utils'
import { findTargetByPosition } from './outside'
import { catalogueMap } from './Host/index'
import { IRenderInfo, Instance } from './type'
import { CONSTANTS } from './constants'

/**
 * @description dom px 和 egret 坐标值换算比例
 */
function calculateScale() {
  const canvas = getCanvas()
  const rect = canvas.getBoundingClientRect()
  return rect.width / egret.lifecycle.stage.stageWidth
}

const [storeOriginComputedStyle, getOriginComputedStyle] = (function () {
  var getComputedStyle: typeof window.getComputedStyle
  return [() => getComputedStyle || (getComputedStyle = window.getComputedStyle), () => getComputedStyle]
})()

const getEmptyCSSStyleSheet = (function () {
  var emptyCSSStyleSheet: ReturnType<typeof getComputedStyle>
  return () =>
    emptyCSSStyleSheet ||
    (emptyCSSStyleSheet = {
      ...getOriginComputedStyle()(document.createElement('div')),
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
    })
})()

// 记录最近的一个显示对象信息
let latestEgretRect = { w: 0, h: 0, x: 0, y: 0 }
/**
 * @description 挂载 getBoundingClientRect，给 react devtool 调用
 */
export function getBoundingClientRect(instance: Instance<egret.DisplayObject>) {
  const egretInstance = findEgretAncestor(instance)
  const canvasRect = getCanvas().getBoundingClientRect()
  if (!egretInstance) return canvasRect
  const point = egretInstance.localToGlobal(0, 0)
  // 因为 egret 中的坐标系比例与dom中不同，所以需要换算
  const scale = calculateScale()
  const x = point.x * scale + canvasRect.left
  const y = point.y * scale + canvasRect.top
  const width = egretInstance.width * scale
  const height = egretInstance.height * scale
  latestEgretRect = { w: instance.width, h: instance.height, x: instance.x, y: instance.y }
  return { x, y, width, height, left: x, top: y }
}

let isSelectedEgret = false
/**
 * @description 代理 window.getComputedStyle，使它也能计算某个函数的宽高大小
 * @link https://github.com/facebook/react/blob/29c2c633159cb2171bb04fe84b9caa09904388e8/packages/react-devtools-shared/src/backend/views/utils.js#L113
 */
function proxyGetComputedStyle() {
  storeOriginComputedStyle()
  window.getComputedStyle = function (el, pseudo) {
    if (Object.entries(catalogueMap).some(([n, catalogue]) => catalogue.__Class && el instanceof catalogue.__Class)) {
      isSelectedEgret = true
      return getEmptyCSSStyleSheet()
    } else {
      isSelectedEgret = false
      return getOriginComputedStyle().call(this, el, pseudo)
    }
  }
}
function unProxyGetComputedStyle() {
  window.getComputedStyle = getOriginComputedStyle()
}

const [storeOriginListeners, getOriginListeners] = (function () {
  var listeners: { addEventListener: typeof addEventListener; removeEventListener: typeof removeEventListener }
  return [
    () =>
      listeners ||
      (listeners = { addEventListener: window.addEventListener, removeEventListener: window.removeEventListener }),
    () => listeners,
  ]
})()

type EventHandler = EventListener | EventListenerObject

export type ProxyEventInfo = [
  // 前三个是事件参数，
  string,
  EventListener,
  (boolean | { capture?: boolean })?,
  EventListener?, // 参数是代理的事件处理
  any?, // 第五个放置其他信息
]

// 收集代理事件信息
const eventInfoCollection: ProxyEventInfo[] = []

/**
 * @description 找到相应的监听，判断条件 type,handle,capture 相同即为同个监听
 * @link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener#matching_event_listeners_for_removal
 */
export function findMatchEventIndex(
  [type1, handler1, options1]: ProxyEventInfo,
  collection = eventInfoCollection, // 此参数方便测试
) {
  return collection.findIndex(([type2, handler2, options2]) => {
    const capture1 = typeof options1 === 'boolean' ? options1 : options1?.capture ?? false
    const capture2 = typeof options2 === 'boolean' ? options2 : options2?.capture ?? false
    if (type1 === type2 && handler1 === handler2 && capture1 === capture2) {
      return true
    }
    return false
  })
}

/**
 * @description 找到相应的监听并提取出来
 */
export function extraMatchEvent(info: ProxyEventInfo): ProxyEventInfo | null {
  const index = findMatchEventIndex(info)
  if (index > -1) {
    return eventInfoCollection.splice(index, 1)[0]
  } else return null
}

let rafId: number | null = null

function specifiedShadowInfoForEgret() {
  const shadows = document.querySelectorAll('div[style^="z-index: 10000000;"]')
  for (let i = 0; i < shadows.length; i++) {
    const shadow = shadows[i] as HTMLDivElement
    if (i === 0) {
      shadow.style.display = 'block'
      const rectSpan = shadow.firstChild?.lastChild
      // 修改dom，显示之前记录的宽高轴
      if (isSelectedEgret && rectSpan)
        rectSpan.textContent = `w:${latestEgretRect.w} h:${latestEgretRect.h} x:${latestEgretRect.x} y:${latestEgretRect.y} (in egret)`
    } else shadow.style.display = 'none'
  }
  rafId = requestAnimationFrame(specifiedShadowInfoForEgret)
}
/**
 * @description 代理window监听器，目的是代理 react-devtool 添加的事件
 * @link https://github.com/facebook/react/blob/c3d7a7e3d72937443ef75b7e29335c98ad0f1424/packages/react-devtools-shared/src/backend/views/Highlighter/index.js#L41
 */
function proxyListener() {
  // 对 shadow 显示 egret 对象特殊化
  if (!rafId) {
    rafId = requestAnimationFrame(specifiedShadowInfoForEgret)
  }
  storeOriginListeners()
  window.addEventListener = function (type: string, listener: EventHandler, options?: boolean | { capture?: boolean }) {
    if (
      is.fun(listener) &&
      ['click', 'mousedown', 'mouseover', 'mouseup', 'pointerdown', 'pointerover', 'pointerup'].includes(type)
    ) {
      const proxyHandler = function (e: MouseEvent) {
        const { pageX: x, pageY: y } = e
        const r = getCanvas().getBoundingClientRect()
        r.x += window.scrollX
        r.y += window.scrollY
        // 判断点击点是否处于画布中
        let target: egret.DisplayObject | null = null
        if (x > r.x && x < r.x + r.width && y > r.y && y < r.y + r.height) {
          const scale = calculateScale()
          target = findTargetByPosition(egret.lifecycle.stage, (x - r.x) / scale, (y - r.y) / scale)
          // 模拟一个新的 event，目的是改变 target
          if (target) {
            e = {
              ...e,
              preventDefault: e.preventDefault.bind(e),
              stopPropagation: e.stopPropagation.bind(e),
              target: target as any,
            }
          }
        }
        listener.call(this, e)
      } as EventListener
      // 只有非相同的事件才被加入
      if (findMatchEventIndex([type, listener, options]) === -1) {
        getOriginListeners().addEventListener.call(window, type, proxyHandler, options)
        const info: ProxyEventInfo = [type, listener, options, proxyHandler]
        if (type === 'pointerover') {
          // 特殊处理，react devtool 没有监听 pointermove，但是进入画布的话，只有一次 pointerover
          // 为了鼠标移动就能判断，在 canvas 上监听 pointermove
          const throttlerProxyHandler = throttle(proxyHandler, 150)
          const canvas = getCanvas()
          canvas.addEventListener('pointermove', throttlerProxyHandler, options)
          // 保存一下最后这个参数
          info.push(throttlerProxyHandler)
        }
        eventInfoCollection.push(info)
      }
    } else {
      getOriginListeners().addEventListener.call(window, type, listener, options)
    }
  }

  window.removeEventListener = function (
    type: string,
    listener: EventHandler,
    options: boolean | { capture?: boolean } = false,
  ) {
    if (is.fun(listener)) {
      const info = extraMatchEvent([type, listener, options])
      if (info) {
        getOriginListeners().removeEventListener.call(window, type, info[3]!, options)
        if (type === 'pointerover' && info[4]) {
          getCanvas().removeEventListener('pointermove', info[4], options)
        }
      } else {
        getOriginListeners().removeEventListener.call(window, type, listener, options)
      }
    } else {
      getOriginListeners().removeEventListener.call(window, type, listener, options)
    }
  }
}

function unProxyListener() {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  window.addEventListener = getOriginListeners().addEventListener
  window.removeEventListener = getOriginListeners().removeEventListener
  while (eventInfoCollection.length) {
    const info = eventInfoCollection.pop()!
    // 移除代理
    window.removeEventListener(info[0], info[3] as EventHandler, info[2])
    // 使用原生重新挂载
    window.addEventListener(info[0], info[1], info[2])
  }
}

export function findFiberByHostInstance(instance: Instance) {
  return instance?.[CONSTANTS.INFO_KEY]?.fiber ?? null
}

/**
 * @description 兼容 devtool 用到的 dom 属性
 */
export function addCompatibleDomAttributes(instance: any) {
  if (is.obj(instance)) {
    // devtool need to get rect of element
    // https://github.com/facebook/react/blob/29c2c633159cb2171bb04fe84b9caa09904388e8/packages/react-devtools-shared/src/backend/views/utils.js#L108
    instance.getBoundingClientRect = () => getBoundingClientRect(instance)

    // https://github.com/facebook/react/blob/327e4a1f96fbb874001b17684fbb073046a84938/packages/react-devtools-shared/src/backend/views/Highlighter/Overlay.js#L193
    instance.nodeType = 1

    // https://github.com/facebook/react/blob/327e4a1f96fbb874001b17684fbb073046a84938/packages/react-devtools-shared/src/backend/views/Highlighter/Overlay.js#L233
    instance.nodeName = instance.__class__

    instance.ownerDocument = document
  }
}

export function deleteCompatibleDomAttributes(instance: any) {
  if (is.obj(instance)) {
    delete instance.getBoundingClientRect
    delete instance.nodeType
    delete instance.nodeName
    delete instance.ownerDocument
  }
}

import packageJson from '../package.json'
export function injectIntoDevTools(reconciler: Reconciler<any, any, any, any, any>) {
  reconciler.injectIntoDevTools({
    bundleType: 0,
    rendererPackageName: 'egreact',
    version: packageJson.version,
    findFiberByHostInstance,
  })
}

let isProxyDevTools = false
export function proxyHackForDevTools() {
  if (!isProxyDevTools) {
    proxyGetComputedStyle()
    proxyListener()
    isProxyDevTools = true
  }
}

export function unProxyHackForDevTools() {
  if (isProxyDevTools) {
    unProxyGetComputedStyle()
    unProxyListener()
    isProxyDevTools = false
  }
}

export function injectMemoizedProps(instance: Instance, info: IRenderInfo) {
  if (!info.fiber) return

  info.fiber.memoizedProps = {
    ...info.fiber.memoizedProps,
    [CONSTANTS.STATE_NODE_KEY]: instance,
    [CONSTANTS.TARGET_KEY]: getActualInstance(instance),
    [CONSTANTS.INFO_KEY]: instance[CONSTANTS.INFO_KEY],
    [CONSTANTS.FIBER_KEY]: info.fiber,
  }
  if (info.fiber.alternate && is.obj(info.fiber.alternate.memoizedProps)) {
    info.fiber.alternate.memoizedProps = {
      ...info.fiber.alternate.memoizedProps,
      [CONSTANTS.STATE_NODE_KEY]: instance,
      [CONSTANTS.TARGET_KEY]: getActualInstance(instance),
      [CONSTANTS.INFO_KEY]: instance[CONSTANTS.INFO_KEY],
      [CONSTANTS.FIBER_KEY]: info.fiber.alternate,
    }
  }
}
