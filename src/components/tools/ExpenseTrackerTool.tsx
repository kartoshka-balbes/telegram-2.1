import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { DollarSign, Plus, PieChart, TrendingDown, TrendingUp, CreditCard } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: 'expense' | 'income';
}

export const ExpenseTrackerTool: React.FC<ToolProps> = ({ onClose }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', title: 'Продукты в Пятерочке', amount: 1450, category: 'Продукты', type: 'expense' },
    { id: '2', title: 'Оплата метро и такси', amount: 680, category: 'Транспорт', type: 'expense' },
    { id: '3', title: 'Аванс по зарплате', amount: 45000, category: 'Доход', type: 'income' },
    { id: '4', title: 'Кофе и обед в кафе', amount: 890, category: 'Кафе', type: 'expense' },
  ]);

  const [titleInput, setTitleInput] = useState('');
  const [amountInput, setAmountInput] = useState('');

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput || !amountInput) return;
    soundManager.playBeep(1000, 0.1);
    const newTx: Transaction = {
      id: Date.now().toString(),
      title: titleInput,
      amount: parseFloat(amountInput),
      category: 'Разное',
      type: 'expense',
    };
    setTransactions([newTx, ...transactions]);
    setTitleInput('');
    setAmountInput('');
  };

  return (
    <ToolWrapper title="Трекер расходов & Бюджет" onClose={onClose} headerColor="bg-emerald-950 border-emerald-900">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-mono text-xs select-none space-y-3">
        {/* Balance Card Header */}
        <div className="bg-slate-900 border-2 border-emerald-500 p-4 rounded-2xl space-y-3 shadow-2xl">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Общий баланс:</div>
          <div className="text-3xl font-black text-white font-mono">{balance.toLocaleString()} ₽</div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <TrendingUp className="w-4 h-4" /> Доход: +{totalIncome.toLocaleString()} ₽
            </div>
            <div className="flex items-center gap-1.5 text-rose-400 font-bold">
              <TrendingDown className="w-4 h-4" /> Расход: -{totalExpense.toLocaleString()} ₽
            </div>
          </div>
        </div>

        {/* Add Transaction Form */}
        <form onSubmit={handleAddExpense} className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex gap-2">
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            placeholder="Название расхода..."
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none font-bold text-xs"
          />
          <input
            type="number"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            placeholder="Сумма ₽"
            className="w-24 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-2 py-2 text-white outline-none font-bold text-xs font-mono"
          />
          <button
            type="submit"
            className="px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black cursor-pointer shadow"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        {/* Transactions List */}
        <div className="space-y-1.5 overflow-y-auto max-h-[220px] pr-1">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center"
            >
              <div>
                <h4 className="font-bold text-xs text-white">{t.title}</h4>
                <span className="text-[10px] text-slate-400">{t.category}</span>
              </div>
              <span
                className={`font-black text-xs ${
                  t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()} ₽
              </span>
            </div>
          ))}
        </div>
      </div>
    </ToolWrapper>
  );
};
