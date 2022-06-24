import IViewport from './IViewport'
import { NormalProp, layoutBaseHandlers, EventProp } from '../common'
import { mixinHelper } from '../utils'

const groupHandlers = mixinHelper
  .set({
    ...IViewport,
    __Class: eui.Group,
    numElements: NormalProp.num,
    hasState: NormalProp.pass<(stateName: string) => boolean>,
    touchThrough: NormalProp.boo,
  })
  .mixin(layoutBaseHandlers, 'layout')
  .get()
export default groupHandlers
