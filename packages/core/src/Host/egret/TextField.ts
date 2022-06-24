import displayObjectPropsHandlers from './DisplayObject'
import { NormalProp, EventProp } from '../common'

const focusEventTypeSetters = {
  onFocusIn: EventProp.focusEventSetter,
  onFocusInOnce: EventProp.focusEventSetter,
  onFocusOut: EventProp.focusEventSetter,
  onFocusOutOnce: EventProp.focusEventSetter,
}

const textFieldHandlers = {
  ...displayObjectPropsHandlers,
  __Class: egret.TextField,
  background: NormalProp.boo,
  bold: NormalProp.boo,
  border: NormalProp.boo,
  italic: NormalProp.boo,
  displayAsPassword: NormalProp.boo,
  multiline: NormalProp.boo,
  wordWrap: NormalProp.boo,
  backgroundColor: NormalProp.num,
  borderColor: NormalProp.num,
  lineSpacing: NormalProp.num,
  maxChars: NormalProp.num,
  scrollV: NormalProp.num,
  maxScrollV: NormalProp.num,
  numLines: NormalProp.num,
  size: NormalProp.num,
  stroke: NormalProp.num,
  strokeColor: NormalProp.num,
  textColor: NormalProp.num,
  textHeight: NormalProp.num,
  textWidth: NormalProp.num,
  fontFamily: NormalProp.str,
  inputType: NormalProp.str,
  restrict: NormalProp.str,
  text: NormalProp.str,
  textAlign: NormalProp.str,
  verticalAlign: NormalProp.str,
  type: NormalProp.str,
  textFlow: NormalProp.pass<egret.ITextElement[]>,
  onChange: EventProp.eventSetter,
  ...focusEventTypeSetters,
}

export default textFieldHandlers
