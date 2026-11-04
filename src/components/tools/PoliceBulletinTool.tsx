import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import {
  ShieldAlert,
  Search,
  AlertTriangle,
  UserX,
  FileText,
  BadgeAlert,
  Fingerprint,
  PhoneCall,
  CheckCircle2,
  X,
  MapPin,
  Calendar,
  Lock,
  ChevronRight,
  Printer
} from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export interface CriminalProfile {
  id: string;
  fullName: string;
  nickname: string;
  photoEmoji: string;
  birthYear: number;
  article: string;
  crimeTitle: string;
  crimeDescription: string;
  dangerLevel: 'Особо опасен' | 'Федеральный розыск' | 'Международный розыск' | 'Местный розыск';
  dangerColor: string;
  bounty: string;
  lastSeenLocation: string;
  specialSigns: string;
  registeredDate: string;
}

const CRIMINALS_DB: CriminalProfile[] = [
  {
    id: 'MVD-89410',
    fullName: 'Воронов Илья Сергеевич',
    nickname: '«Чайный Спектр»',
    photoEmoji: '🧔🏻‍♂️',
    birthYear: 1989,
    article: 'Статья 282.9 УК РФ',
    crimeTitle: 'Несанкционированное заваривание чайного пакетика более 4 раз',
    crimeDescription:
      'Обвиняется в систематическом заваривании одного и того же пакетика цейлонского чая до прозрачного состояния в общественных столовых, с отягчающими обстоятельствами: категорический отказ отжимать пакетик ложкой перед выбросом, что вызвало дестабилизацию микроклимата коллектива.',
    dangerLevel: 'Особо опасен',
    dangerColor: 'bg-red-600 border-red-500 text-white',
    bounty: '5 000 000 ₽',
    lastSeenLocation: 'Москва, станция метро «Комсомольская», буфет №3',
    specialSigns: 'Носит с собой потрёпанную кружку с надписью «Шеф всегда прав», пахнет бергамотом.',
    registeredDate: '14.03.2026',
  },
  {
    id: 'MVD-77312',
    fullName: 'Спичкин Геннадий Аркадьевич',
    nickname: '«Дрифтер-Тележечник»',
    photoEmoji: '👨🏼‍🦱',
    birthYear: 1994,
    article: 'Статья 166.4 УК РФ',
    crimeTitle: 'Нелегальный дрифт на продуктовой тележке на парковке гипермаркета',
    crimeDescription:
      'Совершил самовольный захват тележки с заблокированным передним левым колесом, разогнал её до скорости 43.8 км/ч на скользком асфальте и совершил серию неконтролируемых заносов вокруг столба освещения без включения аварийной сигнализации.',
    dangerLevel: 'Федеральный розыск',
    dangerColor: 'bg-amber-600 border-amber-500 text-white',
    bounty: '3 500 000 ₽',
    lastSeenLocation: 'Санкт-Петербург, парковка ТЦ «Мега Дыбенко»',
    specialSigns: 'Мозоли на обеих ладонях от хромированной ручки тележки, издает скрип при беге.',
    registeredDate: '28.02.2026',
  },
  {
    id: 'MVD-10492',
    fullName: 'Пеньков Аркадий Борисович',
    nickname: '«Бесшапочный»',
    photoEmoji: '👴🏼',
    birthYear: 1968,
    article: 'Статья 205.14 УК РФ',
    crimeTitle: 'Отказ надевать тёплую шапку при температуре -2°C',
    crimeDescription:
      'Игнорируя 17 прямых настойчивых требований бабушки и матери, вышел на улицу в лёгкой ветровке без головного убора. Своими действиями создал угрозу возникновения масштабного сезонного менингита в границах жилого квартала.',
    dangerLevel: 'Особо опасен',
    dangerColor: 'bg-red-600 border-red-500 text-white',
    bounty: '10 000 000 ₽',
    lastSeenLocation: 'Екатеринбург, ул. Вайнера, уличный термометр',
    specialSigns: 'Красные уши, упорно утверждает, что «на улице вообще тепло и не дует».',
    registeredDate: '19.01.2026',
  },
  {
    id: 'MVD-64201',
    fullName: 'Синицын Валерий Павлович',
    nickname: '«Перфоратор 06:01»',
    photoEmoji: '👨🏻',
    birthYear: 1982,
    article: 'Статья 213.8 УК РФ',
    crimeTitle: 'Сверление несущей плиты ровно в 06:01 утра в воскресенье',
    crimeDescription:
      'С использованием ударного перфоратора мощностью 1800 Вт и тупого бура диаметром 12 мм произвел 48 технологических отверстий в бетонной стене в выходной день, вызвав массовый психоакустический резонанс у 36 соседей по стояку.',
    dangerLevel: 'Международный розыск',
    dangerColor: 'bg-purple-600 border-purple-500 text-white',
    bounty: '7 000 000 ₽',
    lastSeenLocation: 'Новосибирск, спальный микрорайон «Родники»',
    specialSigns: 'Следы цементной пыли на бровях, держит палец на воображаемой кнопке пуска.',
    registeredDate: '02.04.2026',
  },
  {
    id: 'MVD-99230',
    fullName: 'Круглова Екатерина Викторовна',
    nickname: '«Контейнерная Королева»',
    photoEmoji: '👩🏻‍🦰',
    birthYear: 1991,
    article: 'Статья 159.99 УК РФ',
    crimeTitle: 'Серийное похищение 340 пластиковых контейнеров без возврата крышек',
    crimeDescription:
      'Под предлогом «взять кусочек торта домой» вынесла из домов родственников и знакомых более 340 оригинальных контейнеров Tupperware и полипропиленовых судочков, категорически удерживая крышки в неизвестном тайнике.',
    dangerLevel: 'Федеральный розыск',
    dangerColor: 'bg-amber-600 border-amber-500 text-white',
    bounty: '2 800 000 ₽',
    lastSeenLocation: 'Казань, улица Баумана, район кулинарии',
    specialSigns: 'Объемная тканевая сумка-шоппер, подозрительно звенит пластиком при ходьбе.',
    registeredDate: '11.05.2026',
  },
  {
    id: 'MVD-55321',
    fullName: 'Дроздов Святослав Олегович',
    nickname: '«Пакет-Инферно»',
    photoEmoji: '👨🏽',
    birthYear: 1997,
    article: 'Статья 330.1 УК РФ',
    crimeTitle: 'Вопрос «Пакет брать будете?» с интонацией экзистенциального разочарования',
    crimeDescription:
      'Используя служебное положение за кассовым терминалом №4, произносил обязательную фразу обслуживания с такой степенью вселенской тоски и экзистенциального осуждения, что 19 покупателей усомнились в смысле своего существования и оставили корзины.',
    dangerLevel: 'Местный розыск',
    dangerColor: 'bg-blue-600 border-blue-500 text-white',
    bounty: '1 200 000 ₽',
    lastSeenLocation: 'Краснодар, круглосуточный супермаркет на Красной',
    specialSigns: 'Взгляд сквозь пространство, лента чек-принтера в нагрудном кармане.',
    registeredDate: '23.06.2026',
  },
  {
    id: 'MVD-38102',
    fullName: 'Щукин Максим Данилович',
    nickname: '«Лососевый Саботажник»',
    photoEmoji: '🧔🏼',
    birthYear: 1987,
    article: 'Статья 245.2 УК РФ',
    crimeTitle: 'Тайное угощение соседского кота филе норвежского лосося',
    crimeDescription:
      'Осуществил несанкционированное кормление беспородного британского кота «Барсик» деликатесной слабосоленой рыбой высшей категории, в результате чего кот объявил бессрочную забастовку и отвергает стандартный влажный корм эконом-класса.',
    dangerLevel: 'Федеральный розыск',
    dangerColor: 'bg-amber-600 border-amber-500 text-white',
    bounty: '4 000 000 ₽',
    lastSeenLocation: 'Самара, набережная реки Волга, рыбный павильон',
    specialSigns: 'Запах укропа и лимона, постоянно оглядывается в поисках бродячих котов.',
    registeredDate: '15.07.2026',
  },
  {
    id: 'MVD-44119',
    fullName: 'Блинкова Тамара Сергеевна',
    nickname: '«Стевия-Фантом»',
    photoEmoji: '👵🏻',
    birthYear: 1961,
    article: 'Статья 160.7 УК РФ',
    crimeTitle: 'Тайная замена кускового сахара на сахарозаменитель в сахарнице семьи',
    crimeDescription:
      'В течение 240 дней производила скрытую подмену натурального тростникового сахара на синтетическую стевию с целью принудительного снижения гликемического индекса у всех проживающих лиц без их добровольного информированного согласия.',
    dangerLevel: 'Особо опасен',
    dangerColor: 'bg-red-600 border-red-500 text-white',
    bounty: '6 500 000 ₽',
    lastSeenLocation: 'Нижний Новгород, Сормовский район, рынок «Народный»',
    specialSigns: 'Мерная ложечка на 0.5 грамма в рукаве, читает состав продуктов с лупой.',
    registeredDate: '09.08.2026',
  }
];

export const PoliceBulletinTool: React.FC<ToolProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDanger, setSelectedDanger] = useState<string>('Все');
  const [selectedProfile, setSelectedProfile] = useState<CriminalProfile | null>(null);
  const [reportedFugitiveId, setReportedFugitiveId] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const filteredCriminals = CRIMINALS_DB.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.article.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.crimeTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDanger = selectedDanger === 'Все' || c.dangerLevel === selectedDanger;

    return matchesSearch && matchesDanger;
  });

  const handleOpenProfile = (profile: CriminalProfile) => {
    soundManager.playBeep(850, 0.05);
    setSelectedProfile(profile);
  };

  const handleReportLocation = (id: string) => {
    soundManager.playBeep(1200, 0.1);
    setReportedFugitiveId(id);
    setTimeout(() => setReportedFugitiveId(null), 3000);
  };

  const handlePrintWarrant = () => {
    soundManager.playBeep(1000, 0.08);
    setIsPrinting(true);
    setTimeout(() => setIsPrinting(false), 2000);
  };

  return (
    <div
      onPointerDown={() => {
        soundManager.playRock();
      }}
      className="h-full w-full flex flex-col"
    >
      <ToolWrapper title="Полицейская сводка" onClose={onClose} headerColor="bg-[#121624] border-red-900/60">
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full py-2 font-sans select-none space-y-3 text-white">
        
        {/* Official Header Banner */}
        <div className="bg-gradient-to-r from-[#171e33] via-[#121624] to-[#1a111b] border-2 border-red-700/60 rounded-2xl p-4 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 opacity-10 text-red-500 pointer-events-none">
            <ShieldAlert className="w-40 h-40" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600/20 border-2 border-red-500/80 flex items-center justify-center text-red-400 shrink-0 shadow-lg shadow-red-600/20">
                <ShieldAlert className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                    ФЕДЕРАЛЬНАЯ БАЗА ОПЕРАТИВНОГО РОЗЫСКА
                  </h2>
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono font-black text-[10px] uppercase animate-pulse">
                    ГРИФ: СЕКРЕТНО
                  </span>
                </div>
                <p className="text-xs text-gray-300">
                  Главное управление уголовного розыска • Единый реестр лиц, скрывающихся от правосудия
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-bold bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl text-gray-300">
              <BadgeAlert className="w-4 h-4 text-red-400" />
              <span>В розыске: {CRIMINALS_DB.length} фигурантов</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#121624] border border-[#242b42] p-2.5 rounded-2xl">
          {/* Search */}
          <div className="sm:col-span-2 relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по ФИО, статье УК, кличке или номеру дела..."
              className="w-full bg-[#181e33] border border-[#29324e] focus:border-red-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-400 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-gray-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Danger Level Filter */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {['Все', 'Особо опасен', 'Федеральный розыск'].map((level) => (
              <button
                key={level}
                onClick={() => {
                  soundManager.playBeep(900, 0.03);
                  setSelectedDanger(level);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all cursor-pointer border ${
                  selectedDanger === level
                    ? 'bg-red-600 text-white border-red-500 shadow-md'
                    : 'bg-[#181e33] border-[#29324e] text-gray-400 hover:text-white'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Criminal Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto max-h-[440px] pr-1 pb-4">
          {filteredCriminals.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-400 text-xs font-mono">
              По вашему запросу ориентировок не обнаружено
            </div>
          ) : (
            filteredCriminals.map((criminal) => (
              <div
                key={criminal.id}
                onClick={() => handleOpenProfile(criminal)}
                className="bg-[#131829] border border-[#242e4c] hover:border-red-500/70 rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.01] shadow-xl group relative overflow-hidden"
              >
                {/* Bounty Ribbon */}
                <div className="flex items-center justify-between mb-3 border-b border-[#242e4c] pb-2.5">
                  <span className="font-mono text-[10px] text-gray-400 font-black tracking-wider">
                    ДЕЛО № {criminal.id}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-amber-400 font-black font-mono">
                      НАГРАДА: {criminal.bounty}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${criminal.dangerColor}`}>
                      {criminal.dangerLevel}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 mb-3">
                  {/* Mugshot Emoji Box */}
                  <div className="w-16 h-20 rounded-2xl bg-black/60 border-2 border-red-500/60 flex flex-col items-center justify-center text-3xl shadow-inner shrink-0 relative group-hover:border-red-400 transition-colors">
                    <span>{criminal.photoEmoji}</span>
                    <span className="text-[8px] font-mono text-red-400 font-black mt-1">РОЗЫСК</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-sm text-white group-hover:text-red-400 transition-colors truncate">
                      {criminal.fullName}
                    </h3>
                    <p className="text-xs text-amber-400 font-bold mb-1">{criminal.nickname}</p>
                    <div className="inline-block bg-red-950/70 border border-red-600/40 text-red-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md mb-1.5">
                      {criminal.article}
                    </div>
                    <p className="text-[11px] text-gray-300 line-clamp-2 leading-snug">
                      {criminal.crimeTitle}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#242e4c] flex items-center justify-between text-[10px] text-gray-400 font-mono">
                  <span className="flex items-center gap-1 truncate pr-2">
                    <MapPin className="w-3 h-3 text-red-400 shrink-0" /> {criminal.lastSeenLocation}
                  </span>
                  <span className="flex items-center gap-1 text-red-400 group-hover:translate-x-1 transition-transform font-bold shrink-0">
                    Досье <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Full Criminal Dossier Modal */}
        {selectedProfile && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-full max-w-xl bg-[#111626] border-2 border-red-600 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              
              {/* Dossier Header */}
              <div className="p-4 bg-red-950/90 border-b border-red-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-6 h-6 text-red-400 animate-pulse" />
                  <div>
                    <h3 className="font-black text-sm sm:text-base text-white tracking-wide uppercase">
                      ОРИЕНТИРОВКА НА ЗАДЕРЖАНИЕ • {selectedProfile.id}
                    </h3>
                    <p className="text-[10px] text-red-300 font-mono">ГРИФ СЕКРЕТНОСТИ: СОВЕРШЕННО СЕКРЕТНО</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Dossier Body */}
              <div className="p-5 overflow-y-auto space-y-4 font-sans text-xs">
                {/* Mugshot & Main Bio */}
                <div className="flex flex-col sm:flex-row gap-4 items-start bg-[#161c30] p-4 rounded-2xl border border-[#273252]">
                  <div className="w-24 h-32 rounded-2xl bg-black border-2 border-red-500 flex flex-col items-center justify-center text-5xl shadow-xl shrink-0 mx-auto sm:mx-0">
                    <span>{selectedProfile.photoEmoji}</span>
                    <span className="text-[9px] font-mono text-red-500 font-black mt-2">MUGSHOT №{selectedProfile.id.split('-')[1]}</span>
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${selectedProfile.dangerColor}`}>
                        {selectedProfile.dangerLevel}
                      </span>
                      <span className="font-mono text-xs font-black text-amber-400">
                        ВОЗНАГРАЖДЕНИЕ: {selectedProfile.bounty}
                      </span>
                    </div>

                    <h2 className="text-base font-black text-white">{selectedProfile.fullName}</h2>
                    <p className="text-xs text-amber-400 font-bold">Кличка в оперативной сводке: {selectedProfile.nickname}</p>
                    
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-gray-300 font-mono">
                      <div><span className="text-gray-500">Год рождения:</span> {selectedProfile.birthYear} г.</div>
                      <div><span className="text-gray-500">Дата розыска:</span> {selectedProfile.registeredDate}</div>
                    </div>
                  </div>
                </div>

                {/* Accusation Box */}
                <div className="p-4 bg-red-950/40 border border-red-500/50 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-red-400 text-xs font-mono uppercase flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> {selectedProfile.article}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">Мера: Заключение под стражу</span>
                  </div>
                  <h4 className="font-black text-white text-xs sm:text-sm">
                    {selectedProfile.crimeTitle}
                  </h4>
                  <p className="text-gray-200 text-xs leading-relaxed">
                    {selectedProfile.crimeDescription}
                  </p>
                </div>

                {/* Special signs and Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#161c30] border border-[#273252] rounded-xl space-y-1">
                    <span className="text-gray-400 font-bold block text-[10px] uppercase font-mono">Особые приметы:</span>
                    <p className="text-gray-200">{selectedProfile.specialSigns}</p>
                  </div>
                  <div className="p-3 bg-[#161c30] border border-[#273252] rounded-xl space-y-1">
                    <span className="text-gray-400 font-bold block text-[10px] uppercase font-mono">Последнее место фиксации:</span>
                    <p className="text-gray-200 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" /> {selectedProfile.lastSeenLocation}
                    </p>
                  </div>
                </div>

                {/* Report status message if triggered */}
                {reportedFugitiveId === selectedProfile.id && (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-xl text-emerald-300 font-mono text-xs flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Сигнал передан дежурной части! Оперативная группа выехала по указанным координатам.</span>
                  </div>
                )}
              </div>

              {/* Dossier Footer Controls */}
              <div className="p-4 bg-[#0e121f] border-t border-[#242e4c] flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => handleReportLocation(selectedProfile.id)}
                  className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase rounded-xl cursor-pointer shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Сообщить о местонахождении (+7 800-02)</span>
                </button>

                <button
                  onClick={handlePrintWarrant}
                  className="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-gray-200 font-bold text-xs rounded-xl cursor-pointer border border-white/10 flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>{isPrinting ? 'Печать ориентировки...' : 'Распечатать'}</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </ToolWrapper>
    </div>
  );
};
