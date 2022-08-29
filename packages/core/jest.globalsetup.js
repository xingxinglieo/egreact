const path = require('path')
const fs = require('fs')
const egretNodeModulesPath = '../../node_modules/egret-engine/build'
var egret
var eui
// var dragonBones
var RES
var EXML
var Benchmark
let content
content = fs.readFileSync(path.resolve(egretNodeModulesPath, 'egret/egret.js'), 'utf-8')
eval(content)
content = fs.readFileSync(path.resolve(egretNodeModulesPath, 'egret/egret.web.js'), 'utf-8')
eval(content)
content = fs.readFileSync(path.resolve(egretNodeModulesPath, 'eui/eui.js'), 'utf-8')
eval(content)
content = fs.readFileSync(path.resolve(egretNodeModulesPath, 'assetsmanager/assetsmanager.js'), 'utf-8')
eval(content)
content = fs.readFileSync(path.resolve(egretNodeModulesPath, 'tween/tween.js'), 'utf-8')
eval(content)
global.egret = egret
global.eui = eui
global.RES = RES
global.EXML = EXML
global.__extends = __extends

// window.__DEV__ = true
global.sLog = function () {}
process.env.NODE_ENV = 'devlopment'
// 可以检查未处理的Error;
process.on('unhandledRejection', (reason) => {
  throw reason
})

