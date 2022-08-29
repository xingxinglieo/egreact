import React, { useEffect, useRef, useState, startTransition, useMemo } from 'react'
import { createEgreactRoot, EgreactRoot } from '../renderer/create'
import { ArrayContainer } from '../Host/custom/ArrayContainer'

interface ItemRenderer extends eui.ItemRenderer {
  element: React.ReactNode
}

export const ItemRendererClass: React.FC<{
  children: (data: any, instance: eui.ItemRenderer) => React.ReactNode
  useRenderer?: boolean
  concurrent?: boolean
}> = ({ children, concurrent = true, useRenderer = true }) => {
  const [flag, setFlag] = useState(0)
  const _update = () => setFlag((i) => i + 1)
  const update = () => (concurrent ? startTransition(_update) : _update())

  const [itemRendererCollection] = useState(() => new Set<ItemRenderer>())

  const elementRef = useRef(children)
  elementRef.current = children

  const [ItemRendererClass] = useState(() => {
    return class ItemRenderer extends eui.ItemRenderer {
      root: EgreactRoot
      element: React.ReactNode
      constructor() {
        super()
        if (useRenderer) this.root = createEgreactRoot(new ArrayContainer())
        this.addEventListener(
          egret.Event.REMOVED_FROM_STAGE,
          () => (useRenderer ? this.root.unmount() : itemRendererCollection.delete(this)),
          this,
        )
      }
      dataChanged() {
        const oldNode = elementRef.current.call(this, this.data, this)
        this.element = React.cloneElement(oldNode, {
          object: this,
          ...(oldNode.key === null ? { key: this.$hashCode } : {}),
        })
        if (useRenderer) this.root.render(this.element, concurrent ? { concurrent: true } : {})
        else {
          itemRendererCollection.add(this)
          update()
        }
      }
    }
  })

  useEffect(() => () => itemRendererCollection.clear(), [])

  const List = React.memo(
    function List(props: { flag: number }) {
      return <>{[...itemRendererCollection].map((itemRenderer, i) => itemRenderer.element)}</>
    },
    ({ flag: oldFlag }, { flag: newFlag }) => oldFlag === newFlag,
  )

  return (
    <>
      <primitive object={ItemRendererClass} attach="itemRenderer"></primitive>
      <arrayContainer attach="__list">{!useRenderer && <List flag={flag} />}</arrayContainer>
    </>
  )
}
