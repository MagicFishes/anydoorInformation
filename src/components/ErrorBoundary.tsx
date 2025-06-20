// src/components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('全局错误:', error, errorInfo);
    // 上报错误到监控系统
    reportErrorToService(error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>发生错误，请重试</div>;
    }
    return this.props.children;
  }
}

function reportErrorToService(error: Error) {
    throw new Error('Function not implemented.');
}
