// eui bug 测不到 list 覆盖率
// Todo: 剔除免除测试
import { ItemRendererClass } from '../../src/Components'
import { createEgreactRoot } from '../../src/renderer'
import React, { createRef } from 'react'
import { ArrayContainer } from '../../src/Host/custom/ArrayContainer'

describe('ItemRendererClass', () => {
  it('should render', async () => {
    const data1 = new eui.ArrayCollection(['1', '2', '3', '1', '2', '3', '1', '2', '3', '1', '2', '3', '1', '2', '3'])
    const data2 = new eui.ArrayCollection(['1', '2', '3', '1', '2', '3', '1', '2', '3', '1', '2', '3', '1', '2', '3'])
    const ref1 = createRef<any>()
    const ref2 = createRef<any>()
    const Test1 = () => {
      return (
        <eui-dataGroup ref={ref1} dataProvider={data1}>
          <ItemRendererClass useRenderer={true}>
            {(data) => (
              <eui-itemRenderer>
                <eui-group />
              </eui-itemRenderer>
            )}
          </ItemRendererClass>
          <eui-itemRenderer object={new eui.ItemRenderer()}></eui-itemRenderer>
        </eui-dataGroup>
      )
    }
    const Test2 = () => {
      return (
        <eui-dataGroup ref={ref2} dataProvider={data2}>
          <ItemRendererClass useRenderer={false}>
            {(data) => (
              <eui-itemRenderer key="1">
                <eui-group />
              </eui-itemRenderer>
            )}
          </ItemRendererClass>
        </eui-dataGroup>
      )
    }
    createEgreactRoot(new ArrayContainer()).render(<Test1 />, { sync: true })
    createEgreactRoot(new ArrayContainer()).render(<Test2 />, { sync: true })
    const itemRenderer1 = new ref1.current.itemRenderer()
    itemRenderer1.dataChanged()
    itemRenderer1.dispatchEvent(new egret.Event(egret.Event.REMOVED_FROM_STAGE))
    const itemRenderer2 = new ref2.current.itemRenderer()
    itemRenderer2.dataChanged()
    await new Promise((r) => setTimeout(r))
  })
})
