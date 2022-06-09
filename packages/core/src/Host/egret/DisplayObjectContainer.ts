import { PropSetterParameters } from '../../type'
import displayObjectPropsHandlers from './DisplayObject'

const displayObjectContainerPropsHandlers = {
  ...displayObjectPropsHandlers,
  __Class: egret.DisplayObjectContainer,
  childrenSortMode: ({ newValue, instance }: PropSetterParameters<string>) => (
    instance.setChildrenSortMode(newValue),
    // @ts-ignore
    () => instance.setChildrenSortMode(egret?.ChildrenSortMode?.['DEFAULT'] ?? 'DEFAULT')
  ),
}
export default displayObjectContainerPropsHandlers
