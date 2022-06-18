---
title: 介绍
order: 1
toc: menu
nav:
  title: 指南
  order: 1
---

## 什么是 egreact ？

egreact 是一个为 [egret](https://www.egret.com/products) 引擎而生的 React 渲染器，它让你可以使用 React 编写 UI 界面。

## 为什么？

虽然 egret 提出了 exml 作为官方的 UI 描述语言，可以一定程度上提高编写 UI 的效率，但以当前的前端开发视角来看，exml 糟糕的编写体验和孤立的生态已经落后于主流了。egreact 正是为解决这些问题而诞生：

1. tsx 编写组件，内置组件提供详尽的类型提示。
2. 接洽 React 生态，可以使用 hooks 复用逻辑，也可以使用 Redux、react-router 等库进行状态管理和路由管理。

### egreact 有什么限制吗？

没有。egret 能做什么它就能做什么。

### 我需要 egreact 吗？

egreact 的目的是取代 exml 编写游戏中传统的 UI 界面，而非高交互的游戏模块，较为理想的做法是采用混合开发：UI 界面采用 egreact 编写，而游戏模块使用`primitive`标签嵌入界面中。不过，即使你的 UI 界面很少，egreact 也值得一试。它不是只能渲染一个根组件，也可以通过创建多个 egreact 渲染器管理多个小的组件，就像 eui 的皮肤一样。
