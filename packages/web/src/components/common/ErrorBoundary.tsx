'use client';
import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; message: string; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="rounded-lg border border-red-700 bg-red-900/20 p-6 text-center">
          <p className="text-red-400 font-semibold">Something went wrong</p>
          <p className="text-sm text-slate-400 mt-1">{this.state.message}</p>
          <button
            className="mt-4 px-4 py-2 bg-slate-700 rounded hover:bg-slate-600 text-sm"
            onClick={() => this.setState({ hasError: false, message: '' })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
