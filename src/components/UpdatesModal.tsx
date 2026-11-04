import React from 'react';
import { X, RefreshCw } from 'lucide-react';

interface UpdatesModalProps {
  onClose: () => void;
}

export const UpdatesModal: React.FC<UpdatesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#12151e] border border-[#8f9bff]/40 rounded-2xl shadow-[0_0_30px_rgba(143,155,255,0.2)] overflow-hidden flex flex-col min-h-[280px]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#171b27] border-b border-[#222840] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#8f9bff] font-bold text-lg">
            <RefreshCw className="w-5 h-5" />
            <span>Обновления</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-[#8f9bff] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#171b27] border border-[#222840] flex items-center justify-center text-gray-400 mb-4 text-2xl shadow-inner">
            💤
          </div>
          <p className="text-gray-300 text-lg font-medium">Обновлений нет</p>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0f121a] border-t border-[#222840] text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-extrabold rounded-xl transition-all cursor-pointer shadow-[0_0_12px_rgba(143,155,255,0.3)]"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
