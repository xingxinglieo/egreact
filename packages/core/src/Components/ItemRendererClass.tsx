import React, { startTransition, useRef, useState } from 'react'
import { createEgreactRoot } from '../renderer/create'
import { ArrayContainer } from '../Host/custom/ArrayContainer'

interface ItemRendererClassProps {
  children: (data, instance: eui.ItemRenderer) => React.ReactElement
  useRenderer?: boolean
  concurrent?: boolean
}

interface ItemRenderer extends eui.IItemRenderer {
  element: React.ReactElement
}

export function ItemRendererClass({ children, concurrent = true, useRenderer = true }: ItemRendererClassProps) {
  const [, setFlag] = useState(0)
  const _update = () => setFlag((flag) => flag + 1)
  const update = concurrent ? () => startTransition(_update) : _update
  
  const elementRef = useRef(children)
  elementRef.current = children
  
  const set = useRef(new Set<ItemRenderer>()).current

  const [ItemRendererClass] = useState(
    () =>
      class ItemRenderer extends eui.ItemRenderer {
        root = useRenderer ? createEgreactRoot(new ArrayContainer()) : null
        element: React.ReactElement
        constructor() {
          super()
          if (useRenderer) this.addEventListener(egret.Event.REMOVED_FROM_STAGE, () => this.root.unmount(), this)
        }
        dataChanged() {
          const newNode = elementRef.current(this.data, this)
          this.element = React.cloneElement(newNode, {
            object: this,
            ...(newNode.key === null ? { key: this.$hashCode } : {}),
          })
          if (useRenderer) this.root.render(this.element, { concurrent })
          else set.add(this) && update()
        }
      },
  )

  return (
    <>
      <primitive object={ItemRendererClass} attach="itemRenderer"></primitive>
      {!useRenderer && <arrayContainer attach="__list">{[...set].map((_) => _.element)}</arrayContainer>}
    </>
  )
}
