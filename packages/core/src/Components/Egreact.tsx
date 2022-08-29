import React, { useEffect, useRef, useState, useImperativeHandle, Context } from 'react'
import {
  hyphenate,
  collectContextsFromDom,
  ContextProviders,
  ContextListeners,
  is,
  CallBackArray,
  ErrorBoundary,
} from '../utils'
import { createEgreactRoot, EgreactRoot } from '../renderer'
import { RootOptions } from 'react-dom/client'

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

export type RenderMode = 'sync' | 'concurrent' | 'normal'

type Props = {
  [key in typeof DomEgretPropsName[number]]?: string
} & {
  scaleMode?:
    | 'showAll'
    | 'noScale'
    | 'noBorder'
    | 'exactFit'
    | 'fixedWidth'
    | 'fixedHeight'
    | 'fixedNarrow'
    | 'fixedWide'
  orientation?: 'auto' | 'portrait' | 'landscape' | 'landscapeFlipped'
  showFps?: boolean | `${boolean}`
  showLog?: boolean | `${boolean}`
  showPaintRect?: boolean | `${boolean}`
} & {
  egretOptions?: egret.runEgretOptions

  rendererOptions?: RootOptions

  container?: egret.DisplayObjectContainer
  // 是否执行 runEgret
  runEgret?: boolean
  // 是否渲染 egret 的 canvas div 容器
  renderDom?: boolean
  // boolean: 是否从dom中提取context, 为 true 时 renderDom 必须为 true, 从渲染的 dom 向上搜寻;
  // Context: 直接传入 Context ; Html: 从传入的 dom 向上搜寻;
  contextsFrom?: boolean | React.Context<any>[] | HTMLElement
  // 渲染模式
  mode?: RenderMode
} & JSX.IntrinsicElements['div']

interface EgreactRef {
  container: egret.DisplayObjectContainer
  root: EgreactRoot
  dom: HTMLDivElement
  contexts: Context<any>[]
}

const entryClass = '__Main'
// let mountedCount = 0

function hyphenateEgretConfig(p: any) {
  return Object.keys(p).reduce((obj, key) => {
    // egretProps 转为data-中划线连接
    DomEgretPropsName.includes(key as any) ? (obj['data-' + hyphenate(key)] = p[key]) : (obj[key] = p[key])
    return obj
  }, {} as JSX.IntrinsicElements['div'])
}

export const Egreact = React.forwardRef<EgreactRef, Props>(
  (
    {
      children,
      egretOptions = {},
      rendererOptions = {},
      container,
      contextsFrom,
      runEgret,
      renderDom,
      mode = 'normal',
      ...otherProps
    },
    ref,
  ) => {
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
    const domProps = hyphenateEgretConfig(otherProps)
    const containerInstance = useRef<egret.DisplayObjectContainer>(container!)
    const values = useRef(new CallBackArray())
    const [contexts, setContexts] = useState<Context<any>[]>([])
    const [mounted, setMounted] = useState(false)
    const egreactRoot = useRef<EgreactRoot>(null)

    useEffect(() => {
      if (runEgret) {
        window[entryClass] = egret.DisplayObjectContainer
        egret.runEgret(egretOptions)
      }

      if (container) {
        containerInstance.current = container
      } else {
        containerInstance.current = new egret.DisplayObjectContainer()
        egret.lifecycle.stage.addChild(containerInstance.current)
      }

      if (contextsFrom === true) {
        setContexts(collectContextsFromDom(divRef.current))
      } else if (contextsFrom instanceof HTMLElement) {
        setContexts(collectContextsFromDom(contextsFrom))
      } else if (is.arr(contextsFrom)) {
        setContexts(contextsFrom)
      }

      setMounted(true)

      return () => {
        egreactRoot.current.unmount()
      }
    }, [])

    const [error, setError] = React.useState<Error | null>(null)
    if (error) throw error
    useEffect(() => {
      if (mounted) {
        if (!egreactRoot.current) {
          egreactRoot.current = createEgreactRoot(containerInstance.current, rendererOptions)
        }

        egreactRoot.current.render(
          contextsFrom === false ? (
            <ErrorBoundary set={setError}>{children}</ErrorBoundary>
          ) : (
            <ErrorBoundary set={setError}>
              <ContextProviders contexts={contexts} values={values.current}>
                {children}
              </ContextProviders>
            </ErrorBoundary>
          ),
          { sync: { sync: true }, concurrent: { concurrent: true } }[mode],
        )
      }
    })

    useImperativeHandle(ref, () => ({
      container: containerInstance.current,
      root: egreactRoot.current,
      dom: divRef.current,
      contexts,
    }))

    return (
      <>
        {contextsFrom === false ? null : <ContextListeners contexts={contexts} values={values.current} />}
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
  },
)
