import { Instance, ArrayContainer } from "egreact";
import React, { useEffect, useRef, useState } from "react";
import { RootState } from "../store";
import { increment } from "../store/counterSlice";
import { useSelector, useDispatch } from "react-redux";

export default function Test() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();
  const maskRef = useRef<any>(null);
  const [mask, setMask] = useState<egret.DisplayObject | null>(null);
  useEffect(() => {
    setMask(maskRef.current);
  }, []);
  return (
    <>
      <displayObject ref={maskRef} width="200" height="200" />
      <eui-label
        mask={mask}
        onTouchTap={() => {
          dispatch(increment());
        }}
        backgroundColor={0x000000}
      >
        <arrayContainer attach="textFlow">
          <objectContainer text={count + ""} style={{ textColor: 0xff0000 }} />
          <font fontFamily="Impact" textColor={0x000000}>
            {count}
          </font>
          <font fontFamily="Impact" textColor={0x000000}>
            {" "}
            can{" "}
          </font>
          <font fontFamily="Times New Roman " textColor={0x000000}>
            be set{" "}
          </font>
          <font textColor={0xff0000}>to a </font>
          <font> {"\n"} </font>
          <font textColor={0x00ff00}>variety </font>
          <font textColor={0xf000f0}>of </font>
          <font textColor={0x00ffff}>styles </font>
          <font size={56} textColor={0x000000}>
            with{" "}
          </font>
          <font size={16} textColor={0x000000}>
            different{" "}
          </font>
          <font size={26} textColor={0x000000}>
            colors,{" "}
          </font>
          <font text={"\n"} />
          <font textColor={0x00ff00} text="fonts "></font>
          <font size={26} textColor={0xf000f0} fontFamily="Quaver">
            and{" "}
          </font>
          <font textColor={0xf06f00}>sizes</font>
        </arrayContainer>
      </eui-label>

      <eui-label
        textColor={0x000000}
        onTouchTap={() => {
          dispatch(increment());
        }}
      >
        i am {count}.
      </eui-label>
    </>
  );
}
