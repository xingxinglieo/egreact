import React, { useEffect, useMemo } from "react";
import { useState, useRef } from "react";

const TestPrimitive = () => {
  const [container, setContainer] = useState(() => new egret.Sprite());
  const [x, setX] = useState(50);
  useEffect(() => {
    const t = setTimeout(() => {
      const sprite = new egret.Sprite();
      sprite.graphics.beginFill(0xff8fae, 1);
      sprite.graphics.drawRect(0, 0, 150, 150);
      sprite.graphics.endFill();
      setContainer(sprite);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <displayObjectContainer>
      <primitive
        object={container}
        key={container.$hashCode}
        y={100}
        onTouchTap={() => setX((x) => x + 50)}
        x={x}
      >
        <eui-rect y={100} fillColor={0x888888} width={100} height={100} />
      </primitive>
    </displayObjectContainer>
  );
};
export default TestPrimitive;
