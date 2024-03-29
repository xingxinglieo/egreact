import { Egreact } from '../../src/Components/Egreact'
import React, { useEffect, useState } from 'react'
import { render } from '@testing-library/react'

const container = new egret.DisplayObjectContainer()
const texture = new egret.Texture()
const Test = () => {
  const [num, setNum] = useState('100%')
  const [p, setP] = useState<any>({
    childrenSortMode: 'DECREASE_Y',
  })
  useEffect(() => {
    setNum('100')
    setP({})
  }, [])
  return (
    <>
      <bitmap args={[texture]} />
      <bitmap args={texture} />

      {/* test normal prop handler */}
      <displayObject height={num} width={num} visible name={1} />
      <displayObject height={50} width={50} mask={new egret.DisplayObject()} />

      <displayObjectContainer {...p} />
    </>
  )
}
describe('Bitmap DisplayObject DisplayObjectContainer', () => {
  it(`
    Bitmap:args;
    DisplayObject:width,height;
    DisplayObjectContainer:setChildrenSortMode`, () => {
    render(
      <div>
        <Egreact container={container}>
          <Test />
        </Egreact>
      </div>,
    )
  })
})
