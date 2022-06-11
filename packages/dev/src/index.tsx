import React, { useEffect, useState, useContext } from "react";
import {
  Provider,
  useSelector,
  ReactReduxContext,
  useDispatch
} from "react-redux";
import { RootState, store } from "./store";
import ReactDOM from "react-dom";
import { Egreact, EgreactLink } from "egreact";
import {
  HashRouter,
  BrowserRouter,
  Route,
  Routes,
  Link
} from "react-router-dom";
import { increment } from "./store/counterSlice";
import TestEui from "./components/TestEui";
import TestFont from "./components/TestFont";

function App() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();
  return (
    <div>
      <h1>Hello, Egreact!</h1>
      <div onClick={() => dispatch(increment())}>
        i have been click {count} times!
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "50px"
        }}
      >
        <Link to={"/"}>test for eui</Link>
        <Link to={"font"}>test for font</Link>
      </div>
      <Egreact
        style={{
          margin: "auto",
          width: "100%",
          height: "100%"
        }}
        orientation="auto"
        scaleMode="showAll"
        frameRate="60"
        contentWidth="750"
        contentHeight="1334"
        multiFingered="2"
        showFps="false"
        showLog="false"
        showPaintRect="false"
        showFpsStyle="x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9"
      >
        <eui-group layout="vertical" layout-gap={20}>
          <eui-group
            layout="horizontal"
            layout-gap={20}
            height={50}
            width="100%"
          >
            <EgreactLink to={"/"} textColor={0x000000}>
              test for eui
            </EgreactLink>
            <EgreactLink to={"font"} textColor={0x000000}>
              test for font
            </EgreactLink>
            {/* <eui-label text="Receive" textColor="0xAFAFAF" size="24" />
            <eui-label
              text=" extra water from this friend today"
              textColor="0xAFAFAF"
              size="24"
            /> */}
          </eui-group>
          <Routes>
            <Route path="/" element={<TestEui />} />
            <Route path="font" element={<TestFont />} />
          </Routes>
        </eui-group>
      </Egreact>
    </div>
  );
}
ReactDOM.render(
  <HashRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </HashRouter>,
  document.getElementById("app")
);
