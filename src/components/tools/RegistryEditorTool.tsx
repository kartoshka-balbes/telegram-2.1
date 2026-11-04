import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Folder, ChevronRight, ShieldAlert, X } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

const REGISTRY_FOLDERS = [
  { id: 'hkcr', name: 'HKEY_CLASSES_ROOT' },
  { id: 'hkcu', name: 'HKEY_CURRENT_USER' },
  { id: 'hklm', name: 'HKEY_LOCAL_MACHINE' },
  { id: 'hku', name: 'HKEY_USERS' },
  { id: 'hkcc', name: 'HKEY_CURRENT_CONFIG' },
];

export const RegistryEditorTool: React.FC<ToolProps> = ({ onClose }) => {
  const [showForbiddenModal, setShowForbiddenModal] = useState(false);

  const handleFolderClick = () => {
    soundManager.playSiren();
    setShowForbiddenModal(true);
  };

  return (
    <ToolWrapper title="Редактор реестра" onClose={onClose}>
      <div className="relative flex-1 flex flex-col max-w-xl mx-auto w-full py-2">
        <div className="bg-slate-900 border border-slate-800 rounded-none p-4 flex-1 flex flex-col font-mono text-xs">
          <div className="border-b border-slate-800 pb-2 mb-3 text-slate-400 font-bold uppercase">
            Компьютер
          </div>

          <div className="space-y-1">
            {REGISTRY_FOLDERS.map((folder) => (
              <div
                key={folder.id}
                onClick={handleFolderClick}
                className="p-2.5 bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-none flex items-center gap-2 text-white font-bold cursor-pointer hover:bg-slate-800/50 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-slate-500" />
                <Folder className="w-4 h-4 text-amber-400" />
                <span>{folder.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Forbidden Modal */}
        {showForbiddenModal && (
          <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-6">
            <div className="w-full max-w-sm bg-slate-900 border-2 border-red-500 rounded-none p-6 text-center shadow-2xl relative">
              <button
                onClick={() => setShowForbiddenModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-none bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-3 animate-bounce" />
              <h2 className="text-2xl font-black text-red-500 uppercase tracking-widest mb-4">
                ЗАПРЕЩЕНО
              </h2>
              <p className="text-xs text-slate-300 mb-6 font-medium">
                У вас недостаточно прав администратора для изменения ключей системного реестра.
              </p>
              <button
                onClick={() => setShowForbiddenModal(false)}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-black rounded-none uppercase text-xs tracking-wider cursor-pointer shadow-lg"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
