import { Pool } from '../../src/index'

describe('Pool', () => {
  it('should setInfo, size 0, so can not recover', () => {
    const fun = () => void 0
    Pool.setInfo({
      constructor: egret.DisplayObject,
      resetter: fun,
      size: 0,
    })
    const info = Pool.getInfo(egret.DisplayObject)
    expect(info[1]).toEqual(fun)
    expect(info[2]).toEqual(0)
    expect(Pool.recover(new egret.DisplayObject())).toEqual(false)
  })

  it('should deleteClass, can not recover', () => {
    Pool.deleteClass(eui.Image)
    expect(Pool.getInfo(eui.Image)).toEqual(undefined)
    expect(Pool.recover(new eui.Image())).toEqual(false)
    expect(Pool.get(eui.Image)).toBeInstanceOf(eui.Image)
  })

  it('should clear', () => {
    Pool.clearAll()
    expect(Pool.getInfo(egret.DisplayObjectContainer)[0].size).toBe(0)
    Pool.clear(Array)
  })

  it('should deleteAllClass', () => {
    Pool.deleteAllClass()
    // @ts-ignore
    expect(Pool.poolMap.size).toBe(0)
  })
})
