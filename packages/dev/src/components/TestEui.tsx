import React, { useEffect, useMemo } from "react";
import { useState, useRef } from "react";
import { EventProp } from 'egreact'
console.log(EventProp.eventSetter)
export default function Test() {
  const [medias, setMedias] = useState([
    {
      url: "resource/assets/Ask/whatsapp.png",
      name: "Whatsapp"
    },
    {
      url: "resource/assets/Ask/instagram.png",
      name: "Instagram"
    },
    {
      url: "resource/assets/Ask/line.png",
      name: "Line"
    },
    {
      url: "resource/assets/Ask/facebook.png",
      name: "Facebook"
    },
    {
      url: "resource/assets/Ask/facebook.png",
      name: "Facebook"
    },
    {
      url: "resource/assets/Ask/facebook.png",
      name: "Facebook"
    },
    {
      url: "resource/assets/Ask/facebook.png",
      name: "Facebook"
    },
    {
      url: "resource/assets/Ask/facebook.png",
      name: "Facebook"
    },
    {
      url: "resource/assets/Ask/facebook.png",
      name: "Facebook"
    },
    {
      url: "resource/assets/Ask/facebook.png",
      name: "Facebook"
    }
  ]);
  const friendInfos = useMemo(
    () => [
      {
        avatar: "resource/assets/Ask/avatar_1.png",
        nickname: "Huasasa",
        from: "Interact friend from Fruit Game",
        water: 50
      },
      {
        avatar: "resource/assets/Ask/avatar_2.png",
        nickname: "Eason",
        from: "Interact friend from Fruit Game",
        water: 50
      },
      {
        avatar: "resource/assets/Ask/avatar_3.png",
        nickname: "Kaley",
        from: "Interact friend from Fruit Game",
        water: 50
      }
    ],
    []
  );
  const scroller = useRef<eui.Scroller>(null!);
  // const scrollerBar = useRef<eui.HScrollBar>(null!);
  useEffect(() => {
    // scroller.current.addChild(scrollerBar.current);
  }, []);
  return (
    <eui-scroller width={750} height={1334}>
      <eui-group width="100%">
        <eui-rect width="100%" height="100%" fillColor="0xE5E5E5" />
        <eui-group width="100%" layout="vertical" layout-gap={12}>
          <eui-group height="128" width="100%">
            <eui-rect width="100%" height="100%" fillColor="0xFFFFFF" />
            <eui-image
              x="16"
              y="72"
              width="44"
              height="35"
              source="resource/assets/Ask/button_back.png"
            />
            <eui-label
              textColor="0x000000"
              size="36"
              verticalCenter="0"
              horizontalCenter="0"
              fontFamily="Roboto"
            >
              Ask For Water
            </eui-label>
          </eui-group>
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
                  Ask for help via social media
                </eui-label>
              </eui-group>
              <eui-rect width="100%" height="1" fillColor="0xD8D8D8" />

              <eui-scroller
                ref={scroller}
                width="100%"
                onTouchTap={() => {
                  setMedias([...medias.reverse()]);
                }}
              >
                <eui-group
                  attach="viewport"
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
          <eui-group width="100%" layout="vertical" layout-gap={8}>
            <eui-group width="100%">
              <eui-label
                size="32"
                left="26"
                textColor="0x000000"
                fontFamily="Roboto"
              >
                Recommended Friends
              </eui-label>
              <eui-label
                width="157"
                size="24"
                right="25"
                verticalCenter="0"
                textAlign="center"
                textColor="0x767676"
                fontFamily="Roboto"
              >
                {"All Friends >"}
              </eui-label>
            </eui-group>
            <eui-group width="100%">
              <eui-group layout="vertical" layout-gap={12} left={26} right={26}>
                {friendInfos.map((data) => (
                  <eui-group
                    width="698"
                    onUiCreationComplete={(e) => console.log(e)}
                    key={data.nickname}
                  >
                    <eui-rect
                      width="100%"
                      height="100%"
                      top="0"
                      left="0"
                      fillColor="0xFFFFFF"
                    />
                    <eui-group width="100%" layout="vertical">
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
                            fillColor="0xDFEDFC"
                            width="100%"
                            height="100%"
                            ellipseHeight="60"
                            ellipseWidth="60"
                          />
                          <eui-label
                            text="Ask For Water"
                            top="12"
                            bottom="12"
                            left="22"
                            right="22"
                            textColor="0x006EF5"
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
                        <eui-label
                          text="Receive"
                          textColor="0xAFAFAF"
                          size="24"
                        />
                        <eui-image source="resource/assets/Ask/water.png" />
                        <eui-label
                          text={data.water}
                          textColor="0x22CCF5"
                          size="24"
                        />
                        <eui-label
                          text=" extra water from this friend today"
                          textColor="0xAFAFAF"
                          size="24"
                        />
                      </eui-group>
                    </eui-group>
                  </eui-group>
                ))}
              </eui-group>
            </eui-group>
          </eui-group>
        </eui-group>
      </eui-group>
    </eui-scroller>
  );
}
