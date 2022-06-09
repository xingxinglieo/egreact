import { defineConfig } from 'dumi';
import path from 'path';
export default defineConfig({
  title: 'egreact',
  mode: 'site',
  locales: [['zh-CN', '中文']],
  favicon:
    '/egreact.png',
  logo:
    '/egreact.png',
  outputPath: 'docs-dist',
  // more config: https://d.umijs.org/config
    // "dumi-theme-mobile": "^1.1.22",
  headScripts: [
    { src: 'https://cdn.jsdelivr.net/npm/egret-engine@5.2.18/build/egret/egret.min.js' },
    { src: 'https://cdn.jsdelivr.net/npm/egret-engine@5.2.18/build/egret/egret.web.min.js' },
    { src: 'https://cdn.jsdelivr.net/npm/egret-engine@5.2.18/build/eui/eui.min.js' },
    { src: 'https://cdn.jsdelivr.net/npm/egret-engine@5.2.18/build/assetsmanager/assetsmanager.min.js' },
    { src: 'https://cdn.jsdelivr.net/npm/egret-engine@5.2.18/build/tween/tween.min.js' },
  ],
  chainWebpack: (memo, { env, webpack }) => {
    memo.module.rule('js').include.add(path.resolve('../core/src')).end();
  },
});
