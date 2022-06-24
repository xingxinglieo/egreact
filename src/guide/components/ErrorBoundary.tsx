import React from "react";
export default class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
}> {
  state: { error: any } = { error: false };

  static getDerivedStateFromError(error) {
    console.log(1111, error);
    return { error };
  }

  render() {
    if (this.state.error) {
      // 你可以自定义降级后的 UI 并渲染
      return (
        <h2 style={{ color: "rgb(206, 17, 38)" }}>
          {this.state.error.message}
        </h2>
      );
    }
    return this.props.children;
  }
}
