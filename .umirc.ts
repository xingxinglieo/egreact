import { defineConfig } from "dumi";
import path from "path";
export default defineConfig({
  title: "egreact",
  mode: "site",
  locales: [["zh-CN", "中文"]],
  base: "/egreact/",
  publicPath: "/egreact/",
  favicon: "https://xingxinglieo.github.io/egreact/egreact.png",
  logo: "https://xingxinglieo.github.io/egreact/egreact.png",
  outputPath: "docs-dist",
  algolia: {
    appId: "TPWQARCSPT",

    apiKey: "5c876491aeb67cca020a391f9aecca16",

    indexName: "egreact",
  },
  navs: [
    null, // null 值代表保留约定式生成的导航，只做增量配置
    {
      title: "问题反馈",
      path: "https://github.com/xingxinglieo/egreact/issues",
    },
    {
      title: "更新日志",
      path: "https://github.com/xingxinglieo/egreact/releases",
    },
  ],
  // more config: https://d.umijs.org/config
  // "dumi-theme-mobile": "^1.1.22",
  headScripts: [
    {
      src: "https://cdn.jsdelivr.net/npm/egret-engine/build/egret/egret.min.js",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/egret-engine/build/egret/egret.web.min.js",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/egret-engine/build/eui/eui.min.js",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/egret-engine/build/assetsmanager/assetsmanager.min.js",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/egret-engine/build/tween/tween.min.js",
    },
  ],
  chainWebpack: (memo, { env, webpack }) => {
    memo.module.rule("js").include.add(path.resolve("../core/dist")).end();
  },
});
