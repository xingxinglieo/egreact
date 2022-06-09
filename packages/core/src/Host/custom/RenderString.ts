class RenderString {
  private parentInstance?: { text: string }
  constructor(private _text: string) {}
  setParent(instance?: { text: string }) {
    this.parentInstance = instance
    if (this.parentInstance) {
      this.text = this._text
      return this.text
    }
    return ''
  }
  set text(value) {
    this.parentInstance.text = value
  }
  get text() {
    return this.parentInstance.text
  }
}
export default RenderString
