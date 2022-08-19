import { Egreact } from '../../src/Egreact'
import { Graphics, isMountProp, NormalProp } from '../../src/Host/common'
import React, { useEffect, useState } from 'react'
import { render } from '@testing-library/react'
import { CONSTANTS } from '../../src/constants'

describe('Host common', () => {
  // describe('NormalProp.passWithType', () => {
  //   const target = new egret.DisplayObject()
  //   const targetKey = 'test'
  //   const p = {
  //     newValue: '1',
  //     target,
  //     targetKey,
  //   }
  //   it('should pass when test.length === 0', () => {
  //     const defaultError = console.error
  //     const myError = jest.fn(console.error)
  //     console.error = myError
  //     // const pass1 = NormalProp.passWithType()
  //     // const pass2 = NormalProp.passWithType([])

  //     // @ts-ignore
  //     pass1(p)
  //     expect(myError).toBeCalledTimes(0)
  //     // @ts-ignore
  //     pass2(p)
  //     expect(myError).toBeCalledTimes(0)
  //     console.error = defaultError
  //   })

  //   it('should check when test.length > 0', () => {
  //     const defaultError = console.error
  //     const myError = jest.fn(console.error)
  //     console.error = myError
  //     // const pass1 = NormalProp.passWithType([(v) => v === 1, (v) => v === '1'])
  //     // const pass2 = NormalProp.passWithType([(v) => v === 1, (v) => v === 2], 'test')
  //     // const pass3 = NormalProp.passWithTranslate(
  //     //   (v) => Number(v),
  //     //   [(v) => v === '1', (v) => v === 2],
  //     // )
  //     // NormalProp.passWithTranslate((v) => Number(v))
  //     // @ts-ignore
  //     pass1(p)
  //     expect(myError).toBeCalledTimes(0)
  //     // @ts-ignore
  //     pass2(p)
  //     expect(myError).toBeCalledTimes(1)
  //     // @ts-ignore
  //     // pass3(p)
  //     // expect(myError).toBeCalledTimes(2)
  //     console.error = defaultError
  //   })
  // })

  describe('NormalProp.instance', () => {
    it('args can be everything', () => {
      const container = new egret.DisplayObjectContainer()
      expect(() =>
        render(
          <Egreact container={container}>
            {/* @ts-ignore */}
            <displayObject scrollRect={0} />
          </Egreact>,
        ),
      ).not.toThrow()
    })
    it('should equal to outer instance', () => {
      const container = new egret.DisplayObjectContainer()
      const rect = new egret.Rectangle(0, 0, 100, 100)
      const ref = React.createRef<any>()
      render(
        <Egreact container={container}>
          <displayObject scrollRect={rect} ref={ref} />
        </Egreact>,
      )
      // scrollRect 被赋值后会转换为新的 egret.Rectangle 对象，
      // 所以只能用 width 判断
      expect(ref.current.scrollRect.width).toBe(rect.width)
    })
    it('should create a inner instance', () => {
      const container = new egret.DisplayObjectContainer()
      const ref = React.createRef<any>()
      render(
        <Egreact container={container}>
          <displayObject scrollRect={[1, 2, 3, 4]} ref={ref} />
        </Egreact>,
      )
      expect(ref.current.scrollRect.x).toBe(1)
    })
  })

  describe('layoutBaseHandlers', () => {
    it('should have a correct layout type', () => {
      const container = new egret.DisplayObjectContainer()
      const layout = new eui.TileLayout()
      const ref1 = React.createRef<any>()
      const ref2 = React.createRef<any>()
      const ref3 = React.createRef<any>()
      const ref4 = React.createRef<any>()
      const ref5 = React.createRef<any>()

      render(
        <Egreact container={container}>
          <eui-group layout="basic" ref={ref1}></eui-group>
          <eui-group layout="tile" ref={ref2}></eui-group>
          <eui-group layout="horizontal" ref={ref3}></eui-group>
          <eui-group layout="vertical" ref={ref4}></eui-group>
          <eui-group layout={layout} ref={ref5}></eui-group>
        </Egreact>,
      )
      expect(ref1.current.layout).toBeInstanceOf(eui.BasicLayout)
      expect(ref2.current.layout).toBeInstanceOf(eui.TileLayout)
      expect(ref3.current.layout).toBeInstanceOf(eui.HorizontalLayout)
      expect(ref4.current.layout).toBeInstanceOf(eui.VerticalLayout)
      expect(ref5.current.layout).toBe(layout)

      expect(() =>
        render(
          <Egreact container={container}>
            {/* @ts-ignore */}
            <eui-group layout="test" ref={ref5}></eui-group>
          </Egreact>,
        ),
      ).toThrow()
    })
  })
  describe('Graphics handler', () => {
    it('should call handler', () => {
      const container = new egret.DisplayObjectContainer()
      const TestComponent = () => {
        const [actions, setActions] = useState<Graphics.Prop>([
          ['beginFill', 0x0000],
          ['drawRect', 0, 0, 100, 100],
          ['endFill'],
        ])
        useEffect(() => {
          setActions(() => () => () => void 0)
        }, [])
        useEffect(() => {
          if (typeof actions === 'function') {
            setActions([['beginFill', 0x6666], ['drawRect', 0, 0, 100, 100], ['endFill']])
          }
        }, [actions])

        return <shape graphics={actions} />
      }
      render(
        <Egreact container={container}>
          <TestComponent />
        </Egreact>,
      )
    })
    describe('flatArrDiffWithLevel', () => {
      expect(Graphics.diff([1], [[1, 2]])).toBe(false)
      expect(Graphics.diff([1, 3], [[1, 2]])).toBe(false)
    })

    describe('isMountProp', () => {
      expect(isMountProp(CONSTANTS.PROP_MOUNT)).toBe(true)
    })
  })
})
