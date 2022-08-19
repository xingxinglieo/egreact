import textFieldHandlers from '../egret/TextField'
import { NormalProp, euiBaseLayoutProp } from '../common'

const editableTextHandlers = {
  ...textFieldHandlers,
  ...euiBaseLayoutProp,
  __Class: eui.EditableText,
  prompt: NormalProp.str,
  promptColor: NormalProp.num,
}

export default editableTextHandlers
