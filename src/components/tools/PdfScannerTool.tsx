import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Camera, FileText, Download, Check, Sparkles, Layers } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const PdfScannerTool: React.FC<ToolProps> = ({ onClose }) => {
  const [scannedPages, setScannedPages] = useState<number>(1);
  const [filterMode, setFilterMode] = useState<'Color' | 'B&W' | 'Magic'>('Magic');
  const [isExported, setIsExported] = useState(false);

  const handleScanPage = () => {
    soundManager.playBeep(1200, 0.1);
    setIsExported(false);
    setScannedPages((prev) => prev + 1);
  };

  const handleExportPdf = () => {
    soundManager.playBeep(1500, 0.2);
    setIsExported(true);
  };

  return (
    <ToolWrapper title="Сканер документов PDF" onClose={onClose} headerColor="bg-blue-950 border-blue-900">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-mono text-xs select-none space-y-3">
        {/* Camera Scanner Viewport with Document Outline Box */}
        <div className="bg-slate-950 border-2 border-blue-500 rounded-2xl h-56 relative overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Glowing Contour Detection Frame */}
          <div className="absolute inset-6 border-2 border-dashed border-cyan-400 rounded-xl pointer-events-none animate-pulse flex items-center justify-center">
            <div className="bg-cyan-950/80 px-3 py-1 rounded text-[10px] text-cyan-300 font-bold border border-cyan-500">
              [ ДОКУМЕНТ ОБНАРУЖЕН ]
            </div>
          </div>

          <div className="relative z-10 flex justify-between items-center bg-slate-900/90 border border-slate-800 p-2 rounded-xl">
            <span className="text-white font-bold flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-400" /> Отсканировано страниц: {scannedPages}
            </span>
            <span className="text-blue-400 font-black text-[10px] uppercase">
              Фильтр: {filterMode}
            </span>
          </div>

          {/* Capture Trigger */}
          <div className="relative z-10 flex justify-center">
            <button
              onClick={handleScanPage}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase rounded-xl cursor-pointer shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Захватить страницу</span>
            </button>
          </div>
        </div>

        {/* Filter Selector */}
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
            Режим обработки скана:
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(['Magic', 'B&W', 'Color'] as const).map((f) => (
              <button
                key={f}
                onClick={() => {
                  soundManager.playBeep(800, 0.05);
                  setFilterMode(f);
                }}
                className={`py-2 rounded-xl font-bold text-xs cursor-pointer border transition-all ${
                  filterMode === f
                    ? 'bg-blue-500 text-white border-blue-400 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {f === 'Magic' ? '✨ Четкий текст' : f === 'B&W' ? 'Ч/Б скан' : 'Цветной'}
              </button>
            ))}
          </div>
        </div>

        {/* Export PDF Button */}
        {!isExported ? (
          <button
            onClick={handleExportPdf}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase rounded-2xl cursor-pointer shadow-lg flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Сохранить документ в PDF ({scannedPages} стр.)</span>
          </button>
        ) : (
          <div className="p-4 bg-emerald-950 border-2 border-emerald-500 rounded-2xl text-center space-y-1 animate-in zoom-in">
            <div className="text-emerald-400 font-black uppercase text-xs flex items-center justify-center gap-1.5">
              <Check className="w-5 h-5" />
              <span>Файл "Scan_Document_2026.pdf" сохранен!</span>
            </div>
            <p className="text-[11px] text-slate-300">Файл успешно загружен в память устройства.</p>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
