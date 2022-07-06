import React, { useState } from "react";
import { mediasData } from "./staticData";

export default function Medias() {
  const [medias, setMedias] = useState(mediasData);
  return (
    <eui-group width="100%">
      <eui-rect height="100%" width="100%" fillColor="0xFFFFFF" />
      <eui-group layout="vertical" layout-gap={0} width="100%">
        <eui-group width="100%" height="99">
          <eui-label
            x="26"
            y="32"
            textColor="0x000000"
            size="30"
            fontFamily="Roboto"
          >
            寻求好友的阳光
          </eui-label>
        </eui-group>
        <eui-rect width="100%" height="1" fillColor="0xD8D8D8" />

        <eui-scroller
          width="100%"
          onTouchTap={() => {
            setMedias([...medias.reverse()]);
          }}
        >
          <eui-group
            attach="viewport"
            noUsePool
            layout-gap={68}
            layout="horizontal"
            layout-paddingLeft={42}
            layout-paddingRight={42}
            layout-paddingTop={27}
            layout-paddingBottom={27}
          >
            {medias.map((media, i) => (
              <eui-group layout="vertical" key={i} layout-gap={8}>
                <eui-image source={media.url} />
                <eui-label
                  textAlign="center"
                  width="100%"
                  textColor="0x000000"
                  size="20"
                  fontFamily="Roboto"
                >
                  {media.name}
                </eui-label>
              </eui-group>
            ))}
          </eui-group>
        </eui-scroller>
      </eui-group>
    </eui-group>
  );
}
