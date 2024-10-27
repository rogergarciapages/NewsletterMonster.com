// Create new file: src/app/components/brand/profile/header/error-boundary.tsx
"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-500 bg-red-50 rounded-md">
          <h2 className="font-bold">Something went wrong</h2>
          <p className="text-sm">{this.state.error?.message || "An error occurred"}</p>
        </div>
      );
    }

    return this.props.children;
  }
}