import React from "react";

type Props = { children: React.ReactNode };
type State = { error: Error | null };

export class RouteErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Route error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main id="main" style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
          <h1>Something went wrong</h1>
          <p style={{ opacity: 0.7 }}>
            The page failed to load. Try again or pick another region.
          </p>
          <pre style={{ whiteSpace: "pre-wrap", opacity: 0.7 }}>
            {this.state.error.message}
          </pre>
        </main>
      );
    }
    return this.props.children;
  }
}