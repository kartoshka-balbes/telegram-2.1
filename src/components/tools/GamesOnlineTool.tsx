import React, { useEffect } from 'react';

interface ToolProps {
  onClose: () => void;
}

// Без интерфейса. Сайт открывается по нажатию на плитку, приложение сразу закрывается.
export const GamesOnlineTool: React.FC<ToolProps> = ({ onClose }) => {
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};
