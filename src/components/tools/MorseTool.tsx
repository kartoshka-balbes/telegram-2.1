import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Volume2, Copy, Check, Trash2, ArrowRightLeft } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

const MORSE_MAP: Record<string, string> = {
  А: '.-', Б: '-...', В: '.--', Г: '--.', Д: '-..', Е: '.', Ж: '...-', З: '--..',
  И: '..', Й: '.---', К: '-.-', Л: '.-..', М: '--', Н: '-.', О: '---', П: '.--.',
  Р: '.-.', С: '...', Т: '-', У: '..-', Ф: '..-.', Х: '....', Ц: '-.-.', Ч: '---.',
  Ш: '----', Щ: '--.-', Ъ: '--.--', Ы: '-.--', Ь: '-..-', Э: '...-...', Ю: '..--',
  Я: '.-.-', ' ': '/',
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
  I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
  Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..',
  '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
};

const REVERSE_MORSE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_MAP).map(([k, v]) => [v, k])
);

interface ToolProps {
  onClose: () => void;
}

export const MorseTool: React.FC<ToolProps> = ({ onClose }) => {
  const [text, setText] = useState('');
  const [morse, setMorse] = useState('');
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const textToMorse = (str: string) => {
    return str
      .toUpperCase()
      .split('')
      .map((ch) => MORSE_MAP[ch] || ch)
      .join(' ');
  };

  const morseToText = (mStr: string) => {
    return mStr
      .split(' ')
      .map((m) => REVERSE_MORSE[m] || m)
      .join('');
  };

  const handleTextChange = (val: string) => {
    setText(val);
    setMorse(textToMorse(val));
  };

  const handleMorseChange = (val: string) => {
    setMorse(val);
    setText(morseToText(val));
  };

  const appendMorseChar = (char: string) => {
    soundManager.playBeep(char === '.' ? 800 : 600, char === '.' ? 0.08 : 0.2);
    const newMorse = morse + char;
    setMorse(newMorse);
    setText(morseToText(newMorse));
  };

  const backspaceMorse = () => {
    soundManager.playBeep(400, 0.05);
    const newMorse = morse.slice(0, -1);
    setMorse(newMorse);
    setText(morseToText(newMorse));
  };

  const handleClear = () => {
    setText('');
    setMorse('');
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Play audio sound sequence for Morse
  const playMorseAudio = async () => {
    if (isPlaying || !morse.trim()) return;
    setIsPlaying(true);

    const symbols = morse.split('');
    for (const s of symbols) {
      if (s === '.') {
        soundManager.playBeep(800, 0.08);
        await new Promise((r) => setTimeout(r, 120));
      } else if (s === '-') {
        soundManager.playBeep(800, 0.24);
        await new Promise((r) => setTimeout(r, 280));
      } else if (s === ' ') {
        await new Promise((r) => setTimeout(r, 200));
      } else if (s === '/') {
        await new Promise((r) => setTimeout(r, 400));
      }
    }
    setIsPlaying(false);
  };

  return (
    <ToolWrapper title="Азбука Морзе (Переводчик)" onClose={onClose} headerColor="bg-[#12151e] border-[#222840]">
      <div className="max-w-xl mx-auto w-full flex-1 flex flex-col justify-between py-2 font-sans select-none overflow-y-auto pr-1">
        
        {/* Main Text Areas */}
        <div className="space-y-3">
          {/* Normal Text Area */}
          <div className="bg-[#0f121a] border border-[#222840] p-3 rounded-2xl space-y-1.5 shadow-md">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#8f9bff] uppercase">Обычный текст</span>
              <button
                onClick={() => handleCopy(text)}
                className="text-gray-400 hover:text-white p-1 flex items-center gap-1 text-[11px] cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#8f9bff]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Скопировано' : 'Копировать'}</span>
              </button>
            </div>
            <textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Введите текст или используйте кнопки ниже..."
              rows={3}
              className="w-full bg-[#161a26] border border-[#222840] rounded-xl p-3 text-white text-sm outline-none resize-none focus:border-[#8f9bff]"
            />
          </div>

          {/* Morse Code Area */}
          <div className="bg-[#0f121a] border border-[#222840] p-3 rounded-2xl space-y-1.5 shadow-md">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-amber-400 uppercase">Код Морзе</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={playMorseAudio}
                  disabled={isPlaying || !morse.trim()}
                  className={`p-1.5 rounded-lg border flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-colors ${
                    isPlaying
                      ? 'bg-amber-500 text-black border-amber-400 animate-pulse'
                      : 'bg-[#171b27] text-amber-400 border-amber-900/60 hover:bg-amber-950/40'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPlaying ? 'Воспроизведение...' : 'Слушать звук'}</span>
                </button>
                <button
                  onClick={() => handleCopy(morse)}
                  className="text-gray-400 hover:text-white p-1 text-[11px] cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <textarea
              value={morse}
              onChange={(e) => handleMorseChange(e.target.value)}
              placeholder="... --- ... (точка / тире)"
              rows={3}
              className="w-full bg-[#161a26] border border-[#222840] rounded-xl p-3 text-amber-300 font-mono text-base outline-none resize-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Mobile Quick Touch Keyboard */}
        <div className="mt-3 bg-[#0f121a] border border-[#222840] p-3 rounded-2xl space-y-2 shadow-lg">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-center">
            Быстрая сенсорная клавиатура для телефона
          </div>

          <div className="grid grid-cols-4 gap-2">
            {/* Dot */}
            <button
              onClick={() => appendMorseChar('.')}
              className="py-4 bg-[#1e293b] hover:bg-[#334155] border-2 border-cyan-500 text-cyan-300 font-black text-2xl rounded-2xl transition-transform active:scale-95 shadow-md flex items-center justify-center cursor-pointer"
            >
              •
            </button>

            {/* Dash */}
            <button
              onClick={() => appendMorseChar('-')}
              className="py-4 bg-[#1e293b] hover:bg-[#334155] border-2 border-amber-500 text-amber-300 font-black text-2xl rounded-2xl transition-transform active:scale-95 shadow-md flex items-center justify-center cursor-pointer"
            >
              —
            </button>

            {/* Letter space */}
            <button
              onClick={() => appendMorseChar(' ')}
              className="py-4 bg-[#171b27] hover:bg-[#212536] border border-gray-700 text-gray-300 font-extrabold text-xs uppercase rounded-2xl transition-transform active:scale-95 flex items-center justify-center cursor-pointer"
            >
              Буква ␣
            </button>

            {/* Word space */}
            <button
              onClick={() => appendMorseChar(' / ')}
              className="py-4 bg-[#171b27] hover:bg-[#212536] border border-gray-700 text-gray-300 font-extrabold text-xs uppercase rounded-2xl transition-transform active:scale-95 flex items-center justify-center cursor-pointer"
            >
              Слово /
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={backspaceMorse}
              className="py-2.5 bg-[#1c1c1c] hover:bg-[#262626] border border-[#222840] text-gray-300 font-bold text-xs rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>⌫ Стереть символ</span>
            </button>

            <button
              onClick={handleClear}
              className="py-2.5 bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 font-bold text-xs rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Очистить всё</span>
            </button>
          </div>
        </div>

      </div>
    </ToolWrapper>
  );
};
