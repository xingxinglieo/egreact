interface TextContainer {
  text: string
}

const ParentMap = new Map<TextContainer, RenderString[]>()

class RenderString {
  private parentInstance?: TextContainer

  constructor(private _text: string) {}

  setParent(instance: TextContainer) {
    this.parentInstance = instance
    if (instance) {
      if (!ParentMap.has(instance)) ParentMap.set(instance, [])
      const children = ParentMap.get(instance)
      children.push(this)
      this.updateParentText()
    }
  }
  removeParent() {
    const children = ParentMap.get(this.parentInstance)
    children.splice(children.indexOf(this), 1)
    this.updateParentText()
    this.parentInstance = null
  }

  private updateParentText() {
    const children = ParentMap.get(this.parentInstance)
    this.parentInstance.text = children.reduce((s, c) => s + c.text, '')
  }

  set text(value) {
    this._text = value
    this.updateParentText()
  }

  get text() {
    return this._text
  }
}

export function detachRenderString(instance: TextContainer) {
  ParentMap.delete(instance)
}
export default RenderString
