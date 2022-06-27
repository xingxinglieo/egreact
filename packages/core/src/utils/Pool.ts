import { is } from '../utils'
import { CONSTANTS } from '../constants'

type EgretClass = new (...args: any) => egret.DisplayObject
type EgretResetter = (instance: unknown) => void

interface EgretClassInfo {
  constructor: EgretClass
  resetter?: EgretResetter
  size?: number
}

const defaultResetter = (instance: any) => instance

export class Pool {
  private static poolMap = new Map<EgretClass, [Set<egret.DisplayObject>, EgretResetter, number]>()
  public static defaultSize: number = CONSTANTS.POOL_DEFAULT_SIZE

  /**
   * @description 注册构造函数
   *
   */
  public static registerClass(classes: EgretClassInfo[]) {
    classes.forEach((c) => {
      const { constructor, resetter = defaultResetter, size } = c
      if (!this.poolMap.has(constructor)) {
        this.poolMap.set(constructor, [new Set(), resetter, size])
      }
    })
  }

  public static setInfo(newInfo: EgretClassInfo) {
    const { constructor, resetter, size } = newInfo

    if (!this.isRegisteredClass(constructor)) return

    const info = this.poolMap.get(constructor)
    if (is.fun(resetter)) info[1] = resetter
    if (is.num(size)) info[2] = size
  }

  public static getInfo(clz: any) {
    return this.poolMap.get(clz)
  }

  /**
   * @description 判断是否注册构造函数
   *
   */
  public static isRegisteredClass(clz: any) {
    return this.poolMap.has(clz)
  }

  /**
   * 根据构造函数获取对象
   * @param clz 构造函数，对象池空，则创建新对象并返回
   */
  public static get(clz: EgretClass) {
    if (!this.isRegisteredClass(clz)) return new clz()

    const [pool] = this.poolMap.get(clz)
    for (let obj of pool) return pool.delete(obj) && obj

    return new clz()
  }

  /**
   * 根据类回收对象
   * @param obj 回收的对象
   * @param constructor 构造函数，可选，默认取 obj.constructor
   */
  public static recover(obj: any, constructor?: any) {
    const clz = constructor || obj.constructor

    if (!this.isRegisteredClass(clz)) return false

    const [pool, resetter, size = this.defaultSize] = this.poolMap.get(clz)
    if (pool.size < size) return pool.add((resetter(obj), obj))
    else return false
  }

  /**
   * 清理对象。
   * @param clz 对象类名
   */
  public static clear(clz: any) {
    if (!this.isRegisteredClass(clz)) return

    this.poolMap.get(clz)[0].clear()
  }

  /**清理所有对象 */
  public static clearAll() {
    for (let [clz] of this.poolMap) {
      this.clear(clz)
    }
  }

  /**
   * @description 删除注册的构造函数
   *
   */
  public static deleteClass(clz: any) {
    return this.poolMap.delete(clz)
  }

  /**
   * @description 删除所有的构造函数
   *
   */
  public static deleteAllClass() {
    return this.poolMap.clear()
  }
}
