import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { BookOpen, Calendar, Plus, X } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface Lesson {
  id: string;
  name: string;
  grade: number;
}

interface DaySchedule {
  day: string;
  lessons: Lesson[];
}

const INITIAL_SCHEDULE: DaySchedule[] = [
  {
    day: 'Понедельник',
    lessons: [
      { id: 'mon-1', name: 'Алгебра', grade: 5 },
      { id: 'mon-2', name: 'Русский язык', grade: 4 },
      { id: 'mon-3', name: 'Физика', grade: 6 },
      { id: 'mon-4', name: 'История', grade: 4 },
      { id: 'mon-5', name: 'Физкультура', grade: 5 },
    ],
  },
  {
    day: 'Вторник',
    lessons: [
      { id: 'tue-1', name: 'Геометрия', grade: 4 },
      { id: 'tue-2', name: 'Литература', grade: 5 },
      { id: 'tue-3', name: 'Химия', grade: 3 },
      { id: 'tue-4', name: 'Иностранный язык', grade: 6 },
      { id: 'tue-5', name: 'Информатика', grade: 5 },
    ],
  },
  {
    day: 'Среда',
    lessons: [
      { id: 'wed-1', name: 'Алгебра', grade: 4 },
      { id: 'wed-2', name: 'Биология', grade: 5 },
      { id: 'wed-3', name: 'Обществознание', grade: 4 },
      { id: 'wed-4', name: 'География', grade: 6 },
      { id: 'wed-5', name: 'Физкультура', grade: 5 },
    ],
  },
  {
    day: 'Четверг',
    lessons: [
      { id: 'thu-1', name: 'Русский язык', grade: 4 },
      { id: 'thu-2', name: 'Физика', grade: 4 },
      { id: 'thu-3', name: 'Иностранный язык', grade: 5 },
      { id: 'thu-4', name: 'История', grade: 6 },
      { id: 'thu-5', name: 'ОБЖ', grade: 5 },
    ],
  },
  {
    day: 'Пятница',
    lessons: [
      { id: 'fri-1', name: 'Геометрия', grade: 5 },
      { id: 'fri-2', name: 'Литература', grade: 4 },
      { id: 'fri-3', name: 'Химия', grade: 4 },
      { id: 'fri-4', name: 'Информатика', grade: 6 },
      { id: 'fri-5', name: 'Физкультура', grade: 5 },
    ],
  },
  {
    day: 'Суббота',
    lessons: [
      { id: 'sat-1', name: 'Астрономия', grade: 6 },
      { id: 'sat-2', name: 'Черчение', grade: 5 },
      { id: 'sat-3', name: 'Экология', grade: 4 },
      { id: 'sat-4', name: 'Робототехника', grade: 6 },
    ],
  },
  {
    day: 'Воскресенье',
    lessons: [
      { id: 'sun-1', name: 'Самоподготовка', grade: 5 },
      { id: 'sun-2', name: 'Мемология', grade: 6 },
      { id: 'sun-3', name: 'Олимпиадная математика', grade: 6 },
    ],
  },
];

const PRESET_SUBJECTS = [
  'Алгебра',
  'Геометрия',
  'Физика',
  'Химия',
  'Литература',
  'Русский язык',
  'История',
  'Обществознание',
  'Информатика',
  'Биология',
  'География',
  'Астрономия',
  'Физкультура',
  'Иностранный язык',
  'Квантовая физика',
  'Мемология',
];

export const SchoolDiaryTool: React.FC<ToolProps> = ({ onClose }) => {
  const [schedule, setSchedule] = useState<DaySchedule[]>(INITIAL_SCHEDULE);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);

  // Modal for adding a new lesson
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLessonName, setNewLessonName] = useState('');
  const [newLessonGrade, setNewLessonGrade] = useState<number>(5);

  const handleSetGrade = (dayIdx: number, lessonIdx: number, newGrade: number) => {
    soundManager.playBeep(900, 0.05);
    setSchedule((prev) =>
      prev.map((d, dI) => {
        if (dI !== dayIdx) return d;
        return {
          ...d,
          lessons: d.lessons.map((l, lI) => (lI === lessonIdx ? { ...l, grade: newGrade } : l)),
        };
      })
    );
  };

  const handleAddLesson = () => {
    const trimmed = newLessonName.trim() || 'Новый урок';
    const activeDay = schedule[selectedDayIdx];

    // Cap at 21 max silently
    if (activeDay.lessons.length >= 21) {
      setIsAddModalOpen(false);
      return;
    }

    soundManager.playBeep(1100, 0.08);
    const newLessonItem: Lesson = {
      id: `custom-${Date.now()}-${Math.random()}`,
      name: trimmed,
      grade: newLessonGrade,
    };

    setSchedule((prev) =>
      prev.map((d, idx) =>
        idx === selectedDayIdx
          ? { ...d, lessons: [...d.lessons, newLessonItem] }
          : d
      )
    );

    setNewLessonName('');
    setNewLessonGrade(5);
    setIsAddModalOpen(false);
  };

  const currentLessons = schedule[selectedDayIdx]?.lessons || [];

  return (
    <ToolWrapper title="Электронный дневник" onClose={onClose}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col gap-4 py-3 select-none">
        {/* Diary Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex items-center justify-between shadow-xl shrink-0">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-cyan-400" />
            <div>
              <h3 className="text-white font-black text-base">Дневник ученика 14Э</h3>
              <span className="text-xs text-slate-400">Расписание на учебную неделю</span>
            </div>
          </div>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none shrink-0">
          {schedule.map((dayObj, idx) => (
            <button
              key={dayObj.day}
              onClick={() => {
                soundManager.playBeep(700, 0.04);
                setSelectedDayIdx(idx);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedDayIdx === idx
                  ? 'bg-cyan-500 text-slate-950 shadow-lg'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {dayObj.day}
            </button>
          ))}
        </div>

        {/* Active Day Lessons */}
        <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Уроки ({schedule[selectedDayIdx]?.day}):</span>
          </h4>

          {currentLessons.map((sub, lIdx) => (
            <div
              key={sub.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between shadow-md"
            >
              <div className="flex items-center gap-2 truncate pr-2">
                <span className="text-xs font-mono font-bold text-slate-500 w-5 shrink-0">
                  {lIdx + 1}.
                </span>
                <span className="text-white font-bold text-xs sm:text-sm truncate">{sub.name}</span>
              </div>

              {/* Grade Selector (2, 3, 4, 5, 6) */}
              <div className="flex items-center gap-1 shrink-0">
                {[2, 3, 4, 5, 6].map((g) => (
                  <button
                    key={g}
                    onClick={() => handleSetGrade(selectedDayIdx, lIdx, g)}
                    className={`w-7 h-7 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                      sub.grade === g
                        ? g === 6
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-105 shadow-md font-black'
                          : 'bg-cyan-500 text-slate-950 scale-105 shadow-md font-black'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Gray '+' Tile at end of list for adding a lesson */}
          {currentLessons.length < 21 && (
            <button
              onClick={() => {
                soundManager.playBeep(850, 0.05);
                setIsAddModalOpen(true);
              }}
              className="w-full bg-slate-900/60 border border-dashed border-slate-700 hover:border-cyan-500/60 hover:bg-slate-800/80 rounded-2xl p-3.5 flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-all cursor-pointer shadow-sm group"
            >
              <Plus className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-xs sm:text-sm">Добавить урок</span>
            </button>
          )}
        </div>

        {/* Add Lesson Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl relative space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Добавление урока
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Subject Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 block">
                  Название предмета:
                </label>
                <input
                  type="text"
                  value={newLessonName}
                  onChange={(e) => setNewLessonName(e.target.value)}
                  placeholder="Введите или выберите предмет..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-all font-medium"
                />

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1 pt-1.5 max-h-24 overflow-y-auto pr-1">
                  {PRESET_SUBJECTS.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => {
                        soundManager.playBeep(900, 0.03);
                        setNewLessonName(sub);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        newLessonName === sub
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grade Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 block">
                  Оценка за урок:
                </label>
                <div className="flex gap-2">
                  {[2, 3, 4, 5, 6].map((g) => (
                    <button
                      key={g}
                      onClick={() => {
                        soundManager.playBeep(850, 0.03);
                        setNewLessonGrade(g);
                      }}
                      className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                        newLessonGrade === g
                          ? g === 6
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                            : 'bg-cyan-500 text-slate-950 shadow-lg scale-105'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  onClick={handleAddLesson}
                  className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black uppercase rounded-xl cursor-pointer shadow-lg active:scale-95 transition-all"
                >
                  Добавить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
