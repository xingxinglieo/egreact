import groupHandlers from '../eui/Group'
import { NormalProp } from '../common'

const dataGroupHandlers = {
  ...groupHandlers,
  __Class: eui.DataGroup,
  dataProvider: NormalProp.pass<eui.ICollection | void>,
  itemRenderer: NormalProp.pass<typeof eui.ItemRenderer | void>,
  itemRendererFunction: NormalProp.pass<((item: any) => typeof eui.ItemRenderer) | void>,
  itemRendererSkinName: NormalProp.pass<string | eui.Skin | typeof eui.Skin | void>,
}

export default dataGroupHandlers
