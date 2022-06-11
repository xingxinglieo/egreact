export * from './renderer'

export * from './utils'

export * from './Host/utils'

export * from './type'

export * from './Host/common'

export * from './Host/index'

export { ArrayContainer } from './Host/custom/ArrayContainer'
export { ObjectContainer } from './Host/custom/ObjectContainer'
export { Anchor } from './Host/custom/Anchor'

import Egreact from './Egreact'

import egretProps from './Host/egret/index'
import euiProps from './Host/eui/index'
import customProps from './Host/custom'

export const Setters = {
  egret: egretProps,
  eui: euiProps,
  custom: customProps,
}
export default Egreact
export { Egreact }
