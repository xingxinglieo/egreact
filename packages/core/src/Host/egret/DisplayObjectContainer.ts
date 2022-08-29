import { PropSetterParameters } from '../../type'
import displayObjectPropsHandlers from './DisplayObject'

const displayObjectContainerPropsHandlers = {
  ...displayObjectPropsHandlers,
  __Class: egret.DisplayObjectContainer,
  childrenSortMode: ({ newValue, instance }: PropSetterParameters<string>) => (
    instance.setChildrenSortMode?.(newValue), (isRemove) => isRemove && instance.setChildrenSortMode?.('DEFAULT')
  ),
}
export default displayObjectContainerPropsHandlers
