# useContextBridge
```tsx
const Context1 = createContext()
const Context2 = createContext()
const contexts = [Context1, Context2]

function Test(){
    const { ContextListeners, ContextProviders } = useContextBridge(contexts)

    useEffect(()=>{
        // in others renderer, so you can share context
        createRoot(document.createElement('div')).render(
            <ContextProviders>
              <YourComponent />
            </ContextProviders>
        )
    },[])

    return (
        // insert it anywhere
        <ContextListeners />
        <div>{/* ... */}</div>
    )
}
```

# createContext

```tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { createContext } from "react-context-bridge";

const Context = createContext<any>(false);

const Provider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [toggle, setToggle] = React.useState(false);

  return (
    <Context.Provider value={{ toggle, setToggle }}>
      {children}
    </Context.Provider>
  );
};

const ToggleButton = () => {
  const { toggle, setToggle } = Context.useContext();
  return (
    <button onClick={() => setToggle(!toggle)}>{toggle ? "on" : "off"}</button>
  );
};

const Page = () => {
  const { toggle } = Context.useContext();
  return toggle ? <div>1</div> : <div>0</div>;
};

const arr = [...new Array(10).keys()];
const App: React.FC = () => {
  React.useLayoutEffect(() => {
    arr.forEach((_, idx) => {
      const ele = document.getElementById("hook" + idx);
      if (ele) {
        createRoot(ele).render(
          <Context.Injector>
            {idx % 2 === 0 ? <Page /> : <ToggleButton />}
          </Context.Injector>
        );
      }
    });
  }, []);

  return (
    <Provider>
      <Page />
      {arr.map((_, idx) => (
        <div id={"hook" + idx} key={idx}></div>
      ))}
    </Provider>
  );
};

export default App;
```