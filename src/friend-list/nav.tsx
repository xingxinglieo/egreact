import React from "react";
export default function Nav() {
  return (
    <eui-group height="128" width="100%">
      <eui-rect width="100%" height="100%" fillColor="0xFFFFFF" />
      <eui-image
        x="16"
        y="72"
        width="44"
        height="35"
        source={BASE_URL + "Ask/button_back.png"}
      />
      <eui-label
        textColor="0x000000"
        size="36"
        verticalCenter="0"
        horizontalCenter="0"
        fontFamily="Roboto"
      >
        好友列表
      </eui-label>
    </eui-group>
  );
}
