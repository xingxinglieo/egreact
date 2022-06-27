export const mediasData = [
  {
    url: BASE_URL + "Ask/whatsapp.png",
    name: "Whatsapp",
  },
  {
    url: BASE_URL + "Ask/instagram.png",
    name: "Instagram",
  },
  {
    url: BASE_URL + "Ask/line.png",
    name: "Line",
  },
  ...new Array(6).fill(0).map(() => ({
    url: BASE_URL + "Ask/facebook.png",
    name: "Facebook",
  })),
];

export const friendInfos = [
  {
    avatar: BASE_URL + "Ask/avatar_1.png",
    nickname: "Egreact",
    from: "手机联系人",
    sun: 50,
  },
  {
    avatar: BASE_URL + "Ask/avatar_2.png",
    nickname: "React",
    from: "手机联系人",
    sun: 50,
  },
  ...new Array(6).fill(0).map(() => ({
    avatar: BASE_URL + "Ask/avatar_3.png",
    nickname: "Redux",
    from: "游戏好友",
    sun: 50,
  })),
];
