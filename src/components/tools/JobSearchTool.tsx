import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Briefcase, Search, MapPin, Building2, CheckCircle2, DollarSign } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface Job {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  experience: string;
  description: string;
}

const JOBS_CATALOG: Job[] = [
  { id: '1', title: 'Senior React Developer (Удаленка)', company: 'Яндекс Технологии', salary: '450 000 – 600 000 ₽', location: 'Москва / Удаленно', experience: 'От 3 лет', description: 'Разработка высоконагруженных интерфейсов, React 18, TypeScript, Redux Toolkit.' },
  { id: '2', title: 'Дворник высшей категории', company: 'ЖКХ Центральное', salary: '1 200 000 ₽', location: 'Санкт-Петербург', experience: 'Без опыта', description: 'Уборка элитной территории, владение суровым взглядом и метлой премиум-класса.' },
  { id: '3', title: 'Тестировщик видеоигр (QA)', company: 'VK Play Studio', salary: '280 000 – 350 000 ₽', location: 'Удаленно', experience: '1–3 года', description: 'Играть в игры по 8 часов в день, искать баги и пить бесплатный кофе.' },
  { id: '4', title: 'Переворачиватель пингвинов', company: 'Антарктическая Экспедиция', salary: '850 000 ₽', location: 'Станция Восток', experience: 'Желание летать', description: 'Помогать пингвинам вставать на ноги после взлета вертолетов. Проживание включено.' },
  { id: '5', title: 'Менеджер по продажам воздуховодов', company: 'ООО «ТехноПром»', salary: '120 000 – 300 000 ₽', location: 'Казань', experience: 'От 1 года', description: 'Активные продажи, звонки клиентам, заключение договоров на поставки.' },
  { id: '6', title: 'Испытатель диванов и подушек', company: 'Фабрика Снов', salary: '320 000 ₽', location: 'Москва', experience: 'Любовь к сну', description: 'Оценивать мягкость и эргономичность матрасов по 6 часов в день.' },
  { id: '7', title: 'Главный Мемолог компании', company: 'SMM Агентство «Хаос»', salary: '210 000 ₽', location: 'Удаленно', experience: 'От 2 лет', description: 'Создавать вирусы для соцсетей, следить за трендами и генерировать юмор.' },
  { id: '8', title: 'Программист Микроконтроллеров AI', company: 'Роботехника РФ', salary: '380 000 – 500 000 ₽', location: 'Иннополис', experience: 'От 3 лет', description: 'Программирование C/C++, RTOS, интеграция нейросетей в автономные устройства.' },
];

export const JobSearchTool: React.FC<ToolProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  const handleApply = (jobId: string) => {
    soundManager.playBeep(1200, 0.15);
    setAppliedJobs((prev) => [...prev, jobId]);
  };

  const filteredJobs = JOBS_CATALOG.filter((j) =>
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ToolWrapper title="HeadHunter Поиск Работы (hh.ru)" onClose={onClose} headerColor="bg-[#12151e] border-[#222840]">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-sans text-xs select-none space-y-3">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Профессия, должность или компания..."
            className="w-full bg-[#0f121a] border border-[#222840] focus:border-[#8f9bff] rounded-2xl pl-10 pr-4 py-3 text-white font-extrabold outline-none text-xs transition-all placeholder:text-gray-500"
          />
        </div>

        {/* Jobs List */}
        <div className="space-y-2.5 overflow-y-auto max-h-[420px] pr-1">
          {filteredJobs.map((job) => {
            const isApplied = appliedJobs.includes(job.id);
            return (
              <div
                key={job.id}
                className="bg-[#12151e] border border-[#222840] p-4 rounded-2xl space-y-2.5 hover:border-[#8f9bff]/50 transition-all shadow-md"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="text-xs font-extrabold text-white">{job.title}</h3>
                    <div className="text-[10px] text-gray-400 font-bold flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-[#8f9bff]" /> {job.company} • {job.location}
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#b8c0ff] shrink-0 font-mono">{job.salary}</span>
                </div>

                <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">{job.description}</p>

                <div className="flex justify-between items-center pt-2 border-t border-[#222840]">
                  <span className="text-[10px] bg-[#0f121a] text-gray-400 px-2.5 py-1 rounded-xl border border-[#222840] font-bold">
                    Опыт: {job.experience}
                  </span>

                  <button
                    onClick={() => handleApply(job.id)}
                    disabled={isApplied}
                    className={`px-4 py-2 rounded-xl font-extrabold text-xs uppercase cursor-pointer transition-all ${
                      isApplied
                        ? 'bg-[#222840] text-[#8f9bff] border border-[#8f9bff]'
                        : 'bg-[#8f9bff] hover:bg-[#b8c0ff] text-black shadow-[0_0_10px_rgba(143,155,255,0.3)] active:scale-95'
                    }`}
                  >
                    {isApplied ? 'Отклик отправлен ✓' : 'Откликнуться'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ToolWrapper>
  );
};
