import { render } from '@testing-library/react'
import React, { createRef, useEffect, useState } from 'react'
import { Egreact, getActualInstance, Instance, hostConfig, createEgreactRoot, ExtensionObj } from '../src/index'
import TextNode from '../src/Host/custom/TextNode'

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
      const [p, setP] = useState<any>({ attach: 'attach1' })
      useEffect(() => {
        // @ts-ignore
        expect(container["attach1"]).toBe(getActualInstance(arrRef.current))
        setP({ attach: 'attach2' })
      }, [])
      return <arrayContainer ref={arrRef} {...p}></arrayContainer>
    }
    render(
      <Egreact container={container}>
        <TestComponent />
      </Egreact>,
    )
    // @ts-ignore
    expect(container['attach2']).toBe(getActualInstance(arrRef.current))
  })

  it('should call reset fun if is existed when remove child', () => {
    const container = new egret.DisplayObjectContainer()
    let resetFun
    const displayObjectRef = createRef<Instance<egret.DisplayObject>>()

    const TestComponent = () => {
      const [show, setShow] = useState(true)
      useEffect(() => {
        resetFun = jest.fn(displayObjectRef.current!.__renderInfo.memoizedResetter['width'])
        displayObjectRef.current!.__renderInfo.memoizedResetter['width'] = resetFun
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

  it('should throw when get attach target error', () => {
    const container = new egret.DisplayObjectContainer()

    expect(() =>
      render(
        <Egreact container={container}>
          <textField>
            <arrayContainer attach="a-b-c"></arrayContainer>
          </textField>
        </Egreact>,
      ),
    ).toThrow()
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

  it(`sync allow ref get instance immediately`, () => {
    const container = new egret.DisplayObjectContainer()
    const ref = createRef<any>()
    const TestComponent = () => {
      return <eui-group ref={ref}></eui-group>
    }
    const root = createEgreactRoot(container)
    root.render(<TestComponent />, { sync: true })
    expect(ref.current).not.toBeNull()
    root.unmount()
  })

  it('another host functions had not called in application', () => {
    const displayObjectContainer = new egret.DisplayObjectContainer() as Instance<egret.DisplayObjectContainer>
    const textNode = new TextNode('e') as Instance<TextNode>
    textNode.setContainer(new egret.TextField())

    hostConfig.hideInstance?.(displayObjectContainer)
    expect(displayObjectContainer.visible).toBe(false)

    hostConfig.unhideInstance?.(displayObjectContainer, {})
    expect(displayObjectContainer.visible).toBe(true)

    hostConfig.resetTextContent?.(textNode)
    expect(textNode.text).toBe('')

    hostConfig.unhideTextInstance?.(textNode, '1')
    expect(textNode.text).toBe('1')

    hostConfig.hideTextInstance?.(textNode)
    expect(textNode.text).toBe('')

    hostConfig.preparePortalMount(displayObjectContainer)
  })

  it('prepareUpdate should return null when diff success', () => {
    const container = new egret.DisplayObjectContainer()
    const TestComponent = () => {
      const [actions, setActions] = useState([['beginFill', 0x000000], ['drawRect', 0, 0, 300, 100], ['endFill']])
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
