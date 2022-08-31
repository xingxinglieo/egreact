import { Egreact } from '../../src/Components/Egreact'
import { render } from '@testing-library/react'
import React, { useEffect } from 'react'

describe('Egreact', () => {
  it('should handle prop correctly', () => {
    const selector = render(<Egreact contentWidth="750" contentHeight="1334" data-testid="div"></Egreact>)
    expect(selector.getByTestId('div').getAttribute('data-content-width')).toBe('750')
  })
  it('should handle contexts prop correctly', () => {
    const container = new egret.DisplayObjectContainer()
    const context = React.createContext(0)
    render(<Egreact container={container} contextsFrom={[context]}></Egreact>)
    render(<Egreact container={container} contextsFrom={false}></Egreact>)
    const TestComponent = () => {
      const divRef = React.useRef(null)
      useEffect(() => {
        render(<Egreact container={container} contextsFrom={divRef.current}></Egreact>)
      }, [])
      return <div ref={divRef}></div>
    }
    render(<TestComponent />)
  })

  it('should handle ref', () => {
    const ref = React.createRef<any>()
    render(<Egreact ref={ref} contentWidth="750" contentHeight="1334" data-testid="div"></Egreact>)
    expect(ref.current.container).toBeInstanceOf(egret.DisplayObjectContainer)
  })

  it('should handle renderer options', () => {
    render(
      <Egreact
        mode="concurrent"
        rendererOptions={{
          // @ts-ignore
          unstable_strictMode: true,
          unstable_concurrentUpdatesByDefault: true,
          identifierPrefix: 'egreact',
          onRecoverableError: console.error,
          transitionCallbacks: console.log,
        }}></Egreact>,
    )
  })
})
