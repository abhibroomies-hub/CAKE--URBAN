import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ServerErrorView } from './FeedbackStates';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error inside CakeUrban boundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFF9FC] flex items-center justify-center">
          <ServerErrorView />
        </div>
      );
    }

    return this.props.children;
  }
}
