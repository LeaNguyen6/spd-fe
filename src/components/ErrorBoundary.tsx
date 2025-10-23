import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
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
                <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="text-center max-w-md">
                        <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
                        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
                        <p className="text-muted-foreground mb-6">
                            An unexpected error occurred. Please try refreshing the page.
                        </p>
                        <div className="space-y-2">
                            <Button
                                onClick={() => window.location.reload()}
                                className="w-full"
                            >
                                Refresh Page
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => this.setState({ hasError: false, error: undefined })}
                                className="w-full"
                            >
                                Try Again
                            </Button>
                        </div>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-4 p-4 bg-muted rounded-lg text-left">
                                <summary className="cursor-pointer font-medium">Error Details</summary>
                                <pre className="mt-2 text-xs overflow-auto">
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;