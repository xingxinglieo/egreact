import { ItemRendererClass } from "egreact";
import React, { useState } from "react";
import { FriendData } from "./staticData";

export default function Friends() {
  const [friends] = useState(() => new eui.ArrayCollection([...FriendData]));

  return (
    <eui-group width="100%" layout="vertical" layout-gap={8}>
      <eui-group width="100%">
        <eui-label size="32" left="26" textColor="0x000000" fontFamily="Roboto">
          推荐好友
        </eui-label>
        <eui-label
          size="24"
          right="25"
          verticalCenter="0"
          textAlign="center"
          textColor="0x767676"
          fontFamily="Roboto"
        >
          {"所有好友 >"}
        </eui-label>
      </eui-group>
      <eui-scroller width="100%" height={880}>
        <eui-list
          attach="viewport"
          dataProvider={friends}
          touchEnabled
          layout="vertical"
          width="100%"
          layout-gap={12}
          left={26}
          right={26}
        >
          <ItemRendererClass>
            {(data) => (
              <eui-itemRenderer width={698}>
                <eui-rect
                  width="100%"
                  height="100%"
                  top="0"
                  left="0"
                  fillColor="0xFFFFFF"
                />
                <eui-group
                  width="100%"
                  layout="vertical"
                  onTouchTap={() => console.log(friends.source.indexOf(data))}
                >
                  <eui-group width="100%" height="150">
                    <eui-image
                      source={data.avatar}
                      width="80"
                      height="80"
                      top="34"
                      left="30"
                    />
                    <eui-label
                      text={data.nickname}
                      top="36"
                      left="126"
                      textColor="0x000000"
                      size="32"
                      fontFamily="Roboto"
                    />
                    <eui-label
                      text={data.from}
                      top="82.6"
                      left="126"
                      textColor="0xAFAFAF"
                      size="22"
                      fontFamily="Roboto"
                    />
                    <eui-group right="18" top="60">
                      <eui-rect
                        fillColor="0xFFECB3"
                        width="100%"
                        height="100%"
                        ellipseHeight="60"
                        ellipseWidth="60"
                      />
                      <eui-label
                        text="寻求帮助"
                        top="12"
                        bottom="12"
                        left="22"
                        right="22"
                        textColor="0xFFA000"
                        size="24"
                        textAlign="center"
                        fontFamily="Roboto"
                      />
                    </eui-group>
                  </eui-group>
                  <eui-group width="100%">
                    <eui-rect
                      height="2"
                      fillColor="0xE3E3E3"
                      left="29"
                      right="32"
                    />
                  </eui-group>
                  <eui-group
                    layout="horizontal"
                    layout-gap={8}
                    layout-paddingLeft={30}
                    layout-paddingTop={20}
                    layout-paddingBottom={18}
                  >
                    <eui-label text="接收" textColor="0xAFAFAF" size="24" />
                    <eui-image
                      source={BASE_URL + "Ask/sun.png"}
                      width={20}
                      height={20}
                    />
                    <eui-label text={data.sun} textColor="0xFFC107" size="24" />
                    <eui-label
                      text=" 额外从好友获得"
                      textColor="0xAFAFAF"
                      size="24"
                    />
                  </eui-group>
                </eui-group>
              </eui-itemRenderer>
            )}
          </ItemRendererClass>
        </eui-list>
      </eui-scroller>
    </eui-group>
  );
}
