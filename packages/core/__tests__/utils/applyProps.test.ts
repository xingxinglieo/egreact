import { applyProps, attachInfo, diffProps } from '../../src/renderer/utils'
import groupHandlers from '../../src/Host/eui/Group'

describe('apply props', () => {
  const instance = attachInfo<eui.Group>(new eui.Group(), {
    // @ts-ignore
    propsHandlers: {
      ...groupHandlers,
      onMyEventBb: () => () => {
        console.log(32)
      },
      onMyEventCc: () => void 0,
    },
  })
  const emptyFun = jest.fn(() => {})
  const p1 = {
    'layout-gap': 10,
    'layout-paddingBottom': 10,
    layout: 'horizontal',
    width: '100%',
    notExistProp: 1,
    __diff: '1',

    onTouchTap: emptyFun,
    onTouchTapOnce: emptyFun,
    onMyEventDd: emptyFun,
  }
  describe('when an instance mounted', () => {
    applyProps(instance, p1)
    it('should mounted all props', () => {
      const layout = instance.layout as eui.HorizontalLayout
      expect(layout).toBeInstanceOf(eui.HorizontalLayout)
      expect(layout.paddingBottom).toBe(10)
      expect(layout.gap).toBe(10)
      expect(instance.__renderInfo.memoizedProps['onTouchTap']).toBe(emptyFun)
      instance.dispatchEvent(new egret.TouchEvent(egret.TouchEvent.TOUCH_TAP))
      expect(emptyFun).toBeCalled()
      expect(() => applyProps(instance, { ...p1, onMyEventBb: emptyFun })).not.toThrow()
      const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementationOnce(() => {})
      applyProps(instance, { ...p1, onMyEventCc: emptyFun, 'on-link': emptyFun })
      expect(consoleWarnMock).toHaveBeenCalledTimes(1)
      // @ts-ignore
      expect('link' in instance.$EventDispatcher[1]).toBeTruthy()
      consoleWarnMock.mockRestore()
    })
  })

  describe('throw when target not exists', () => {
    it('', () => {
      expect(() => applyProps(instance, { 'a-b-c': 1 })).toThrow()
    })
  })

  const p2 = {
    'layout-gap': 20,
    layout: 'horizontal',
    onTouchTapOnce: emptyFun,
  }
  describe('when an instance update', () => {
    it('should update layout-gap to 20 and remove lay-paddingBottom and remove onTouchTap', () => {
      applyProps(instance, diffProps(instance, p2, p1))
      const layout = instance.layout as eui.HorizontalLayout
      expect(layout.gap).toBe(20)
      expect(layout.paddingBottom).toBe(0)
      const callTimes = emptyFun.mock.calls.length
      instance.dispatchEvent(new egret.TouchEvent(egret.TouchEvent.TOUCH_TAP))
      expect(emptyFun).toBeCalledTimes(callTimes)
    })
  })
})
