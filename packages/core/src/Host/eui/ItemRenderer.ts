import componentHandlers from '../eui/Component'

export class ItemRenderer {
  constructor(...args) {
    const props = args[args.length - 1]
    const { object } = props
    if (object) return object
  }
}

const itemRenderer = {
  ...componentHandlers,
  __Class: ItemRenderer,
  object() {},
}

export default itemRenderer
