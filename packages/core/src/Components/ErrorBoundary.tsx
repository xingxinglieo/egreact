import React from 'react'

export class ErrorBoundary extends React.Component<
  { set: React.Dispatch<Error>; children: React.ReactNode },
  { error: boolean }
> {
  state = { error: false }
  static getDerivedStateFromError = () => ({ error: true })
  componentDidCatch(error: any) {
    this.props.set(error)
    this.setState({ error })
  }
  render() {
    return this.state.error ? null : this.props.children
  }
}
