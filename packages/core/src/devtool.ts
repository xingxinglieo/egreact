import { getCanvas, findEgretAncestor } from './utils'
import { findTargetByPosition } from './outside'
import { catalogueMap } from './Host/index'
import { throttle } from 'lodash'
import { Instance } from './type'

/**
 * @description dom px 和 egret 坐标值换算比例
 */
function caculateScale() {
  return (
    // TODO: showAll 模式有问题，需要更准确的公式
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

/**
 * @description 挂载 getBoundingClientRect，给 react devtool 调用
 */
export function getBoundingClientRect(instance: Instance<unknown>) {
  const egretInstance = findEgretAncestor(instance)
  const canvasRect = getCanvas().getBoundingClientRect()
  const point = egretInstance.localToGlobal(0, 0)
  // 因为 egret 中的坐标系比例与dom中不同，所以需要换算
  const scale = caculateScale()
  const x = point.x * scale + canvasRect.left
  const y = point.y * scale + canvasRect.top
  const width = egretInstance.width * scale
  const height = egretInstance.height * scale
  return { x, y, width, height, left: x, top: y }
}

/**
 * @description 代理 window.getComputedStyle，使它也能计算某个函数的宽高大小
 * @link https://github.com/facebook/react/blob/29c2c633159cb2171bb04fe84b9caa09904388e8/packages/react-devtools-shared/src/backend/views/utils.js#L113
 */
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

export type ProxyEventInfo = [
  // 前三个是事件参数，
  string,
  EventHandler,
  (boolean | { capture?: boolean })?,
  EventHandler?, // 参数是代理的事件处理
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

/**
 * @description 代理window监听器，目的是代理 react-devtool 添加的事件
 * @link https://github.com/facebook/react/blob/c3d7a7e3d72937443ef75b7e29335c98ad0f1424/packages/react-devtools-shared/src/backend/views/Highlighter/index.js#L41
 */
export function proxyListener() {
  window.addEventListener = function (
    type: string,
    listener: (event: Event) => void,
    options?: boolean | { capture?: boolean },
  ) {
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
        // 判断点击点是否处于画布中
        if (x > r.x && x < r.x + r.width && y > r.y && y < r.y + r.height) {
          const scale = caculateScale()
          const target = findTargetByPosition(
            egret.lifecycle.stage,
            (x - r.x) / scale,
            (y - r.y) / scale,
          ) as any
          // 模拟一个新的 event，目的是改变 target
          e = {
            ...e,
            preventDefault: e.preventDefault.bind(e),
            stopPropagation: e.stopPropagation.bind(e),
            target,
          }
        }
        listener.call(this, e)
      }
      // 只有非相同的事件才被加入
      if (findMatchEventIndex([type, listener, options]) === -1) {
        addEventListener.call(window, type, proxyHandler, options)
        const info: ProxyEventInfo = [type, listener, options, proxyHandler]
        if (type === 'pointerover') {
          // 特殊处理，react devtool 没有监听 pointermove，但是进入画布的话，只有一次 pointerover
          // 为了鼠标移动就能判断，在 canvas 上监听 pointermove
          const throllerProxyHandler = throttle(proxyHandler, 300)
          const canvas = getCanvas()
          canvas.addEventListener('pointermove', throllerProxyHandler, options)
          // 保存一下最后这个参数
          info.push(throllerProxyHandler)
        }
        eventInfoCollection.push(info)
      }
    } else {
      addEventListener.call(window, type, listener, options)
    }
  }

  window.removeEventListener = function (type, listener, options = false) {
    const info = extraMatchEvent([type, listener, options])
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
    // 移除代理
    window.removeEventListener(info[0], info[3] as EventHandler, info[2])
    // 使用原生重新挂载
    window.addEventListener(info[0], info[1], info[2])
  }
}
