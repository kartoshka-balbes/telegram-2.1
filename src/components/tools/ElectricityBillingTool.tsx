import React from 'react';
import { BillingCalc } from './BillingCalc';

export const ElectricityBillingTool: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <BillingCalc
    onClose={onClose}
    title="Показания электроэнергии"
    label="Введите текущие показания счётчика (кВт·ч):"
    unit="кВт·ч"
    multiplier={182}
    buttonText="Сформировать счёт за свет"
    resultLabel="Сформирован квитанционный счёт:"
    accent="#facc15"
  />
);
