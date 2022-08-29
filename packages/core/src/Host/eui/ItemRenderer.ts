import React, { useEffect, useState } from 'react'
import componentHandlers from '../eui/Component'

type Renderer = (data: any) => React.ReactNode

export class ItemRenderer {
  constructor(...args) {
    const props = args[args.length - 1]
    const { object } = props
    if (!object) throw 'ItemRenderer must have `object` prop'
    return object
  }
}

const itemRenderer = {
  ...componentHandlers,
  __Class: ItemRenderer,
  object() {},
}

export default itemRenderer
