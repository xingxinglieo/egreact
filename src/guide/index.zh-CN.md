---
title: 介绍
order: 1
toc: menu
nav:
  title: 指南
  order: 1
---

## 什么是 egreact ？

egreact 是一个为 [egret](https://www.egret.com/products) 引擎而生的 React 渲染器，它让你可以使用 React 编写 egret UI 界面。

## 为什么？

虽然 egret 提出了 exml 作为官方的 UI 描述语言，可以一定程度上提高编写 UI 的效率，但以当前的前端开发视角来看，exml 糟糕的编写体验和孤立的生态已经落后于主流了。egreact 正是为解决这些问题而诞生：

1. jsx 编写组件：
  - 因为 exml 在表达能力上与 jsx 的差距，相同功能的视图只需一半代码量
  - jsx 编译后的 js 文件大小是 exml 编译后的 json 文件大小的一半
  - 无需编译器、额外的打包
  - 提供详尽的类型提示
2. 接洽 React 生态，可以使用 hooks 复用逻辑，也可以使用 redux、mobx、react-router 等库进行状态管理和路由管理。

### egreact 有什么限制吗？

没有，它只是帮你提高编写 UI 效率的工具。
- [直接使用 `createEgreactRoot` 像皮肤一样渲染](/guide/basic#createegreactroot)
- 已经写好的组件使用可以[使用 `primitive` 标签嵌入](/components/custom)。

### 我需要 egreact 吗？

egreact 的目的是取代 exml 编写游戏中传统的 UI 界面，而非高交互的游戏模块，较为理想的做法是采用混合开发：UI 界面采用 egreact 编写，而游戏模块使用 `primitive` 标签嵌入界面中。不过，即使你的 UI 界面很少，egreact 也值得一试。它不是只能渲染一个根组件，也可以通过创建多个 egreact 根节点管理多个小的组件，就像 eui 的皮肤一样。
