import React, { startTransition, useEffect, useRef, useState } from 'react'
import { createEgreactRoot } from '../renderer/create'
import { ArrayContainer } from '../Host/custom/ArrayContainer'

interface ItemRendererClassProps {
  children: (data: any, instance: eui.ItemRenderer) => React.ReactElement
  useRenderer?: boolean // 是否使用渲染器渲染，否则在原渲染树中渲染
  concurrent?: boolean // 是否使用 concurrent 模式更新
  sync?: boolean // 是否使用同步模式更新
  updateChildren?: boolean // 渲染器渲染时是否更新 children
}

interface ItemRenderer extends eui.IItemRenderer {
  element: React.ReactElement
}

export function ItemRendererClass({
  children,
  concurrent = true,
  useRenderer = true,
  sync = false,
  updateChildren = false,
}: ItemRendererClassProps) {
  const [, setFlag] = useState(0)
  const _update = () => setFlag((flag) => flag + 1)
  const update = concurrent ? () => startTransition(_update) : _update

  const elementRef = useRef(children)
  elementRef.current = children

  const set = useRef(new Set<ItemRenderer>()).current

  const firstItemRendered = useRef(false)
  const [ItemRendererClass] = useState(
    () =>
      class ItemRenderer extends eui.ItemRenderer {
        root = (useRenderer ? createEgreactRoot(new ArrayContainer()) : null)!
        element: React.ReactElement = (<eui-group />)
        constructor() {
          super()
          set.add(this)
          this.addEventListener(
            egret.Event.REMOVED_FROM_STAGE,
            () => {
              if (useRenderer) this.root.unmount()
              set.delete(this)
            },
            this,
          )
        }
        dataChanged() {
          const newNode = elementRef.current(this.data, this)
          this.element = React.cloneElement(newNode, {
            object: this,
            ...(newNode.key === null ? { key: this.$hashCode } : {}),
          })
          /* 第一个渲染项的第一次渲染必须开启 sync 否则会影响 eui.DataGroup 对于高度的测量 */
          const isSync = !firstItemRendered.current || sync
          if (useRenderer) this.root.render(this.element, { sync: isSync, concurrent })
          else update()
        }
      },
  )

  useEffect(() => {
    // @ts-ignore
    if (useRenderer && updateChildren) for (let renderer of set) renderer.dataChanged()
  }, [updateChildren, children, set])

  useEffect(() => () => set.clear(), [])

  return (
    <>
      <primitive object={ItemRendererClass} attach="itemRenderer"></primitive>
      {!useRenderer && <arrayContainer attach="__list">{[...set].map((_) => _.element)}</arrayContainer>}
    </>
  )
}
