import React from 'react';
import { BillingCalc } from './BillingCalc';

export const GasBillingTool: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <BillingCalc
    onClose={onClose}
    title="Показания газа"
    label="Введите показания газового счётчика (м³):"
    unit="м³"
    multiplier={2816}
    buttonText="Сформировать счёт за газ"
    resultLabel="Итого к оплате за газ:"
    accent="#fb923c"
  />
);
