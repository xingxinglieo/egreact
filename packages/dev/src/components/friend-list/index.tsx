import React, { useRef, useEffect } from "react";
import Nav from "./nav";
import Medias from "./medias";
import Friends from "./friends";
export default function FriendList() {
  return (
    <eui-group width={750} height={1334}>
      <eui-rect width="100%" height="100%" fillColor="0xE5E5E5" />
      <eui-scroller width="100%" height="100%">
        <eui-group
          width="100%"
          height="100%"
          attach="viewport"
          layout="vertical"
          layout-gap={12}
        >
          <Nav />
          <Medias />
          <Friends />
        </eui-group>
      </eui-scroller>
    </eui-group>
  );
}
