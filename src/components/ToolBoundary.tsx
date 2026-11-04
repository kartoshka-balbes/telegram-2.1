import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  resetKey: string | null;
  onError: () => void;
}

interface State {
  hasError: boolean;
}

// Если приложение внутри инструмента «падает», закрываем только его, а не весь интерфейс
export class ToolBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Tool crashed and was closed:', error);
    this.props.onError();
  }

  componentDidUpdate(prev: Props) {
    if (prev.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render(): ReactNode {
    return this.state.hasError ? null : this.props.children;
  }
}
