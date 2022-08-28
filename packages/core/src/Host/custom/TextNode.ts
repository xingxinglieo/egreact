interface TextContainer {
  text: string
}

const TextContainerMap = new Map<TextContainer, TextNode[]>()

class TextNode {
  private container?: TextContainer

  constructor(private _text: string) {}

  setContainer(container: TextContainer) {
    this.container = container
    if (container) {
      if (!TextContainerMap.has(container)) TextContainerMap.set(container, [])
      const children = TextContainerMap.get(container)
      children.push(this)
      this.updateContainerText()
    }
  }
  removeContainer() {
    const textNodes = TextContainerMap.get(this.container)
    textNodes.splice(textNodes.indexOf(this), 1)
    this.updateContainerText()

    // clear ref
    if (textNodes.length === 0) TextContainerMap.delete(this.container)
    this.container = null
  }

  private updateContainerText() {
    const children = TextContainerMap.get(this.container)
    this.container.text = children.reduce((s, c) => s + c.text, '')
  }

  set text(value) {
    this._text = value
    this.updateContainerText()
  }

  get text() {
    return this._text
  }
}

export function detachTextNode(instance: TextContainer) {
  if (TextContainerMap.has(instance)) TextContainerMap.delete(instance)
}
export default TextNode
