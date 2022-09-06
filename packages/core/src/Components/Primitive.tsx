import React from 'react'
import { TransProp } from '../Host/index'
import customProps from '../Host/custom'
import egretProps from '../Host/egret'
export function Primitive<K extends new (...args: any) => any, T = any>(
  props: ({ object: T } | { constructor: K }) &
    TransProp<typeof egretProps.displayObject> &
    TransProp<typeof customProps.primitive> & {
      [Key in keyof (Partial<T> & Partial<InstanceType<K>>) as Key extends `$${string}` ? null : Key]: (Partial<T> &
        Partial<InstanceType<K>>)[Key]
    },
) {
  return <primitive {...props}></primitive>
}
