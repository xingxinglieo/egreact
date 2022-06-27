import displayObjectPropsHandlers from './DisplayObject'
import { rectangleProp, textureProp, NormalProp } from '../common'
import { mixinHelper } from '../utils'

const bitmapPropsHandlers = mixinHelper
  .set({
    ...displayObjectPropsHandlers,
    ...({} as { args: egret.Texture | egret.Texture[] }),
    __Class: egret.Bitmap,
    pixelHitTest: NormalProp.boo,
    smoothing: NormalProp.boo,
    fillMode: NormalProp.str,
  })
  .mixin(textureProp, 'texture')
  .mixin(rectangleProp, 'scale9Grid')
  .get()

export default bitmapPropsHandlers
