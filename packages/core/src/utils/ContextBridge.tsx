/*
关于 context 共享, react-three 的一种较为完善的解决方案:
https://standard.ai/blog/introducing-standard-view-and-react-three-fiber-context-bridge/
*/
import React, { memo, useContext, useEffect, useState } from 'react'

export class CallBackArray<T = any> extends Array<T> {
  callback = () => void 0
  constructor() {
    super()
    return new Proxy(this, {
      set(target, key, value, receiver) {
        Reflect.set(target, key, value, receiver)
        if (key !== 'setCallback') {
          target?.callback?.()
        }
        return true
      },
    }) as typeof this
  }
  setCallback(callback: () => void) {
    this.callback = callback
  }
}

/*
The ContextProviders component pushes context value updates to all the children inside the Canvas component. 
It takes a list of contexts and a list of values from the ContextListeners and the children of Canvas.
ContextProvider 组件将上下文值更新推送到 Canvas 组件内的所有子级。
它从 ContextListener 和 Canvas 的子元素获取 contexts 和 values 列表。

Again we need to work around the rules of hooks. 
We use a reduce function to recursively embed the <Context.Provider /> components.
我们需要再次绕过钩子的规则。我们使用 reduce 函数递归地嵌入 < Context.Provider/> 组件。

We need a way to tell React to recheck the context values. 
The useFrame hook provided by react-three-fiber is used to queue up this check before the next render call executes.
我们需要一种方法来告诉 React 重新检查上下文值。
在执行下一个呈现调用之前，使用 response-three-迫纤维提供的 useFrame 钩子来对这个检查进行排队。
(已使用更好的方法，用对 value 进行 proxy，然后监听其值改变即可)

An empty update setter is used to force React to recheck whether the component needs re-rendering.
空的更新设置器用于强制 React 重新检查组件是否需要重新呈现。
*/
export const ContextProviders = memo(
  ({
    contexts,
    values,
    children,
  }: {
    contexts: React.Context<any>[]
    values: CallBackArray
    children: React.ReactNode
  }) => {
    const [, update] = useState({})
    useEffect(() => {
      values.setCallback(() => update({}))
      return () => values.setCallback(() => void 0)
    }, [])

    return contexts.reduce(
      (child, Context, index) => <Context.Provider value={values[index]}>{child}</Context.Provider>,
      children,
    ) as JSX.Element
  },
)

/* 
The ContextListeners component listens for changes from the outer contexts. 
To achieve this we need access to the list of contexts and a list of each contexts' value. 
Then for each, we cache each value into a shared list.

ContextListener 组件侦听来自外部 contexts 的更改。
为了实现这一点，我们需要遍历 contexts 和每个 context 的值。
然后对于每个值，我们将每个值缓存到一个共享数组中。
*/
export const ContextListeners = memo(
  ({ contexts, values }: { contexts: React.Context<any>[]; values: any[] }) => (
    // We want to loop through the contexts, but this violates the rules of hooks.
    // 我们希望循环遍历 contexts，但是这破坏了 hooks 的规则（useContext 必须是固定数量，但 contexts 的长度会变化）。
    // Using a map function is a workaround for the check.
    // 使用 map 函数是为了解决这个问题。
    <>
      {contexts.map((context, index) => (
        <ContextListener key={index} context={context} values={values} index={index} />
      ))}
    </>
  ),
)

export const ContextListener = memo(
  ({ context, values, index }: { context: React.Context<any>; values: any[]; index: number }) => {
    const p = values[index]
    values[index] = useContext(context)
    return null
  },
)
