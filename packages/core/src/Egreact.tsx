import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import {
  hyphenate,
  collectContextsFromDom,
  ContextProviders,
  ContextListeners,
  is,
  CallBackArray,
  ErrorBoundary,
} from './utils'
import { createRenderer } from './renderer'

// 单独拿出来用于提示
const DomEgretPropsName = [
  'orientation',
  'scaleMode',
  'frameRate',
  'contentWidth',
  'contentHeight',
  'multiFingered',
  'showFps',
  'showLog',
  'showPaintRect',
  'showFpsStyle',
] as const
type Props = {
  [key in typeof DomEgretPropsName[number]]?: string
} & {
  options?: egret.runEgretOptions

  container?: egret.DisplayObjectContainer

  // 是否执行 runEgret
  runEgret?: boolean

  // 是否渲染 egret 的 canvas div 容器
  renderDom?: boolean

  // boolean: 是否从dom中提取context, 为 true 时 renderDom 必须为 ture;
  // Context: 直接传入 Context ; Html: 从 dom 向上搜寻;
  contextsFrom?: boolean | React.Context<any>[] | HTMLElement
} & JSX.IntrinsicElements['div']
const entryClass = '__Main'

export default function Egreact({
  children,
  options = {},
  container,
  contextsFrom,
  runEgret,
  renderDom,
  ...otherProps
}: Props) {
  if (container) {
    if (renderDom === undefined) renderDom = false
    if (runEgret === undefined) runEgret = false
  } else {
    if (renderDom === undefined) renderDom = true
    if (runEgret === undefined) runEgret = true
  }
  if (contextsFrom === undefined && renderDom) {
    contextsFrom = true
  }

  const divRef = useRef<HTMLDivElement>(null!)
  const domProps = useMemo(
    () =>
      Object.keys(otherProps).reduce((obj, key) => {
        // egretProps 转为data-中划线连接
        DomEgretPropsName.includes(key as any)
          ? (obj['data-' + hyphenate(key)] = otherProps[key])
          : (obj[key] = otherProps[key])
        return obj
      }, {} as JSX.IntrinsicElements['div']),
    [],
  )
  const containerInstance = useRef<egret.DisplayObjectContainer>(container!)
  const values = useRef(new CallBackArray())
  const [contexts, setContexts] = useState([])
  const [mouted, setMouted] = useState(false)
  useEffect(() => {
    if (runEgret) {
      window[entryClass] = egret.DisplayObjectContainer
      egret.runEgret(options)
    }
    if (container) {
      containerInstance.current = container
    } else containerInstance.current = egret.lifecycle.stage
    if (contextsFrom === true) {
      setContexts(collectContextsFromDom(divRef.current))
    } else if (contextsFrom instanceof HTMLElement) {
      setContexts(collectContextsFromDom(contextsFrom))
    } else if (is.arr(contextsFrom)) {
      setContexts(contextsFrom)
    }
    setMouted(true)
  }, [])

  const render = useRef<(child: ReactNode) => any>(null)
  const [error, setError] = React.useState<any>(false)
  if (error) throw error
  useEffect(() => {
    if (mouted) {
      if (!render.current) {
        render.current = createRenderer(containerInstance.current)
      }
      render.current(
        contextsFrom === false ? (
          children
        ) : (
          <ErrorBoundary set={setError}>
            <ContextProviders contexts={contexts} values={values.current}>
              {children}
            </ContextProviders>
          </ErrorBoundary>
        ),
      )
    }
  })
  return (
    <>
      {contextsFrom === false ? null : (
        <ContextListeners contexts={contexts} values={values.current} />
      )}
      {renderDom ? (
        <div
          ref={divRef}
          style={{
            width: '100%',
            height: '100%',
            margin: 'auto',
          }}
          data-entry-class={entryClass}
          {...domProps}
          className={'egret-player ' + (domProps.className || '')}></div>
      ) : null}
    </>
  )
}
