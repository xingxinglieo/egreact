import { render } from '@testing-library/react'
import React from 'react'
import sinon from 'sinon'
import { Egreact } from '../src/Components'
import { findEgretAncestor } from '../src/utils'

import {
  findMatchEventIndex,
  ProxyEventInfo,
  findFiberByHostInstance,
  proxyHackForDevTools,
  unProxyHackForDevTools,
} from '../src/devtool'

afterEach(() => {
  sinon.restore()
})
describe('devtool', () => {
  describe('findEgretAncestor', () => {
    it('should find a entire egret ancestor', () => {
      const ref1 = React.createRef<any>()
      const ref2 = React.createRef<any>()
      const ref3 = React.createRef<any>()
      render(
        <Egreact>
          <eui-label ref={ref3}>
            <arrayContainer ref={ref1} attach="textFlow">
              <objectContainer ref={ref2} />
            </arrayContainer>
          </eui-label>
        </Egreact>,
      )
      expect(findEgretAncestor(ref1.current)).toBe(ref3.current)
      expect(findEgretAncestor(ref2.current)).toBe(ref3.current)
      expect(findEgretAncestor(ref3.current)).toBe(ref3.current)
    })
  })

  describe('findMatchEventIndex', () => {
    it('should find matched event', () => {
      const handle1 = () => void 0
      const infos = [
        ['click', handle1, true],
        ['tap', handle1, { capture: false }],
      ] as ProxyEventInfo[]

      expect(findMatchEventIndex(['click', handle1, { capture: true }], infos)).toBe(0)
      expect(findMatchEventIndex(['tap', handle1, false], infos)).toBe(1)
      expect(findMatchEventIndex(['tap', handle1, undefined], infos)).toBe(1)
      expect(findMatchEventIndex(['tap', handle1, { capture: false }], infos)).toBe(1)
      expect(findMatchEventIndex(['tap', handle1, true], infos)).toBe(-1)
      expect(findMatchEventIndex(['tap', handle1, true])).toBe(-1)
    })
  })

  describe('findTargetByPosition', () => {
    it('should find a entire egret ancestor', async () => {
      const ref1 = React.createRef<any>()
      const ref2 = React.createRef<any>()
      const ref3 = React.createRef<any>()
      const domRef = React.createRef<any>()
      render(
        <div ref={domRef}>
          <Egreact>
            <eui-label ref={ref3}>
              <arrayContainer ref={ref1} attach="textFlow">
                <objectContainer ref={ref2} />
              </arrayContainer>
            </eui-label>
          </Egreact>
        </div>,
      )

      sinon.stub(document, 'querySelector').returns(domRef.current)
      sinon.stub(domRef.current, 'getBoundingClientRect').returns({
        height: 500,
        width: 500,
        left: 0,
        top: 0,
        x: 0,
        y: 0,
      })
      sinon.stub(document.body, 'clientWidth').get(() => 1)
      sinon.stub(egret.lifecycle.stage, 'stageWidth').get(() => 1)

      const handle2 = jest.fn()
      window.addEventListener('pointermove', handle2)

      const styleSheet = getComputedStyle(domRef.current)

      proxyHackForDevTools()

      expect(ref1.current.getBoundingClientRect().width).toBe(0)
      expect(getComputedStyle(domRef.current).width).toBe(styleSheet.width)
      expect(getComputedStyle(ref1.current).borderLeftWidth).toBe('0')

      expect(findFiberByHostInstance(ref1.current).stateNode).toBe(ref1.current)
      expect(findFiberByHostInstance(domRef.current)).toBe(null)

      const handle = jest.fn()
      const handle1 = jest.fn()
      window.addEventListener('pointerover', handle)
      window.addEventListener('pointerover', handle1)
      window.addEventListener('message', handle)
      const e = new Event('pointerover') as Event & { pageX: number; pageY: number; e: any }
      e.pageX = 300
      e.pageY = 300

      window.dispatchEvent(e)
      window.removeEventListener('pointermove', handle2)
      window.removeEventListener('pointerover', handle)

      sinon.stub(document, 'querySelectorAll').get(() => {
        const div1 = document.createElement('div')
        const div2 = document.createElement('div')
        div1.innerHTML = `<div><span/></div>`
        return () => [div1, div2]
      })

      await new Promise((r) => setTimeout(r, 100))

      unProxyHackForDevTools()
      window.addEventListener('pointerover', handle1)
      window.removeEventListener('message', handle)
    })
  })
})
