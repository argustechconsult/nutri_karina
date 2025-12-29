import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '20px',
            textAlign: 'center',
            fontFamily: 'sans-serif',
          }}
        >
          <h1>Algo deu errado.</h1>
          <p>
            Se o erro persistir, tente limpar o cache ou contatar o suporte.
          </p>
          <pre
            style={{
              maxWidth: '100%',
              overflow: 'auto',
              background: '#f0f0f0',
              padding: '10px',
              marginTop: '20px',
            }}
          >
            {this.state.error?.message}
          </pre>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#e11d48',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Limpar Dados e Recarregar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
