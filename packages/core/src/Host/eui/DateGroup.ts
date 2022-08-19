import groupHandlers from '../eui/Group'
import { NormalProp } from '../common'

const dataGroupHandlers = {
  ...groupHandlers,
  __Class: eui.DataGroup,
  dataProvider: NormalProp.pass<eui.ICollection | void>,
  itemRenderer: NormalProp.pass<typeof eui.ItemRenderer | void>,
  itemRendererFunction: NormalProp.pass<((item: any) => typeof eui.ItemRenderer) | null>,
  itemRendererSkinName: NormalProp.str,
}

export default dataGroupHandlers
