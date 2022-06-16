// 外部粘贴的代码，免于测试

export function findTargetByPosition(
    displayObject: egret.DisplayObject,
    stageX: number,
    stageY: number,
  ): egret.DisplayObject | null {
    if (!displayObject.visible) {
      return null
    }
    const matrix = displayObject.$getInvertedConcatenatedMatrix()
    const x = matrix.a * stageX + matrix.c * stageY + matrix.tx
    const y = matrix.b * stageX + matrix.d * stageY + matrix.ty
    const rect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect
    if (rect && !rect.contains(x, y)) {
      return null
    }
    if (this?.$mask && !displayObject.$mask.$hitTest(stageX, stageY)) {
      return null
    }
    const children = displayObject.$children
    let notpTouchThrough = false
    if (children) {
      for (let index = children.length - 1; index >= 0; index--) {
        const child = children[index]
        if (child.$maskedObject) {
          continue
        }
        var target = findTargetByPosition(child, stageX, stageY)
        // @ts-ignore
        if (target && target.ispTouchThrough !== true) {
          notpTouchThrough = true
          break
        }
      }
    }
    if (target) {
      return target
    }
    if (notpTouchThrough) {
      return displayObject
    }
    return displayObject.$hitTest(stageX, stageY)
  }