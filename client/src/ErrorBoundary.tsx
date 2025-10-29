import React from "react";

type State = {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
};

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: any) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service here
    // console.error(error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 20, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
          <h2>Something went wrong</h2>
          <div>
            <strong>{this.state.error?.toString()}</strong>
          </div>
          <details style={{ marginTop: 10 }}>
            {this.state.errorInfo?.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}
