import componentPropsHandlers from './Component'
import { NormalProp, EventProp } from '../common'

const scrollerUiEventTypeSets = {
  onUiChangeStart: EventProp.uiEventSetter,
  onUiChangeEnd: EventProp.uiEventSetter,
}

const scrollerHandlers = {
  ...componentPropsHandlers,
  ...scrollerUiEventTypeSets,
  __Class: eui.Scroller,
  bounces: NormalProp.boo,
  scrollPolicyH: NormalProp.str,
  scrollPolicyV: NormalProp.str,
  scrollThreshold: NormalProp.num,
  throwSpeed: NormalProp.num,
  viewport: NormalProp.pass<eui.IViewport | void>,
  horizontalScrollBar: NormalProp.pass<eui.HScrollBar | void>,
  verticalScrollBar: NormalProp.pass<eui.VScrollBar | void>,
}
export default scrollerHandlers
