import componentPropsHandlers from './Component'
import { NormalProp } from '../common'

const buttonHandlers = {
  ...componentPropsHandlers,
  __Class: eui.Button,
  label: NormalProp.str,
  icon: NormalProp.pass<string | egret.Texture | void>,
  iconDisplay: NormalProp.pass<eui.Image | void>,
  labelDisplay: NormalProp.pass<eui.IDisplayText | void>,
}

export default buttonHandlers
