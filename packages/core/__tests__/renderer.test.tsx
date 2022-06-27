import { render } from '@testing-library/react'
import React, { createRef, useEffect, useRef, useState } from 'react'
import { Egreact, getActualInstance, Instance, hostConfig, createEgreactRoot } from '../src/index'
import RenderString from '../src/Host/custom/RenderString'
describe('Egreact', () => {
  it('should throw error when use html element in egreact context', () => {
    const container = new egret.DisplayObjectContainer()
    expect(() =>
      render(
        <Egreact container={container}>
          <div></div>
        </Egreact>,
      ),
    ).toThrow()
  })
  it('should throw error when write text in object which lost `text` prop', () => {
    const container = new egret.DisplayObjectContainer()
    expect(() =>
      render(
        <Egreact container={container}>
          <displayObject>111</displayObject>
        </Egreact>,
      ),
    ).toThrow()
  })
  it('should throw error when move attach element position', () => {
    const container = new egret.DisplayObjectContainer()
    const TestComponent = () => {
      const [show, setShow] = useState(false)
      useEffect(() => {
        setShow(true)
      }, [])
      return (
        <eui-scroller>
          {show ? <displayObject></displayObject> : null}
          <eui-group attach="viewport"></eui-group>
        </eui-scroller>
      )
    }
    expect(() =>
      render(
        <Egreact container={container}>
          <TestComponent />
        </Egreact>,
      ),
    ).toThrow()
  })
  it('should throw error when remove attach prop', () => {
    const container = new egret.DisplayObjectContainer()
    const TestComponent = () => {
      const [p, setP] = useState<any>({ attach: 'textFlow' })
      useEffect(() => {
        setP({})
      }, [])
      return (
        <textField>
          <arrayContainer {...p}></arrayContainer>
        </textField>
      )
    }
    expect(() =>
      render(
        <Egreact container={container}>
          <TestComponent />
        </Egreact>,
      ),
    ).toThrow()
  })

  it('should attach again when attach prop update', () => {
    const container = new egret.DisplayObjectContainer()
    const arrRef = createRef<any>()
    const TestComponent = () => {
      const [p, setP] = useState<any>({ attach: 'test1' })
      useEffect(() => {
        expect(container['test1']).toBe(getActualInstance(arrRef.current))
        setP({ attach: 'test2' })
      }, [])
      return <arrayContainer ref={arrRef} {...p}></arrayContainer>
    }
    render(
      <Egreact container={container}>
        <TestComponent />
      </Egreact>,
    )
    expect(container['test2']).toBe(getActualInstance(arrRef.current))
  })

  it('should call reset fun if is existed when remove child', () => {
    const container = new egret.DisplayObjectContainer()
    let resetFun
    const displayObjectRef = createRef<Instance<egret.DisplayObject>>()

    const TestComponent = () => {
      const [show, setShow] = useState(true)
      useEffect(() => {
        resetFun = jest.fn(displayObjectRef.current.__renderInfo.memoizedResetter['width'])
        displayObjectRef.current.__renderInfo.memoizedResetter['width'] = resetFun
        setShow(false)
      }, [])
      return show ? <displayObject ref={displayObjectRef} width="100%"></displayObject> : null
    }
    render(
      <Egreact container={container}>
        <TestComponent />
      </Egreact>,
    )
    expect(resetFun).toBeCalledTimes(1)
  })

  it('should reset default value when remove attach child', () => {
    const container = new egret.DisplayObjectContainer()
    const arrRef = createRef<Instance<any>>()
    const textRef = createRef<Instance<any>>()
    let defaultValue
    const TestComponent = () => {
      const [show, setShow] = useState(true)
      useEffect(() => {
        defaultValue = arrRef.current.__renderInfo.targetInfo[2]
        setShow(false)
      }, [])
      return (
        <textField ref={textRef}>
          {show ? <arrayContainer ref={arrRef} attach="textFlow"></arrayContainer> : null}
        </textField>
      )
    }
    render(
      <Egreact container={container}>
        <TestComponent />
      </Egreact>,
    )
    expect(textRef.current.textFlow).toBe(defaultValue)
  })

  it('should reset text when remove string', () => {
    const container = new egret.DisplayObjectContainer()
    const TestComponent = () => {
      const [show, setShow] = useState(true)
      useEffect(() => {
        setShow(false)
      }, [])
      return <textField>{show ? '111' : null}</textField>
    }
    render(
      <Egreact container={container}>
        <TestComponent />
      </Egreact>,
    )
  })

  it('text update should call `commitTextUpdate` of hostConfig', () => {
    const container = new egret.DisplayObjectContainer()
    const TestComponent = () => {
      const [num, setNum] = useState(0)
      useEffect(() => {
        setNum(1)
      }, [])
      return <textField>{num}</textField>
    }
    render(
      <Egreact container={container}>
        <TestComponent />
      </Egreact>,
    )
  })

  it(`can't render after unmounted`, () => {
    const container = new egret.DisplayObjectContainer()
    const TestComponent = () => {
      const [num, setNum] = useState(0)
      useEffect(() => {
        setNum(1)
      }, [])
      return <textField>{num}</textField>
    }
    const root = createEgreactRoot(container)
    root.render(<TestComponent />)
    root.unmount()
    expect(() => root.render(<TestComponent />)).toThrow()
  })

  it('another host functions had not called in application', () => {
    const displayObjectContainer =
      new egret.DisplayObjectContainer() as Instance<egret.DisplayObjectContainer>
    const renderString = new RenderString('e') as Instance<RenderString>
    renderString.setParent(new egret.TextField())

    hostConfig.hideInstance(displayObjectContainer)
    expect(displayObjectContainer.visible).toBe(false)

    hostConfig.unhideInstance(displayObjectContainer, {})
    expect(displayObjectContainer.visible).toBe(true)

    hostConfig.resetTextContent(renderString)
    expect(renderString.text).toBe('')

    hostConfig.unhideTextInstance(renderString, '1')
    expect(renderString.text).toBe('1')

    hostConfig.hideTextInstance(renderString)
    expect(renderString.text).toBe('')

    hostConfig.preparePortalMount(displayObjectContainer)
  })

  it('prepareUpdate should return null when diff success', () => {
    const container = new egret.DisplayObjectContainer()
    const TestComponent = () => {
      const [actions, setActions] = useState([
        ['beginFill', 0x000000],
        ['drawRect', 0, 0, 300, 100],
        ['endFill'],
      ])
      useEffect(() => {
        setActions([['beginFill', 0x000000], ['drawRect', 0, 0, 300, 100], ['endFill']])
      }, [])
      // @ts-ignore
      return <shape graphics={actions}></shape>
    }
    render(
      <Egreact container={container}>
        <TestComponent />
      </Egreact>,
    )
  })
})
