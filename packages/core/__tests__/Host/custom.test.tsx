import { Egreact } from '../../src/Egreact'
import React, { createRef, useEffect, useState } from 'react'
import { render } from '@testing-library/react'
import { getActualInstance } from '../../src/utils'
import { ArrayContainer } from '../../src/Host/custom/ArrayContainer'
import objectContainer from '../../src/Host/custom/ObjectContainer'
import { Primitive } from '../../src/Host/custom/Primitive'
import { BrowserRouter } from 'react-router-dom'
import { EgreactLink } from '../../src/Host'

describe('objectContainer', () => {
  it('should be undefined when getting symbol', () => {
    expect(objectContainer[Symbol('123')]).toEqual(undefined)
  })
})

function Test() {
  const textFieldRef = createRef<any>()
  const arrayContainerRef = createRef<any>()
  const font1Ref = createRef<any>()
  const font2Ref = createRef<any>()
  const objectContainerRef = createRef<any>()
  const objectContainerRef1 = createRef<any>()
  const [num] = useState(10)
  const [show, setShow] = useState(true)
  const [obj] = useState(new ArrayContainer())
  useEffect(() => {
    const textField = textFieldRef.current
    const arr = getActualInstance(arrayContainerRef.current)
    const font1 = getActualInstance(font1Ref.current)
    const font2 = getActualInstance(font2Ref.current)
    const objectContainer = getActualInstance(objectContainerRef.current)
    const objectContainer1 = getActualInstance(objectContainerRef1.current)
    expect(textField.textFlow).toBe(arr)
    expect(arr[0]).toBe(font1)
    expect(arr[1]).toBe(font2)
    expect(arr[2]).toBe(objectContainer)
    expect(arr[0]).toMatchObject({
      text: '10',
      style: { textColor: 0x000000, size: 20 },
    })
    expect(objectContainer).toMatchObject({
      text: 10,
      style: { textColor: '0xff0000' },
    })
    setShow(false)
    arrayContainerRef.current.reAttach()
    expect(arr === getActualInstance(arrayContainerRef.current)).toBeFalsy()
    objectContainerRef1.current.reAttach()
    expect(objectContainer1 === getActualInstance(objectContainerRef1.current)).toBeFalsy()
  }, [])
  return (
    <>
      <textField ref={textFieldRef}>
        <arrayContainer attach="textFlow" ref={arrayContainerRef} mountedApplyProps>
          {/* insertBefore */}
          {show ? null : (
            <font ref={font2Ref} textColor="0x336699" size="60" strokeColor={0x6699cc} stroke="2">
              Egret
            </font>
          )}
          {/* update text */}
          <font ref={font1Ref} textColor="0x000000" size="20">
            {num}
          </font>
          {/* removeChild */}
          {show ? (
            <font ref={font2Ref} textColor="0x336699" size="60" strokeColor={0x6699cc} stroke="2">
              Egret
            </font>
          ) : null}
          <objectContainer ref={objectContainerRef} text={num} style={{ textColor: '0xff0000' }} />
        </arrayContainer>
        <objectContainer attach="a" ref={objectContainerRef1} />
      </textField>
      <textField>
        <primitive object={obj} attach="textFlow">
          {show ? null : (
            <font textColor="0x336699" size="60" strokeColor={0x6699cc} stroke="2">
              Egret
            </font>
          )}
          <font textColor="0x000000" size="20">
            {num}
          </font>
          {show ? (
            <font textColor="0x336699" size="60" strokeColor={0x6699cc} stroke="2">
              Egret
            </font>
          ) : null}
        </primitive>
      </textField>
    </>
  )
}
describe('arrayContainer font objectContainer primitive', () => {
  const container = new egret.DisplayObjectContainer()
  it(`
    arrayContainer should add remove splice correctly, reAttach will reset __target;
    objectContainer should have prop value correctly,add child will throw error,reAttach will reset __target;
    font should have format like {text:'',style:{}} and have prop value correctly;
    primitive should handle add and remove correctly
    `, () => {
    render(
      <Egreact container={container}>
        <Test />
      </Egreact>,
    )
  })
  it('should throw error when objectContainer addChild( it only support child attach)', () => {
    expect(() =>
      render(
        <Egreact container={container}>
          <objectContainer>
            <displayObject />
          </objectContainer>
        </Egreact>,
      ),
    ).toThrow()
  })

  it(`should throw error when primitive don't have object prop`, () => {
    expect(() =>
      render(
        <Egreact container={container}>
          <primitive attach="textFlow"></primitive>
        </Egreact>,
      ),
    ).toThrow()
  })

  it(`should primitive update object prop but didn't have key(must use key to unmount and mount again)`, () => {
    const container = new egret.DisplayObjectContainer()
    const ref1 = createRef<any>()
    const ref2 = createRef<any>()
    const o1 = new egret.DisplayObject()
    const o2 = new egret.DisplayObject()
    const TestContainer = ({ isConstruct = false }) => {
      const [obj, setObj] = useState(o1)
      const [C, setC] = useState(() => egret.DisplayObject)
      useEffect(() => {
        expect(ref1.current.__target).toBe(o1)
        expect(ref2.current.__target).toBeInstanceOf(C)
        isConstruct ? setC(() => egret.DisplayObjectContainer) : setObj(o2)
      }, [])
      return (
        <textField>
          <primitive object={obj} ref={ref1} attach="textFlow" onChange={() => void 0}></primitive>
          <primitive constructor={C} ref={ref2} attach="test"></primitive>
        </textField>
      )
    }
    expect(() =>
      render(
        <Egreact container={container}>
          <TestContainer />
        </Egreact>,
      ),
    ).toThrow()

    expect(() =>
      render(
        <Egreact container={container}>
          <TestContainer isConstruct />
        </Egreact>,
      ),
    ).toThrow()
  })

  it(`should throw error when primitive add child but object is not a container`, () => {
    const TestContainer = () => {
      const [obj] = useState<any>(new egret.Shape())
      return (
        <Egreact container={container}>
          <primitive object={obj} attach="textFlow" test="1">
            <displayObject />
          </primitive>
        </Egreact>
      )
    }
    expect(() => render(<TestContainer />)).toThrow()
  })

  it(`should throw error when target has IContainer method`, () => {
    const p = new Primitive({ constructor: Object })

    expect(() => p.addChild({}, {})).toThrow()
    expect(() => p.removeChild({}, {})).toThrow()
    expect(() => p.addChildAt({}, 1, {})).toThrow()
    expect(() => p.getChildIndex({}, {})).toThrow()
  })
})

describe('aTag for React-Router', () => {
  const container = new egret.DisplayObjectContainer()

  const ref = createRef<any>()
  const TestContainer = () => {
    return (
      <Egreact container={container}>
        <BrowserRouter>
          <EgreactLink
            ref={ref}
            // @ts-ignore
            test="1"
            to={'/'}
            textColor="0x336699"
            size={60}
            y={200}>
            to eui
          </EgreactLink>
        </BrowserRouter>
      </Egreact>
    )
  }
  render(<TestContainer />)

  ref.current.dispatchEvent(new egret.TouchEvent(egret.TouchEvent.TOUCH_TAP))
})
