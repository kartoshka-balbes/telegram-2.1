import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import {
  ShieldAlert,
  Search,
  AlertTriangle,
  FileText,
  PhoneCall,
  CheckCircle2,
  X,
  Fingerprint,
  Radio,
  Eye,
  BadgeAlert,
  Award
} from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface CriminalProfile {
  id: string;
  fullName: string;
  alias: string;
  photoEmoji: string;
  article: string;
  crimeTitle: string;
  crimeDescription: string;
  dangerLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  dangerText: string;
  birthYear: number;
  height: number;
  eyes: string;
  specialMarks: string;
  lastSeen: string;
  reward: string;
  status: string;
}

const CRIMINALS: CriminalProfile[] = [
  {
    id: 'cr-01',
    fullName: 'Иванов Валерий Геннадьевич',
    alias: 'Кефирный Барон',
    photoEmoji: '🧔',
    article: 'Ст. 330.4 УК РФ (Самоуправство при отягчающих)',
    crimeTitle: 'Вскрытие пакета кефира с противоположной стороны',
    crimeDescription:
      'В ходе оперативно-розыскных мероприятий установлено: подозреваемый 14 июня в помещении общего пользования умышленно отрезал тупыми ножницами противоположный угол тетрапака с кефиром 3.2% жирности против часовой стрелки, проигнорировав заводской перфорированный клапан. На замечания свидетелей реагировал хладнокровным молчанием.',
    dangerLevel: 'CRITICAL',
    dangerText: 'ОСОБО ОПАСЕН • ВООРУЖЕН ТУПЫМИ НОЖНИЦАМИ',
    birthYear: 1984,
    height: 182,
    eyes: 'Серые',
    specialMarks: 'Носит носки разного оттенка серого, подозрительно уверенно смотрит на молочные полки.',
    lastSeen: 'Москва, молочный отдел гипермаркета на Варшавском шоссе',
    reward: '5 000 000 ₽',
    status: 'ФЕДЕРАЛЬНЫЙ РОЗЫСК'
  },
  {
    id: 'cr-02',
    fullName: 'Смирнов Арсений Павлович',
    alias: 'Пузырьковый Маньяк',
    photoEmoji: '👨‍🦱',
    article: 'Ст. 213.8 УК РФ (Хулиганство высокой интенсивности)',
    crimeTitle: 'Несанкционированное уничтожение упаковочной воздушно-пузырьковой плёнки',
    crimeDescription:
      'Обвиняется в серийном вероломном лопании чужой пузырчатой упаковочной плёнки. Лишил коллег и заказчиков антистрессового материала общим объёмом свыше 1 420 пузырьков за один непрерывный сеанс. Экспертиза признала действия циничными и целенаправленными.',
    dangerLevel: 'CRITICAL',
    dangerText: 'СКЛОНЕН К РЕЦИДИВУ ПРИ ВИДЕ ПОСЫЛОК',
    birthYear: 1991,
    height: 176,
    eyes: 'Карие',
    specialMarks: 'Характерные мозоли на подушечках больших и указательных пальцев, гипертрофированная мелкая моторика.',
    lastSeen: 'Санкт-Петербург, пункт выдачи заказов на Лиговском проспекте',
    reward: '3 500 000 ₽',
    status: 'МЕЖДУНАРОДНЫЙ РОЗЫСК (ИНТЕРПОЛ)'
  },
  {
    id: 'cr-03',
    fullName: 'Ковалёв Станислав Юрьевич',
    alias: 'Шкафный Диверсант',
    photoEmoji: '👨‍🦰',
    article: 'Ст. 167.3 УК РФ (Умышленное нарушение гармонии быта)',
    crimeTitle: 'Тайный разворот ручек всех кружек в серванте влево',
    crimeDescription:
      'Проникая в помещения под видом мастера по проверке вентиляции, гражданин Ковалёв осуществлял методичный разворот ручек чашек и кружек в сторону, неудобную для правшей. Также переставлял магниты на дверце холодильника в антихронологическом порядке.',
    dangerLevel: 'HIGH',
    dangerText: 'ДЕЙСТВУЕТ БЕСШУМНО • НАРУШАЕТ ФЭНШУЙ',
    birthYear: 1988,
    height: 179,
    eyes: 'Зеленые',
    specialMarks: 'Носит антистатические перчатки, в карманах обнаружены неодимовые магниты.',
    lastSeen: 'Екатеринбург, ул. Малышева, подъезд жилого дома',
    reward: '2 800 000 ₽',
    status: 'ФЕДЕРАЛЬНЫЙ РОЗЫСК'
  },
  {
    id: 'cr-04',
    fullName: 'Петров Олег Борисович',
    alias: 'Скотчевый Рецидивист',
    photoEmoji: '👨‍🦳',
    article: 'Ст. 158.4 УК РФ (Причинение морального ущерба без загнутого края)',
    crimeTitle: 'Оставление рулона упаковочного скотча без загнутого края',
    crimeDescription:
      'Гражданин систематически отрезает клейкую ленту и оставляет край плотно прилипшим к мотку, не подгибая уголок. В результате преступной халатности более 28 сотрудников логистического терминала повредили ногтевые пластины в безуспешных попытках нащупать край ленты.',
    dangerLevel: 'HIGH',
    dangerText: 'ВЫСОКАЯ СТЕПЕНЬ ОБЩЕСТВЕННОЙ ОПАСНОСТИ',
    birthYear: 1979,
    height: 185,
    eyes: 'Серо-голубые',
    specialMarks: 'Обладает острым канцелярским ножом и запасом упаковочной ленты 50 мм.',
    lastSeen: 'Новосибирск, логистический складской комплекс «Север»',
    reward: '4 000 000 ₽',
    status: 'ФЕДЕРАЛЬНЫЙ РОЗЫСК'
  },
  {
    id: 'cr-05',
    fullName: 'Григорьев Дмитрий Эдуардович',
    alias: 'Лифтовой Фантом',
    photoEmoji: '🧑',
    article: 'Ст. 281.2 УК РФ (Диверсионное удержание лифтового оборудования)',
    crimeTitle: 'Нажатие кнопки закрытия дверей за 0.3 сек до приближения соседа',
    crimeDescription:
      'Изучив тайминги пассажирских лифтов, гражданин Григорьев систематически нажимает кнопку принудительного закрытия створок ровно в момент, когда в подъезд входит жилец с тяжелыми пакетами с продуктами, после чего имитирует глубокую концентрацию на экране смартфона.',
    dangerLevel: 'HIGH',
    dangerText: 'ИЗБЕГАЕТ ПРЯМОГО ЗРИТЕЛЬНОГО КОНТАКТА',
    birthYear: 1995,
    height: 174,
    eyes: 'Темно-карие',
    specialMarks: 'Наушники с активным шумоподавлением, непроницаемое выражение лица.',
    lastSeen: 'Казань, ЖК «Чистое Небо», лифтовой холл',
    reward: '2 200 000 ₽',
    status: 'РОЗЫСК ГУ МВД'
  },
  {
    id: 'cr-06',
    fullName: 'Федосеева Ангелина Марковна',
    alias: 'Чайная Экономка',
    photoEmoji: '👩‍🦱',
    article: 'Ст. 205.9 УК РФ (Нарушение регламента заваривания чая)',
    crimeTitle: 'Заваривание одного пакетика чая на 4 кружки с отжимом ложкой',
    crimeDescription:
      'Обвиняется в организации несанкционированного вторичного и третичного использования чайного сырья. Опуская пакетик «Принцесса Нури» на 1.5 секунды в каждую кружку, завершала цикл грубым механическим сдавливанием пакетика о край фарфора чайной ложкой до появления горечи.',
    dangerLevel: 'MEDIUM',
    dangerText: 'МОЖЕТ ПРЕДЛОЖИТЬ ВАМ РАЗБАВЛЕННЫЙ КИПЯТОК',
    birthYear: 1982,
    height: 168,
    eyes: 'Карие',
    specialMarks: 'Носит фартук с логотипом бухгалтерии, держит ложку наготове.',
    lastSeen: 'Самара, офисное здание на Московском шоссе',
    reward: '1 500 000 ₽',
    status: 'МЕСТНЫЙ РОЗЫСК'
  },
  {
    id: 'cr-07',
    fullName: 'Васильев Кирилл Романович',
    alias: 'Ночной Хруст',
    photoEmoji: '👱‍♂️',
    article: 'Ст. 293.1 УК РФ (Нарушение режима тишины в ночное время)',
    crimeTitle: 'Вскрытие фольгированного пакета чипсов в 03:42 ночи',
    crimeDescription:
      'В период действия режима абсолютной тишины субъект произвел медленное, сверхвысокочастотное шуршание металлизированной упаковкой рифленых чипсов в течение 11 минут, доведя 4 спящих членов семьи до состояния нервного срыва.',
    dangerLevel: 'HIGH',
    dangerText: 'ДЕЙСТВУЕТ В УСЛОВИЯХ ПОЛНОЙ ТЕМНОТЫ',
    birthYear: 1999,
    height: 188,
    eyes: 'Голубые',
    specialMarks: 'Следы паприки на пальцах правой руки, тапочки с бесшумной подошвой.',
    lastSeen: 'Нижний Новгород, кухня квартиры на ул. Белинского',
    reward: '3 000 000 ₽',
    status: 'ФЕДЕРАЛЬНЫЙ РОЗЫСК'
  },
  {
    id: 'cr-08',
    fullName: 'Романов Илья Денисович',
    alias: 'Гречневый Архитектор',
    photoEmoji: '👨',
    article: 'Ст. 165.7 УК РФ (Оставление критического остатка крупы)',
    crimeTitle: 'Оставление ровно 22 граммов гречки на дне коробки',
    crimeDescription:
      'Пересыпая крупу в стеклянную банку для хранения, гражданин Романов умышленно оставил в картонной коробке ровно 22 грамма продукта, чего недостаточно даже для половины порции, и вернул пустую коробку на полку, создав ложную иллюзию наличия запасов.',
    dangerLevel: 'MEDIUM',
    dangerText: 'СОЗДАЕТ ДЕФИЦИТ ПРОДОВОЛЬСТВИЯ В СЕМЬЕ',
    birthYear: 1993,
    height: 180,
    eyes: 'Серые',
    specialMarks: 'Стеклянная мерная ложка в нагрудном кармане.',
    lastSeen: 'Краснодар, продуктовый склад на ул. Красной',
    reward: '1 800 000 ₽',
    status: 'РОЗЫСК ГУ МВД'
  },
  {
    id: 'cr-09',
    fullName: 'Михайлова Светлана Игоревна',
    alias: 'Эскалаторная Преграда',
    photoEmoji: '👩',
    article: 'Ст. 263.2 УК РФ (Блокирование транспортного потока)',
    crimeTitle: 'Остановка с чемоданом по левой стороне эскалатора метро в час пик',
    crimeDescription:
      'В 18:15 на пересадочном узле «Библиотека им. Ленина» гражданка Михайлова заняла левый ряд эскалатора, выставила дорожный чемодан на 4 поворотных колесах поперек ступеней и игнорировала голосовые призывы «Проходите слева, стойте справа».',
    dangerLevel: 'CRITICAL',
    dangerText: 'ПРОВОЦИРУЕТ МАССОВЫЕ ЗАДЕРЖКИ ПАССАЖИРОВ',
    birthYear: 1987,
    height: 171,
    eyes: 'Карие',
    specialMarks: 'Чемодан цвета фуксии с оторванной биркой «Priority».',
    lastSeen: 'Москва, станция метро Охотный Ряд',
    reward: '4 500 000 ₽',
    status: 'ФЕДЕРАЛЬНЫЙ РОЗЫСК'
  },
  {
    id: 'cr-10',
    fullName: 'Зайцев Максим Андреевич',
    alias: 'Батареечный Фальсификатор',
    photoEmoji: '🧔‍♂️',
    article: 'Ст. 171.5 УК РФ (Незаконное продление ресурса элементов питания)',
    crimeTitle: 'Постукивание разряженных батареек ААА друг об друга',
    crimeDescription:
      'Вместо регламентной утилизации отработанных гальванических элементов гражданин Зайцев вскрыл пульт дистанционного управления, извлек батарейки, произвел серию динамических ударов корпусами элементов для выдавливания остаточного заряда на 3 включения телевизора.',
    dangerLevel: 'MEDIUM',
    dangerText: 'ОТКАЗЫВАЕТСЯ ПОСЕЩАТЬ ПУНКТЫ УТИЛИЗАЦИИ БАТАРЕЕК',
    birthYear: 1986,
    height: 177,
    eyes: 'Серые',
    specialMarks: 'Мультиметр в чехле на поясе, на пальцах следы оксида цинка.',
    lastSeen: 'Челябинск, проспект Ленина',
    reward: '2 100 000 ₽',
    status: 'РОЗЫСК ГУ МВД'
  }
];

export const PoliceReportTool: React.FC<ToolProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDangerFilter, setSelectedDangerFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');
  const [activeProfile, setActiveProfile] = useState<CriminalProfile | null>(null);
  const [reportedFugitiveId, setReportedFugitiveId] = useState<string | null>(null);
  const [isScanningFingerprint, setIsScanningFingerprint] = useState(false);

  const handleOpenProfile = (crim: CriminalProfile) => {
    soundManager.playBeep(900, 0.04);
    setActiveProfile(crim);
    setReportedFugitiveId(null);
  };

  const handleReportLocation = (id: string) => {
    soundManager.playBeep(1200, 0.1);
    setReportedFugitiveId(id);
  };

  const handleScanBiometrics = () => {
    soundManager.playBeep(1400, 0.08);
    setIsScanningFingerprint(true);
    setTimeout(() => {
      setIsScanningFingerprint(false);
      soundManager.playBeep(1800, 0.12);
    }, 1200);
  };

  const filteredCriminals = CRIMINALS.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.crimeTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.article.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDanger =
      selectedDangerFilter === 'ALL' || c.dangerLevel === selectedDangerFilter;

    return matchesSearch && matchesDanger;
  });

  return (
    <div
      onPointerDown={() => {
        soundManager.playRock();
      }}
      className="h-full w-full flex flex-col"
    >
      <ToolWrapper title="Полицейская сводка МВД" onClose={onClose} headerColor="bg-[#0b1528] border-blue-900">
      
      {/* ========================================================================= */}
      {/* DETAILED CRIMINAL DOSSIER MODAL */}
      {/* ========================================================================= */}
      {activeProfile && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 animate-in fade-in zoom-in-95 duration-150">
          <div className="w-full max-w-xl bg-[#0e1726] border-2 border-red-600 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Dossier Header */}
            <div className="p-4 bg-gradient-to-r from-red-950 via-slate-900 to-blue-950 border-b border-red-600/60 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-600/30 border border-red-500 flex items-center justify-center text-red-400">
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-black uppercase tracking-widest text-red-400">
                      ДОСЬЕ № {activeProfile.id.toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 bg-red-600 text-white font-mono text-[9px] font-black rounded uppercase">
                      {activeProfile.status}
                    </span>
                  </div>
                  <h3 className="font-black text-sm sm:text-base text-white tracking-tight">{activeProfile.fullName}</h3>
                </div>
              </div>

              <button
                onClick={() => setActiveProfile(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 font-mono text-xs text-slate-200">
              
              {/* Photo & Biometric Card */}
              <div className="flex flex-col sm:flex-row gap-4 p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
                <div className="w-24 h-28 bg-slate-900 border-2 border-red-500/50 rounded-xl flex flex-col items-center justify-center shrink-0 relative overflow-hidden">
                  <span className="text-5xl">{activeProfile.photoEmoji}</span>
                  <span className="absolute bottom-1 text-[8px] font-black bg-red-600/80 text-white px-1 rounded uppercase">
                    ФОТО ИЗ БАЗЫ
                  </span>
                </div>

                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                    <span className="text-slate-400 text-[10px]">Кличка / Псевдоним:</span>
                    <span className="font-black text-amber-400 text-xs">«{activeProfile.alias}»</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">Год рождения:</span>
                    <span className="text-white font-bold">{activeProfile.birthYear} г.</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">Рост / Цвет глаз:</span>
                    <span className="text-white font-bold">{activeProfile.height} см / {activeProfile.eyes}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">Вознаграждение:</span>
                    <span className="font-black text-emerald-400 text-xs">{activeProfile.reward}</span>
                  </div>
                </div>
              </div>

              {/* Danger Warning Alert */}
              <div className="p-3 bg-red-950/40 border border-red-600/40 rounded-xl flex items-center gap-2 text-red-300 text-[11px] font-bold">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 animate-bounce" />
                <span>{activeProfile.dangerText}</span>
              </div>

              {/* Crime Details */}
              <div className="space-y-1.5 p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                <span className="text-[10px] text-amber-400 font-black uppercase block tracking-wider">
                  Квалификация преступления:
                </span>
                <p className="font-black text-white text-xs">{activeProfile.article}</p>
                <p className="text-slate-300 font-sans text-xs leading-relaxed mt-1">
                  {activeProfile.crimeDescription}
                </p>
              </div>

              {/* Special Marks & Last Known Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-slate-400 text-[10px] block font-bold">Особые приметы:</span>
                  <p className="text-slate-200">{activeProfile.specialMarks}</p>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-slate-400 text-[10px] block font-bold">Последний раз замечен:</span>
                  <p className="text-cyan-300">{activeProfile.lastSeen}</p>
                </div>
              </div>

              {/* Report Confirmation Alert */}
              {reportedFugitiveId === activeProfile.id && (
                <div className="p-3.5 bg-emerald-950/60 border border-emerald-500 rounded-xl flex items-center gap-2 text-emerald-300 text-xs font-bold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Ваше сообщение принято дежурной частью. Наряд полиции выехал на проверку координат.</span>
                </div>
              )}
            </div>

            {/* Dossier Footer Actions */}
            <div className="p-3.5 bg-[#0b121e] border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={handleScanBiometrics}
                disabled={isScanningFingerprint}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Fingerprint className={`w-3.5 h-3.5 text-cyan-400 ${isScanningFingerprint ? 'animate-spin' : ''}`} />
                <span>{isScanningFingerprint ? 'Сверка дактилоскопии...' : 'Проверить отпечатки'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleReportLocation(activeProfile.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-black uppercase rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-red-600/30"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Сообщить в 112</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN POLICE REPORT BOARD */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full py-2 font-mono text-xs select-none space-y-3">
        
        {/* Header Alert Ribbon */}
        <div className="p-3 bg-gradient-to-r from-red-950 via-slate-900 to-blue-950 border border-red-600/50 rounded-2xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-red-500 animate-pulse" />
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                Единая информационная система розыска МВД РФ
              </h3>
              <p className="text-[10px] text-slate-400">
                База данных подозреваемых лиц, находящихся в бегах
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-red-600/20 border border-red-500/40 rounded-lg text-red-400 text-[10px] font-black">
            <BadgeAlert className="w-3.5 h-3.5" />
            <span>ОБНОВЛЕНО СЕГОДНЯ</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по ФИО, кличке, статье или деянию..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => {
                soundManager.playBeep(800, 0.03);
                setSelectedDangerFilter('ALL');
              }}
              className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase transition-all cursor-pointer ${
                selectedDangerFilter === 'ALL'
                  ? 'bg-red-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              Все ориентировки ({CRIMINALS.length})
            </button>
            <button
              onClick={() => {
                soundManager.playBeep(800, 0.03);
                setSelectedDangerFilter('CRITICAL');
              }}
              className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase transition-all cursor-pointer ${
                selectedDangerFilter === 'CRITICAL'
                  ? 'bg-red-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              Особо опасные
            </button>
            <button
              onClick={() => {
                soundManager.playBeep(800, 0.03);
                setSelectedDangerFilter('HIGH');
              }}
              className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase transition-all cursor-pointer ${
                selectedDangerFilter === 'HIGH'
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              Высокий приоритет
            </button>
            <button
              onClick={() => {
                soundManager.playBeep(800, 0.03);
                setSelectedDangerFilter('MEDIUM');
              }}
              className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase transition-all cursor-pointer ${
                selectedDangerFilter === 'MEDIUM'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              Местный розыск
            </button>
          </div>
        </div>

        {/* Criminals Grid / List */}
        <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
          {filteredCriminals.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500">
              По данному запросу ориентировок не найдено
            </div>
          ) : (
            filteredCriminals.map((crim) => (
              <div
                key={crim.id}
                onClick={() => handleOpenProfile(crim)}
                className="bg-slate-900 border border-slate-800 hover:border-red-500/70 p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer group transition-all hover:scale-[1.005] shadow-md"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-12 h-14 bg-slate-950 border border-slate-800 group-hover:border-red-500/50 rounded-xl flex items-center justify-center text-3xl shrink-0 shadow-inner">
                    {crim.photoEmoji}
                  </div>
                  <div className="truncate space-y-0.5">
                    <div className="flex items-center gap-2 truncate">
                      <h4 className="text-xs font-black text-white truncate group-hover:text-red-400 transition-colors">
                        {crim.fullName}
                      </h4>
                      <span className="text-[10px] text-amber-400 font-bold shrink-0">
                        «{crim.alias}»
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{crim.article}</p>
                    <p className="text-[10px] text-red-300 font-medium truncate">{crim.crimeTitle}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[10px] font-black text-emerald-400 font-mono bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
                    {crim.reward}
                  </span>
                  <span className="text-[9px] text-slate-500 group-hover:text-red-400 flex items-center gap-1 font-bold">
                    <span>Открыть</span>
                    <Eye className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Authority Notice */}
        <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-center text-slate-500 text-[9px] flex items-center justify-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-600" />
          <span>ГЛАВНОЕ УПРАВЛЕНИЕ УГОЛОВНОГО РОЗЫСКА МВД РФ • КОНФИДЕНЦИАЛЬНОСТЬ ГАРАНТИРУЕТСЯ</span>
        </div>

      </div>
    </ToolWrapper>
    </div>
  );
};
