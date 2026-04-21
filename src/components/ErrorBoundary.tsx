import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          background: 'var(--bg-card)', 
          borderRadius: 'var(--radius-lg)',
          margin: '2rem auto',
          maxWidth: '600px',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <h2 style={{ color: 'var(--primary)' }}>Oops, something went wrong.</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            We're sorry for the inconvenience. Please try refreshing the page.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
