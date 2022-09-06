import React, { useState } from "react";
import { mediasData } from "./staticData";
import { ItemRendererClass } from "egreact";

export default function Medias() {
  const [medias] = useState(() => new eui.ArrayCollection([...mediasData]));
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
            medias.replaceAll([...medias.source].reverse());
          }}
        >
          <eui-list
            dataProvider={medias}
            attach="viewport"
            layout="horizontal"
            layout-gap={68}
            layout-paddingLeft={42}
            layout-paddingRight={42}
            layout-paddingTop={27}
            layout-paddingBottom={27}
          >
            <ItemRendererClass sync>
              {(data) => (
                <eui-itemRenderer>
                  <eui-group layout="vertical" layout-gap={8}>
                    <eui-image source={data.url} />
                    <eui-label
                      text={data.name}
                      textAlign="center"
                      width="100%"
                      textColor={0x000000}
                      size={20}
                    />
                  </eui-group>
                </eui-itemRenderer>
              )}
            </ItemRendererClass>
          </eui-list>
        </eui-scroller>
      </eui-group>
    </eui-group>
  );
}
