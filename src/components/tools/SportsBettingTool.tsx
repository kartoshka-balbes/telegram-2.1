import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Trophy, DollarSign, TrendingUp, CheckCircle2, ShieldAlert } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface Match {
  id: string;
  teams: string;
  league: string;
  o1: number;
  oX: number;
  o2: number;
}

const MATCHES: Match[] = [
  { id: '1', teams: 'Реал Мадрид — Барселона', league: 'Футбол (Ла Лига)', o1: 2.15, oX: 3.50, o2: 3.10 },
  { id: '2', teams: 'СКА — ЦСКА', league: 'Хоккей (КХЛ)', o1: 2.10, oX: 4.10, o2: 2.80 },
  { id: '3', teams: 'Лейкерс — Голден Стэйт', league: 'Баскетбол (НБА)', o1: 1.85, oX: 12.0, o2: 2.05 },
  { id: '4', teams: 'Ронни О’Салливан — Джадд Трамп', league: 'Бильярд (Снукер Мастерс)', o1: 1.70, oX: 8.00, o2: 2.20 },
  { id: '5', teams: 'Феликс Земдегс — Макс Парк (Скорость сборки)', league: 'Кубик Рубика (WCA Final)', o1: 1.95, oX: 15.0, o2: 1.90 },
  { id: '6', teams: 'Новак Джокович — Карлос Алькарас', league: 'Теннис (Уимблдон)', o1: 2.00, oX: 10.0, o2: 1.90 },
  { id: '7', teams: 'Виктор Аксельсен — Кенто Момота', league: 'Бадминтон (BWF World Tour)', o1: 1.65, oX: 9.00, o2: 2.30 },
  { id: '8', teams: 'Ма Лун — Фань Чжэньдун', league: 'Настольный теннис (ITTF)', o1: 1.80, oX: 11.0, o2: 2.10 },
  { id: '9', teams: 'Сборная Бразилии — Сборная России', league: 'Пляжный футбол (ЧМ)', o1: 2.40, oX: 4.50, o2: 2.10 },
  { id: '10', teams: 'Зенит-Казань — Белогорье', league: 'Волейбол (Суперлига)', o1: 1.50, oX: 8.50, o2: 2.70 },
  { id: '11', teams: 'Мол & Сорум — Красильников & Стояновский', league: 'Пляжный волейбол (FIVB)', o1: 1.90, oX: 9.00, o2: 1.95 },
  { id: '12', teams: 'Дельфины Сочи — Водяные Акулы', league: 'Водный волейбол (Кубок Мира)', o1: 2.20, oX: 5.00, o2: 2.00 },
  { id: '13', teams: 'Олл Блэкс (Новая Зеландия) — Спрингбокс (ЮАР)', league: 'Регби (Кубок Мира)', o1: 1.75, oX: 18.0, o2: 2.25 },
  { id: '14', teams: 'Роман Рейнс — Джон Сина', league: 'Рестлинг (WrestleMania)', o1: 1.40, oX: 20.0, o2: 3.20 },
  { id: '15', teams: 'Артур Бетербиев — Дмитрий Бивол', league: 'Бокс (Бой за титул)', o1: 1.90, oX: 16.0, o2: 1.95 },
  { id: '16', teams: 'Ислам Махачев — Арман Царукян', league: 'Смешанные единоборства (UFC 310)', o1: 1.45, oX: 25.0, o2: 3.10 },
  { id: '17', teams: 'Рафаэль Агаев — Кэндзи Гранд', league: 'Карате (WKF)', o1: 1.60, oX: 10.0, o2: 2.40 },
  { id: '18', teams: 'Федор Емельяненко — Вадим Немков (Спаринг)', league: 'Самбо (ЧМ)', o1: 1.80, oX: 12.0, o2: 2.00 },
  { id: '19', teams: 'Жеребец Молния — Скакун Ураган', league: 'Конные скачки (Дерби)', o1: 3.10, oX: 15.0, o2: 1.50 },
  { id: '20', teams: 'Янник Борель — Рубен Лимардо', league: 'Фехтование (Олимпиада)', o1: 1.85, oX: 14.0, o2: 2.00 },
  { id: '21', teams: 'Ким У Джин — Брэди Эллисон', league: 'Стрельба из лука (Финал)', o1: 1.70, oX: 12.0, o2: 2.20 },
];

export const SportsBettingTool: React.FC<ToolProps> = ({ onClose }) => {
  const [selectedMatch, setSelectedMatch] = useState<Match>(MATCHES[0]);
  const [selectedOutcome, setSelectedOutcome] = useState<'P1' | 'X' | 'P2'>('P1');
  const [betAmount, setBetAmount] = useState('1000');
  const [placedBet, setPlacedBet] = useState<string | null>(null);

  const getCoef = () => {
    if (selectedOutcome === 'P1') return selectedMatch.o1;
    if (selectedOutcome === 'X') return selectedMatch.oX;
    return selectedMatch.o2;
  };

  const coef = getCoef();
  const possibleWin = Math.round(parseFloat(betAmount || '0') * coef);

  const handlePlaceBet = () => {
    if (!betAmount || parseFloat(betAmount) <= 0) return;
    soundManager.playBeep(1200, 0.15);
    setPlacedBet(`Ставка ${betAmount} ₽ на ${selectedOutcome} принята! Возможный выигрыш: ${possibleWin} ₽`);
  };

  return (
    <ToolWrapper title="1xBet Ставки на спорт онлайн" onClose={onClose} headerColor="bg-[#12151e] border-[#222840]">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-sans text-xs select-none space-y-3">
        {/* Matches Selector */}
        <div className="bg-[#12151e] border border-[#222840] p-3.5 rounded-2xl space-y-2 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <span className="text-[10px] text-gray-400 font-extrabold uppercase block">Выберите дисциплину ({MATCHES.length} дисциплин):</span>
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {MATCHES.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  soundManager.playBeep(800, 0.05);
                  setSelectedMatch(m);
                  setPlacedBet(null);
                }}
                className={`w-full p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedMatch.id === m.id
                    ? 'bg-[#222840] border-[#8f9bff] text-white shadow-[0_0_10px_rgba(143,155,255,0.2)]'
                    : 'bg-[#171b27] border-[#222840] text-gray-300 hover:border-[#8f9bff]/40'
                }`}
              >
                <div className="font-bold text-xs">{m.teams}</div>
                <div className="text-[10px] text-[#8f9bff] font-semibold">{m.league}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Odds & Outcome Selector */}
        <div className="bg-[#12151e] border border-[#222840] p-4 rounded-2xl space-y-3">
          <span className="text-[10px] text-gray-400 font-extrabold uppercase block">Выберите исход:</span>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                soundManager.playBeep(800, 0.05);
                setSelectedOutcome('P1');
              }}
              className={`p-2.5 rounded-xl border text-center font-black cursor-pointer transition-all ${
                selectedOutcome === 'P1'
                  ? 'bg-[#8f9bff] text-black border-[#8f9bff] shadow-[0_0_12px_rgba(143,155,255,0.3)]'
                  : 'bg-[#171b27] text-gray-300 border-[#222840]'
              }`}
            >
              <div>П1</div>
              <div className="text-sm font-mono font-bold">{selectedMatch.o1}</div>
            </button>

            <button
              onClick={() => {
                soundManager.playBeep(800, 0.05);
                setSelectedOutcome('X');
              }}
              className={`p-2.5 rounded-xl border text-center font-black cursor-pointer transition-all ${
                selectedOutcome === 'X'
                  ? 'bg-[#8f9bff] text-black border-[#8f9bff] shadow-[0_0_12px_rgba(143,155,255,0.3)]'
                  : 'bg-[#171b27] text-gray-300 border-[#222840]'
              }`}
            >
              <div>Ничья X</div>
              <div className="text-sm font-mono font-bold">{selectedMatch.oX}</div>
            </button>

            <button
              onClick={() => {
                soundManager.playBeep(800, 0.05);
                setSelectedOutcome('P2');
              }}
              className={`p-2.5 rounded-xl border text-center font-black cursor-pointer transition-all ${
                selectedOutcome === 'P2'
                  ? 'bg-[#8f9bff] text-black border-[#8f9bff] shadow-[0_0_12px_rgba(143,155,255,0.3)]'
                  : 'bg-[#171b27] text-gray-300 border-[#222840]'
              }`}
            >
              <div>П2</div>
              <div className="text-sm font-mono font-bold">{selectedMatch.o2}</div>
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              placeholder="Сумма ставки ₽"
              className="flex-1 bg-[#171b27] border border-[#222840] focus:border-[#8f9bff] rounded-xl p-2.5 text-white font-black outline-none text-xs font-mono"
            />
            <button
              onClick={handlePlaceBet}
              className="px-4 py-2.5 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-extrabold text-xs uppercase rounded-xl cursor-pointer shadow-[0_0_12px_rgba(143,155,255,0.3)] transition-all"
            >
              Сделать ставку
            </button>
          </div>

          {placedBet && (
            <div className="p-3 bg-[#222840] border border-[#8f9bff]/50 rounded-xl text-[#8f9bff] font-bold text-xs animate-in zoom-in">
              ✅ {placedBet}
            </div>
          )}
        </div>
      </div>
    </ToolWrapper>
  );
};
