import React, { useEffect, useMemo } from 'react'
import { useState, useRef } from 'react'
export default function TestPrimitive() {
  const [container, setContainer] = useState(
    new egret.DisplayObjectContainer(),
  )
  const p = useRef(null)
  useEffect(() => {
    setTimeout(() => {
      setContainer(new egret.Sprite())
    }, 5000)
  }, [])

  return (
    <displayObjectContainer x={100}>
      <primitive
        ref={p}
        object={container}
        key={container.$hashCode}
        x={100}>
        <eui-rect fillColor={0x888888} width={100} height={100}></eui-rect>
      </primitive>
    </displayObjectContainer>
  )
}
