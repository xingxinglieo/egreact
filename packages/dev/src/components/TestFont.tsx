import { Instance, ArrayContainer } from "egreact";
import React, { useEffect, useRef } from "react";
import { RootState } from "../store";
import { increment } from "../store/counterSlice";
import { useSelector, useDispatch } from "react-redux";

export default function Test() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();
  const arrayContainer = useRef<Instance<ArrayContainer>>(null);
  useEffect(() => {
    arrayContainer.current.reAttach();
  });

  return (
    <eui-label
      onTouchTap={() => {
        dispatch(increment());
      }}
    >
      <arrayContainer attach="textFlow" ref={arrayContainer}>
        <objectContainer text={count + ''} style={{ textColor: 0xff0000 }} />
      </arrayContainer>
    </eui-label>
  );
}

//  <font fontfamily="Impact"> can </font>
//  <font fontfamily="Times New Roman ">be set</font>
//  <font color=0xff0000>to a </font>
//  <font> \n </font>
//  <font color=0x00ff00>variety </font>
//  <font color=0xf000f0>of </font>
//  <font color=0x00ffff>styles </font>
//  <font size=56>with </font>
//  <font size=16>different </font>
//  <font size=26>colors, </font>
//  <font> \n </font>
//  <font color=0x00ff00><i>fonts </i></font>
//  <font size=26 color=0xf000f0 fontfamily=\Quaver\">and </font>"
//  <font color=0xf06f00><i>sizes</i></font>
