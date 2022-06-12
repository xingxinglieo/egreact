import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { increment } from "../store/counterSlice";

export default () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();
  return (
    <sprite
      onTouchTap={() => dispatch(increment())}
      graphics={[
        ["beginFill", 0x000000],
        ["drawRect", 0, 0, 300, 100],
        ["endFill"],
      ]}
    >
      <textField size={16}>{`i have been click ${count} times!`}</textField>
      <displayObjectContainer>
        <displayObject x={100} mountedApplyProps />
      </displayObjectContainer>
    </sprite>
  );
};
