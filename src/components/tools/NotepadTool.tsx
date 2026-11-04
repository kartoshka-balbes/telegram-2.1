import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Plus, Trash2, FileText, Save, ChevronLeft } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface ToolProps {
  onClose: () => void;
}

export const NotepadTool: React.FC<ToolProps> = ({ onClose }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('user_notepad_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    localStorage.setItem('user_notepad_notes', JSON.stringify(notes));
  }, [notes]);

  const activeNote = notes.find((n) => n.id === activeNoteId);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Новая заметка',
      content: '',
      date: new Date().toLocaleDateString(),
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setTitle(newNote.title);
    setContent(newNote.content);
  };

  const handleSelectNote = (note: Note) => {
    setActiveNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleSaveNote = () => {
    if (!activeNoteId) return;
    setNotes((prev) =>
      prev.map((n) => (n.id === activeNoteId ? { ...n, title, content } : n))
    );
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(null);
    }
  };

  return (
    <ToolWrapper title="Блокнот" onClose={onClose}>
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full py-2">
        {activeNoteId ? (
          /* Note Editor View */
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveNoteId(null)}
                className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Назад к списку</span>
              </button>
              <button
                onClick={handleSaveNote}
                className="flex items-center gap-1 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1.5 rounded-lg cursor-pointer uppercase"
              >
                <Save className="w-4 h-4" />
                <span>Сохранить</span>
              </button>
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Заголовок..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white font-extrabold text-base outline-none focus:border-cyan-400"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Текст заметки..."
              rows={12}
              className="w-full flex-1 bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-200 text-sm outline-none focus:border-cyan-400 resize-none font-sans"
            />
          </div>
        ) : (
          /* Notes List View */
          <div className="flex-1 flex flex-col gap-4">
            <button
              onClick={handleCreateNote}
              className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm rounded-2xl uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Создать заметку</span>
            </button>

            {notes.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <FileText className="w-16 h-16 mb-2 stroke-1" />
                <p className="text-sm font-medium">Заметок пока нет</p>
              </div>
            ) : (
              <div className="space-y-2 overflow-y-auto max-h-[400px]">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => handleSelectNote(note)}
                    className="p-4 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl flex items-center justify-between cursor-pointer transition-colors group"
                  >
                    <div className="overflow-hidden pr-2">
                      <h4 className="font-bold text-white text-sm truncate">{note.title}</h4>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{note.date}</p>
                    </div>

                    <button
                      onClick={(e) => handleDeleteNote(note.id, e)}
                      className="p-2 text-slate-600 hover:text-red-400 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
