import { diffProps, attachInfo } from '../../src/utils'
import groupHandlers from '../../src/Host/eui/Group'
import spriteHandlers from '../../src/Host/egret/Sprite'
import { CONSTANTS } from '../../src/constants'

describe('diff props', () => {
  describe('when an instance mounted ', () => {
    const emptyFun = () => {}
    it('should return a diff object, all props', () => {
      expect(
        diffProps(
          {} as any,
          {
            'layout-gap': 10,
            'layout-paddingBottom': 10,
            layout: 'horizontal',
            onTouchTap: emptyFun,
          },
          {},
        ).changes,
      ).toEqual([
        ['layout', 'horizontal', false, ['layout']],
        ['layout-paddingBottom', 10, false, ['layout', 'paddingBottom']],
        ['layout-gap', 10, false, ['layout', 'gap']],
        ['onTouchTap', emptyFun, true, ['onTouchTap']],
      ])
    })
  })

  describe('when a prefix prop update and a suffix prop remove', () => {
    const instance = attachInfo(new eui.Group(), {
      // @ts-ignore
      propsHandlers: groupHandlers,
    })
    it('layout-paddingBottom should before layout, layout-gap should after layout', () => {
      expect(
        diffProps(
          instance,
          {
            'layout-gap': 10,
            layout: 'vertical',
            'layout-paddingBottom': CONSTANTS.DEFAULT_REMOVE,
          },
          {
            'layout-gap': 10,
            'layout-paddingBottom': 10,
            layout: 'horizontal',
          },
        ).changes,
      ).toEqual([
        ['layout-paddingBottom', CONSTANTS.DEFAULT_REMOVE, false, ['layout', 'paddingBottom']],
        ['layout', 'vertical', false, ['layout']],
        ['layout-gap', 10, false, ['layout', 'gap']],
      ])
    })
  })

  describe('when a prop hava a custom diff fun', () => {
    const instance = attachInfo(new egret.Sprite(), {
      // @ts-ignore
      propsHandlers: spriteHandlers,
    })
    expect(
      diffProps(
        instance,
        {
          graphics: [['beginFill', 0x0000], ['drawRect', 0, 0, 100, 100], ['endFill']],
        },
        {
          graphics: [['beginFill', 0x0000], ['drawRect', 0, 0, 100, 100], ['endFill']],
        },
      ).changes,
    ).toEqual([])
  })
})
