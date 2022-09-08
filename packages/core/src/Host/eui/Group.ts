import IViewport from './IViewport'
import { NormalProp, layoutBaseProp, EventProp } from '../common'
import { mixinHelper } from '../utils'

const groupHandlers = mixinHelper
  .set({
    ...IViewport,
    __detach: (instance: eui.Group) => ((instance.scrollH = 0), (instance.scrollV = 0)),
    __Class: eui.Group,
    numElements: NormalProp.num,
    hasState: NormalProp.pass<(stateName: string) => boolean>,
    touchThrough: NormalProp.boo,
  })
  .mixin(layoutBaseProp, 'layout')
  .get()
export default groupHandlers
