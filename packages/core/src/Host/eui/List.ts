import dataGroupHandlers from '../eui/DateGroup'
import { EventProp, NormalProp } from '../common'

const listHandlers = {
  ...dataGroupHandlers,
  __Class: eui.List,
  requireSelection: NormalProp.boo,
  allowMultipleSelection: NormalProp.boo,
  onItemTap: EventProp.eventSetter,
}

export default listHandlers
