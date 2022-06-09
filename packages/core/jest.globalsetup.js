const path = require('path')
const fs = require('fs')
const egretNodeModulesPath = './libs'
var egret
var eui
// var dragonBones
var RES
var EXML
var Benchmark
let content
content = fs.readFileSync(path.resolve(egretNodeModulesPath, 'egret.js'), 'utf-8')
eval(content)
content = fs.readFileSync(path.resolve(egretNodeModulesPath, 'egret.web.js'), 'utf-8')
eval(content)
content = fs.readFileSync(path.resolve(egretNodeModulesPath, 'eui.js'), 'utf-8')
eval(content)
content = fs.readFileSync(
  path.resolve(egretNodeModulesPath, 'assetsmanager.js'),
  'utf-8',
)
eval(content)
content = fs.readFileSync(path.resolve(egretNodeModulesPath, 'tween.js'), 'utf-8')
eval(content)
global.egret = egret
global.eui = eui
global.RES = RES
global.EXML = EXML
global.__extends = __extends

global.sLog = function () {}

// 可以检查未处理的Error;
process.on('unhandledRejection', (reason) => {
  throw reason
})
