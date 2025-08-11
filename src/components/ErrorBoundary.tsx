'use client';

import React from 'react';
import { NavDebugBus } from '@/state/navDebugBus';

type Props = { children: React.ReactNode };
type State = { error: Error | null; info: React.ErrorInfo | null };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null, info: null };

  static getDerivedStateFromError(error: Error): State {
    return { error, info: null };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ error, info });
    const ts = performance.now();
    if (typeof error.stack === 'string') {
      NavDebugBus.emit({ type: 'error', message: error.message, stack: error.stack, ts });
    } else {
      NavDebugBus.emit({ type: 'error', message: error.message, ts });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="p-4 m-4 border border-red-500/40 bg-red-500/5 rounded-md text-red-300">
          <div className="font-semibold">A render error occurred.</div>
          <div className="mt-2 text-sm">{this.state.error.message}</div>
          {this.state.info?.componentStack && (
            <pre className="mt-3 text-xs whitespace-pre-wrap opacity-80">{this.state.info.componentStack}</pre>
          )}
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}




