import React from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { RootState, store } from "./store";
import { createRoot } from "react-dom/client";
import { Egreact } from "egreact";
import {
  HashRouter,
  BrowserRouter,
  Route,
  Routes,
  Link
} from "react-router-dom";
import { increment } from "./store/counterSlice";
global.BASE_URL = "/resource/assets/";
import TestEui from "./components/friend-list";
import TestFont from "./components/TestFont";
import TestPrimitive from "./components/TestPrimitive";
import { EgreactLink } from "./components/EgreactLink";
function App() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();
  return (
    <div>
      <h1>
        Hello, Egreact!
        <Routes>
          <Route path="/" element={"At eui"} />
          <Route path="font" element={"At font"} />
          <Route path="primitive" element={"At primitive"} />
        </Routes>
      </h1>
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
        <Link to={"primitive"}>test for primitive</Link>
      </div>
      <Egreact
        style={{
          margin: "auto",
          width: "100%",
          height: "100%"
        }}
        scaleMode="showAll"
        orientation="auto"
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
            <EgreactLink to={"primitive"} textColor={0x000000}>
              test for primitive
            </EgreactLink>
          </eui-group>
          <Routes>
            <Route path="/" element={<TestEui />} />
            <Route path="font" element={<TestFont />} />
            <Route path="primitive" element={<TestPrimitive />} />
          </Routes>
        </eui-group>
      </Egreact>
    </div>
  );
}
createRoot(document.getElementById("app")).render(
  <HashRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </HashRouter>
);
