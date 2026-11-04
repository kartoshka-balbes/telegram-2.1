import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Gauge, Radio, Compass, Anchor, Rocket, Navigation, Eye, Zap, AlertTriangle, ShieldAlert, RefreshCw } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export type InstrumentType =
  | 'dynamometer' | 'accelerometer' | 'wattmeter' | 'ohmmeter' | 'magnetometer'
  | 'frequency_meter' | 'oscilloscope' | 'spectrometer' | 'dosimeter' | 'manometer'
  | 'psychrometer' | 'calorimeter' | 'electrometer' | 'bolometer' | 'anemometer'
  | 'gas_analyzer' | 'hygrometer' | 'rangefinder' | 'phasemeter' | 'odometer'
  | 'electrolyzer' | 'cryoscope' | 'reactor'
  | 'fishfinder' | 'georadar' | 'echosounder' | 'marine_compass' | 'depth_gauge'
  | 'ship_log' | 'radar' | 'marine_gps' | 'salinometer' | 'current_meter' | 'wave_meter'
  | 'astrolabe' | 'radiotelescope' | 'telescope' | 'sun_sensor' | 'star_sensor'
  | 'space_gyroscope' | 'space_dosimeter' | 'solar_panel' | 'orientation_system'
  | 'altimeter' | 'attitude_indicator' | 'heading_indicator' | 'tcas' | 'weather_radar'
  | 'autopilot' | 'g_meter' | 'black_box' | 'soil_moisture' | 'co2_meter' | 'refractometer'
  | 'pyrometer' | 'caliper' | 'micrometer' | 'vibrometer' | 'chronometer' | 'densitometer'
  | 'multimeter' | 'megohmmeter' | 'spectrophotometer' | 'viscometer' | 'polarimeter'
  | 'goniometer' | 'variometer' | 'inclinometer' | 'gravimeter' | 'seismograph';

interface InstrumentConfig {
  title: string;
  unit: string;
  icon: React.ReactNode;
  category: string;
  seriousDesc: string;
  generateValue: () => { value: string; extra: string };
}

const INSTRUMENTS_CONFIG: Record<InstrumentType, InstrumentConfig> = {
  dynamometer: {
    title: 'Динамометр',
    unit: 'Ньютон (Н)',
    icon: <Gauge className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Механика',
    seriousDesc: 'Высокоточный электронно-механический измеритель силы сжатия и растяжения.',
    generateValue: () => ({ value: `${(Math.random() * 950000 + 500000).toLocaleString('ru-RU')} Н`, extra: 'Предел прочности материала превышен на 420%' }),
  },
  accelerometer: {
    title: 'Акселерометр',
    unit: 'м/с²',
    icon: <Gauge className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Кинематика',
    seriousDesc: 'Трёхосевой прецизионный датчик линейного ускорения объекта.',
    generateValue: () => ({ value: `${(Math.random() * 450 + 120).toFixed(2)} м/с²`, extra: 'Внимание: Вектор ускорения Z направлен в ядро Земли' }),
  },
  wattmeter: {
    title: 'Ваттметр',
    unit: 'Ватт (Вт)',
    icon: <Zap className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Электротехника',
    seriousDesc: 'Прибор для измерения активной и реактивной электрической мощности.',
    generateValue: () => ({ value: `${(Math.random() * 89000000 + 10000000).toLocaleString('ru-RU')} Вт`, extra: 'Мощность эквивалентна 3 крупным гидроэлектростанциям' }),
  },
  ohmmeter: {
    title: 'Омметр',
    unit: 'Ом (Ω)',
    icon: <Gauge className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Электротехника',
    seriousDesc: 'Измеритель электрического сопротивления цепей переменного и постоянного тока.',
    generateValue: () => ({ value: `${(Math.random() * 999000000 + 1000000).toLocaleString('ru-RU')} Ом`, extra: 'Сопротивление изоляции близко к вакууму' }),
  },
  magnetometer: {
    title: 'Магнитометр',
    unit: 'Тесла (Тл)',
    icon: <Compass className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Геофизика',
    seriousDesc: 'Прибор для измерения характеристик магнитного поля и магнитных свойств.',
    generateValue: () => ({ value: `${(Math.random() * 85 + 15).toFixed(3)} Тл`, extra: 'Зафиксировано инверсирование магнитных полюсов' }),
  },
  frequency_meter: {
    title: 'Частотомер',
    unit: 'Герц (Гц)',
    icon: <Radio className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Радиотехника',
    seriousDesc: 'Измеритель частоты периодических сигналов высочайшей точности.',
    generateValue: () => ({ value: `${(Math.random() * 50000000000 + 1000000000).toLocaleString('ru-RU')} Гц`, extra: ' несущая частота сверхвысокого спектра' }),
  },
  oscilloscope: {
    title: 'Осциллограф',
    unit: 'Амплитуда V',
    icon: <Radio className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Лаборатория',
    seriousDesc: 'Визуализатор формы амплитудных и временных параметров электрического сигнала.',
    generateValue: () => ({ value: `ГАРМОНИКА: 1.21 ГВт / 440 Гц`, extra: 'Синусоида имеет аномальные пики в инфракрасном диапазоне' }),
  },
  spectrometer: {
    title: 'Спектрометр',
    unit: 'Нанометр (нм)',
    icon: <Radio className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Оптика',
    seriousDesc: 'Анализатор оптических спектров излучения и поглощения вещества.',
    generateValue: () => ({ value: `${(Math.random() * 800 + 200).toFixed(1)} нм`, extra: 'Обнаружен спектральный след неизвестного изотопа' }),
  },
  dosimeter: {
    title: 'Дозиметр',
    unit: 'мкЗв/ч',
    icon: <AlertTriangle className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Радиация',
    seriousDesc: 'Измеритель дозы или мощности дозы ионизирующего излучения.',
    generateValue: () => ({ value: `${(Math.random() * 8500 + 1200).toFixed(1)} мкЗв/ч`, extra: 'КРИТИЧЕСКИЙ УРОВЕНЬ: Норма превышена в 42 000 раз!' }),
  },
  manometer: {
    title: 'Манометр',
    unit: 'Паскаль (Па)',
    icon: <Gauge className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Гидравлика',
    seriousDesc: 'Прибор для измерения давления газов и жидкостей в замкнутом объеме.',
    generateValue: () => ({ value: `${(Math.random() * 450000000 + 50000000).toLocaleString('ru-RU')} Па`, extra: 'Давление превышает Марианскую впадину' }),
  },
  psychrometer: {
    title: 'Психрометр',
    unit: 'Влажность %',
    icon: <Gauge className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Метеорология',
    seriousDesc: 'Измеритель относительной влажности и температуры воздуха.',
    generateValue: () => ({ value: `${(Math.random() * 10 + 98.5).toFixed(1)} %`, extra: 'Сухой и влажный термометры слились в единое целое' }),
  },
  calorimeter: {
    title: 'Калориметр',
    unit: 'Джоуль (Дж)',
    icon: <Zap className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Термодинамика',
    seriousDesc: 'Измеритель количества теплоты, выделяющейся в химических процессах.',
    generateValue: () => ({ value: `${(Math.random() * 9900000000 + 1000000000).toLocaleString('ru-RU')} Дж`, extra: 'Энерговыделение соответствует взрыву сверхновой' }),
  },
  electrometer: {
    title: 'Электрометр',
    unit: 'Кулон (Кл)',
    icon: <Zap className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Физика',
    seriousDesc: 'Измеритель электрического заряда и потенциала тела.',
    generateValue: () => ({ value: `${(Math.random() * 850 + 100).toFixed(2)} Кл`, extra: 'Статический заряд способен ионизировать атмосферу' }),
  },
  bolometer: {
    title: 'Болометр',
    unit: 'Вт/м²',
    icon: <Gauge className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Астрофизика',
    seriousDesc: 'Сверхчувствительный детектор энергии электромагнитного излучения.',
    generateValue: () => ({ value: `${(Math.random() * 45000 + 15000).toLocaleString('ru-RU')} Вт/м²`, extra: 'Плотность потока излучения близка к поверхности звезды' }),
  },
  anemometer: {
    title: 'Анемометр',
    unit: 'м/с',
    icon: <Gauge className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Метеорология',
    seriousDesc: 'Прибор для измерения скорости движения воздушных потоков.',
    generateValue: () => ({ value: `${(Math.random() * 320 + 85).toFixed(1)} м/с`, extra: 'Скорость ветра превышает ураган 5-й категории' }),
  },
  gas_analyzer: {
    title: 'Газоанализатор',
    unit: 'PPM',
    icon: <Radio className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Экология',
    seriousDesc: 'Измеритель качественного и количественного состава газовых смесей.',
    generateValue: () => ({ value: `CH4: ${(Math.random() * 8500 + 1500).toFixed(0)} PPM`, extra: 'Концентрация метана превышает взрывоопасный порог' }),
  },
  hygrometer: {
    title: 'Гигрометр',
    unit: '%',
    icon: <Gauge className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Климат',
    seriousDesc: 'Измеритель влажности газов.',
    generateValue: () => ({ value: `${(Math.random() * 5 + 99.2).toFixed(1)} %`, extra: 'Конденсация достигла 100% точки росы' }),
  },
  rangefinder: {
    title: 'Дальномер',
    unit: 'Метр (м)',
    icon: <Gauge className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Геодезия',
    seriousDesc: 'Лазерный измеретель дистанции до объекта.',
    generateValue: () => ({ value: `${(Math.random() * 8900000 + 1000000).toLocaleString('ru-RU')} м`, extra: 'Дистанция измерена до орбиты Луны' }),
  },
  phasemeter: {
    title: 'Фазометр',
    unit: 'Градус (°)',
    icon: <Gauge className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Радиоэлектроника',
    seriousDesc: 'Измеритель сдвига фаз двух гармонических колебаний.',
    generateValue: () => ({ value: `${(Math.random() * 360).toFixed(2)}°`, extra: 'Сдвиг фазы находится в противофазе пространственной сетки' }),
  },
  odometer: {
    title: 'Одометр',
    unit: 'Километр (км)',
    icon: <Gauge className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Транспорт',
    seriousDesc: 'Счётчик количества оборотов колеса и пройденного пути.',
    generateValue: () => ({ value: `${(Math.random() * 89000000 + 10000000).toLocaleString('ru-RU')} км`, extra: 'Пробег равен 200 кругосветным путешествиям' }),
  },
  electrolyzer: {
    title: 'Электролизёр',
    unit: 'А/см²',
    icon: <Zap className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Химия',
    seriousDesc: 'Установка для проведения электрохимических реакций под током.',
    generateValue: () => ({ value: `ПЛОТНОСТЬ ТОКА: ${(Math.random() * 450 + 150).toFixed(1)} А/см²`, extra: 'Выделение чистого водорода: 1200 м³/мин' }),
  },
  cryoscope: {
    title: 'Криоскоп',
    unit: 'Градус Цельсия (°C)',
    icon: <Gauge className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Криогеника',
    seriousDesc: 'Прибор для определения температуры замерзания растворов.',
    generateValue: () => ({ value: `-272.${Math.floor(Math.random() * 89 + 10)} °C`, extra: 'Температура зафиксирована в 0.05 K от абсолютного нуля' }),
  },
  reactor: {
    title: 'Ядерный Реактор',
    unit: 'Мегаватт (МВт)',
    icon: <AlertTriangle className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Энергетика',
    seriousDesc: 'Датчик мониторинга нейтронного потока и тепловой мощности активной зоны.',
    generateValue: () => ({ value: `${(Math.random() * 45000 + 12000).toLocaleString('ru-RU')} МВт`, extra: 'ПОТОК НЕЙТРОНОВ: 4.8×10¹⁵ н/см²·с (Штатный режим)' }),
  },
  // Marine
  fishfinder: {
    title: 'Рыбопоисковый сонар',
    unit: 'Частота кГц',
    icon: <Anchor className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Навигация',
    seriousDesc: 'Гидроакустический эхолот высокого разрешения для поиска биоресурсов.',
    generateValue: () => ({ value: `ОБНАРУЖЕНО: 89 000 ТОНН`, extra: 'Стая гигантских кальмаров на глубине 420 м' }),
  },
  georadar: {
    title: 'Георадар',
    unit: 'Метры проникания',
    icon: <Radio className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Геология',
    seriousDesc: 'Радиолокационный прибор подповерхностного зондирования грунта.',
    generateValue: () => ({ value: `ГЛУБИНА СКАНИРОВАНИЯ: ${(Math.random() * 850 + 150).toFixed(0)} м`, extra: 'Зафиксирована подземная пустота с золотыми монолитами' }),
  },
  echosounder: {
    title: 'Эхолот',
    unit: 'Метр (м)',
    icon: <Anchor className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Судоходство',
    seriousDesc: 'Измеритель рельефа дна методом акустических импульсов.',
    generateValue: () => ({ value: `${(Math.random() * 10500 + 500).toLocaleString('ru-RU')} м`, extra: 'Под килем зарегистрирован неизвестный подводный объект' }),
  },
  marine_compass: {
    title: 'Морской компас',
    unit: 'Румбы / Градусы',
    icon: <Compass className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Навигация',
    seriousDesc: 'Магнитный гирокомпас судовой системы навигации.',
    generateValue: () => ({ value: `КУРС: ${(Math.random() * 360).toFixed(1)}° (НОРД-ВЕСТ)`, extra: 'Девиация магнитного поля компенсирована' }),
  },
  depth_gauge: {
    title: 'Глубиномер',
    unit: 'Метры под водой',
    icon: <Anchor className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Океанология',
    seriousDesc: 'Датчик гидростатического давления судна.',
    generateValue: () => ({ value: `${(Math.random() * 8500 + 500).toLocaleString('ru-RU')} м`, extra: 'Корпус батискафа выдерживает давление 900 атм' }),
  },
  ship_log: {
    title: 'Лаг (Скорость судна)',
    unit: 'Узлы (kts)',
    icon: <Anchor className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Судоходство',
    seriousDesc: 'Измеритель скорости хода судна относительно воды.',
    generateValue: () => ({ value: `${(Math.random() * 120 + 25).toFixed(1)} узлов`, extra: 'Скорость превышает физический предел глиссирования' }),
  },
  radar: {
    title: 'Радиолокатор (Радар)',
    unit: 'Морские мили',
    icon: <Radio className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Освещение обстановки',
    seriousDesc: 'Импульсный круговой радиолокатор морской зоны.',
    generateValue: () => ({ value: `ЦЕЛЕЙ НА ЭКРАНЕ: ${(Math.random() * 450 + 50).toFixed(0)}`, extra: 'Все цели движутся со скоростью 3 Маха' }),
  },
  marine_gps: {
    title: 'Морской Навигатор',
    unit: 'Координаты',
    icon: <Navigation className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Навигация',
    seriousDesc: 'Спутниковый высокоточный терминал позиционирования.',
    generateValue: () => ({ value: `55°45'21" N, 37°37'04" E`, extra: 'Задействовано 32 спутника ГЛОНАСС/GPS' }),
  },
  salinometer: {
    title: 'Солемер',
    unit: 'Промилле (‰)',
    icon: <Gauge className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Гидрохимия',
    seriousDesc: 'Измеритель минерализации и солености морской воды.',
    generateValue: () => ({ value: `${(Math.random() * 120 + 35).toFixed(1)} ‰`, extra: 'Соленость равна уровню Мертвого моря' }),
  },
  current_meter: {
    title: 'Течениемер',
    unit: 'м/с',
    icon: <Anchor className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Океанография',
    seriousDesc: 'Измеритель вектора и скорости подповерхностных течений.',
    generateValue: () => ({ value: `${(Math.random() * 15 + 2.5).toFixed(1)} м/с`, extra: 'Течение Гольфстрим ускорилось на 400%' }),
  },
  wave_meter: {
    title: 'Волномер',
    unit: 'Метр (м)',
    icon: <Anchor className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Метеорология',
    seriousDesc: 'Датчик высоты и периода волнения моря.',
    generateValue: () => ({ value: `ВЫСОТА ВОЛНЫ: ${(Math.random() * 32 + 8).toFixed(1)} м`, extra: 'Зафиксирована волна-убийца (Цунами-Алерт)' }),
  },
  // Space
  astrolabe: {
    title: 'Астролябия',
    unit: 'Угол над горизонтом',
    icon: <Rocket className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Астрономия',
    seriousDesc: 'Древнейший уголомерный прибор определения широты по звёздам.',
    generateValue: () => ({ value: `АЛЬМУКАНТАРАТ: ${(Math.random() * 89).toFixed(2)}°`, extra: 'Широта определена с точностью до угловой секунды' }),
  },
  radiotelescope: {
    title: 'Радиотелескоп',
    unit: 'Янский (Jy)',
    icon: <Radio className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Дальний космос',
    seriousDesc: 'Параболическая антенна приема космического радиоизлучения.',
    generateValue: () => ({ value: `СИГНАЛ WOW!: ${(Math.random() * 850 + 150).toFixed(0)} Jy`, extra: 'Принят разумный код в бинарном формате с созвездия Орион' }),
  },
  telescope: {
    title: 'Оптический Телескоп',
    unit: 'Увеличение крат',
    icon: <Eye className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Астрономия',
    seriousDesc: 'Зеркально-линзовый телескоп наблюдения дальнего космоса.',
    generateValue: () => ({ value: `ЗУМ: 50 000x (HUBBLE MODE)`, extra: 'На поверхности Экзопланеты видны огни мегаполиса' }),
  },
  sun_sensor: {
    title: 'Солнечный датчик',
    unit: 'Вектор светимости',
    icon: <Rocket className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Космонавтика',
    seriousDesc: 'Датчик ориентации космического аппарата по Солнцу.',
    generateValue: () => ({ value: `СМЕЩЕНИЕ: 0.0001°`, extra: 'Солнечные батареи сфокусированы на 100%' }),
  },
  star_sensor: {
    title: 'Звёздный датчик',
    unit: 'Каталог звёзд',
    icon: <Rocket className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Космонавтика',
    seriousDesc: 'Оптико-электронный прибор ориентации по звездам.',
    generateValue: () => ({ value: `ОПОРА: Сириус А / Полярная`, extra: 'Точность ориентации орбитального блока подтверждена' }),
  },
  space_gyroscope: {
    title: 'Космический Гироскоп',
    unit: 'Обороты в минуту',
    icon: <Gauge className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Авионика',
    seriousDesc: 'Лазерный силовой гиродин поддержания углового момента КА.',
    generateValue: () => ({ value: `32 000 ОБ/МИН`, extra: 'Стабилизация гиродинов в норме' }),
  },
  space_dosimeter: {
    title: 'Дозиметр радиации КА',
    unit: 'Рентген/ч',
    icon: <AlertTriangle className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Космос',
    seriousDesc: 'Датчик солнечной радиации и тяжелых ионов в открытом космосе.',
    generateValue: () => ({ value: `${(Math.random() * 450 + 80).toFixed(1)} Р/ч`, extra: 'Зафиксирована солнечная вспышка класса X9.9' }),
  },
  solar_panel: {
    title: 'Солнечная панель КА',
    unit: 'Вольт / Ампер',
    icon: <Zap className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Питание КА',
    seriousDesc: 'Телеметрия генерируемой мощности фотоэлектрических батарей.',
    generateValue: () => ({ value: `ТОК: ${(Math.random() * 850 + 200).toFixed(1)} А`, extra: 'КПД кремниево-галлиевых элементов: 99.8%' }),
  },
  orientation_system: {
    title: 'Система Ориентации',
    unit: 'Углы Эйлера',
    icon: <Rocket className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Управление КА',
    seriousDesc: 'Двигатели ориентации сжатого газа и маховики.',
    generateValue: () => ({ value: `PITCH: 0.00° / ROLL: 0.00°`, extra: 'Стыковочный узел направлен на шлюз МКС' }),
  },
  // Aviation
  altimeter: {
    title: 'Высотомер (Альтиметр)',
    unit: 'Метры / Футы',
    icon: <Gauge className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Авиация',
    seriousDesc: 'Барометрический и радиолокационный высотомер ВС.',
    generateValue: () => ({ value: `${(Math.random() * 18000 + 2000).toLocaleString('ru-RU')} м`, extra: 'Эшелон FL390 выдержан идеально' }),
  },
  attitude_indicator: {
    title: 'Авиагоризонт',
    unit: 'Тангаж / Крен',
    icon: <Navigation className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Пилотаж',
    seriousDesc: 'Гироскопический прибор визуализации пространственного положения ВС.',
    generateValue: () => ({ value: `ТАНГАЖ: +2.5° / КРЕН: 0.0°`, extra: 'Горизонтальный полет на установленной скорости' }),
  },
  heading_indicator: {
    title: 'Указатель курса',
    unit: 'Градусы 0-360',
    icon: <Compass className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Навигация',
    seriousDesc: 'Гиромагнитный компас с индикацией заданного путевого угла.',
    generateValue: () => ({ value: `КУРС: 270° (WEST)`, extra: 'Заход на посадочную полосу 27L' }),
  },
  tcas: {
    title: 'Система TCAS',
    unit: 'Предупреждение столкновений',
    icon: <ShieldAlert className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Безопасность полетов',
    seriousDesc: 'Бортовая система предупреждения опасных сближений ВС.',
    generateValue: () => ({ value: `TRAFFIC, TRAFFIC!`, extra: 'Ближайший борт: 300 метров сверху (CLIMB NOW!)' }),
  },
  weather_radar: {
    title: 'Метеолокатор ВС',
    unit: 'Отражаемость Z',
    icon: <Radio className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Метеонавигация',
    seriousDesc: 'Бортовой радар сканирования грозовых фронтов и турбулентности.',
    generateValue: () => ({ value: `КРАСНЫЙ УРОК: ГРОЗА`, extra: 'Рекомендован обход грозового фронта слева на 20 миль' }),
  },
  autopilot: {
    title: 'Автопилот',
    unit: 'Режим пилотирования',
    icon: <Rocket className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Автоматика',
    seriousDesc: 'Вычислитель траектории трехканального автопилота.',
    generateValue: () => ({ value: `CMD A: ENGAGED (LNAV/VNAV)`, extra: 'Автоматическая посадка CAT III C активна' }),
  },
  g_meter: {
    title: 'Указатель перегрузки',
    unit: 'Единицы G',
    icon: <Gauge className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Динамика полета',
    seriousDesc: 'Измеритель нормальной и продольной перегрузки самолета.',
    generateValue: () => ({ value: `+${(Math.random() * 8.5 + 1.2).toFixed(1)} G`, extra: 'Пилот находится в состоянии кратковременной гипоксии' }),
  },
  black_box: {
    title: 'Чёрный ящик (БСР)',
    unit: 'Параметры полета',
    icon: <Radio className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Регистрация',
    seriousDesc: 'Аварийный защищенный бортовой самописец переговоров и телеметрии.',
    generateValue: () => ({ value: `ЗАПИСЬ: 256 ПАРАМЕТРОВ`, extra: 'Защищенный контейнер выдерживает температуру 1100°C' }),
  },
  // Soil & Lab
  soil_moisture: {
    title: 'Влагомер почвы',
    unit: 'Влажность %',
    icon: <Gauge className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Агрономия',
    seriousDesc: 'Диэлькометрический зонд глубинной влажности грунта.',
    generateValue: () => ({ value: `${(Math.random() * 30 + 65).toFixed(1)} %`, extra: 'Оптимальный уровень орошения плодородного слоя' }),
  },
  co2_meter: {
    title: 'Измеритель CO₂',
    unit: 'PPM',
    icon: <Radio className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Экология',
    seriousDesc: 'Оптический датчик углекислого газа недисперсионного типа.',
    generateValue: () => ({ value: `${(Math.random() * 4500 + 800).toFixed(0)} PPM`, extra: 'Рекомендуется проветрить помещение или эвакуироваться' }),
  },
  refractometer: {
    title: 'Рефрактометр',
    unit: 'Brix (°Bx)',
    icon: <Gauge className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Лаборатория',
    seriousDesc: 'Прибор измерения показателя преломления света в жидкостях.',
    generateValue: () => ({ value: `${(Math.random() * 45 + 10).toFixed(1)} °Bx`, extra: 'Концентрация сухих веществ в норме ГОСТ' }),
  },
  pyrometer: {
    title: 'Пирометр',
    unit: 'Градусы Цельсия (°C)',
    icon: <Gauge className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Термометрия',
    seriousDesc: 'Бесконтактный оптико-электронный измеритель высокой температуры объектов.',
    generateValue: () => ({ value: `${(Math.random() * 1200 + 150).toFixed(1)} °C`, extra: 'Зафиксировано тепловое излучение в инфракрасном спектре' }),
  },
  caliper: {
    title: 'Штангенциркуль',
    unit: 'Миллиметры (мм)',
    icon: <Gauge className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Метрология',
    seriousDesc: 'Цифровой высокоточный штангенинструмент для внешних и внутренних измерений.',
    generateValue: () => ({ value: `${(Math.random() * 150 + 5).toFixed(2)} мм`, extra: 'Погрешность нониуса не превышает ±0.01 мм' }),
  },
  micrometer: {
    title: 'Микрометр',
    unit: 'Мкм (мкм)',
    icon: <Gauge className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Метрология',
    seriousDesc: 'Измерительный прибор с микрометрической винтовой парой высокой точности.',
    generateValue: () => ({ value: `${(Math.random() * 25000 + 100).toFixed(1)} мкм`, extra: 'Калибровка трещотки винта проверена по эталону' }),
  },
  vibrometer: {
    title: 'Виброметр',
    unit: 'мм/с (СКЗ)',
    icon: <Radio className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Диагностика',
    seriousDesc: 'Прибор виброакустического контроля параметров вибрации машин и агрегатов.',
    generateValue: () => ({ value: `${(Math.random() * 28 + 0.5).toFixed(2)} мм/с`, extra: 'Зафиксирована гармоника дисбаланса ротора на частоте 50 Гц' }),
  },
  chronometer: {
    title: 'Хронометр',
    unit: 'Секунды / Мс',
    icon: <Gauge className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Временные эталоны',
    seriousDesc: 'Атомный и механический часовой прибор наивысшей стабильности хода.',
    generateValue: () => ({ value: `${new Date().toLocaleTimeString('ru-RU')}.${Math.floor(Math.random() * 900 + 100)}`, extra: 'Суточный ход отрегулирован до ±0.0001 с' }),
  },
  densitometer: {
    title: 'Денситометр',
    unit: 'Оптическая плотность (D)',
    icon: <Eye className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Оптика',
    seriousDesc: 'Измеритель оптической плотности и светопропускания прозрачных и отражающих материалов.',
    generateValue: () => ({ value: `${(Math.random() * 3.5 + 0.1).toFixed(2)} D`, extra: 'Плотность соответствует профессиональному полиграфическому стандарту' }),
  },
  multimeter: {
    title: 'Мультиметр',
    unit: 'В / А / Ом',
    icon: <Zap className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Электроника',
    seriousDesc: 'Цифровой универсальный измеритель постоянного и переменного напряжения, тока и сопротивления.',
    generateValue: () => ({ value: `U: ${(Math.random() * 230 + 10).toFixed(1)} В | I: ${(Math.random() * 15).toFixed(2)} А`, extra: 'Автоматический выбор диапазона измерений True RMS' }),
  },
  megohmmeter: {
    title: 'Мегаомметр',
    unit: 'Мегаом (МОм)',
    icon: <Zap className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Высоковольтные измерения',
    seriousDesc: 'Прибор измерения высокого сопротивления изоляции под измерительным напряжением 2500 В.',
    generateValue: () => ({ value: `${(Math.random() * 9500 + 500).toFixed(0)} МОм`, extra: 'Сопротивление изоляции линии соответствует нормам ПУЭ' }),
  },
  spectrophotometer: {
    title: 'Спектрофотометр',
    unit: 'Оптическая плотность A / нм',
    icon: <Eye className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Аналитическая химия',
    seriousDesc: 'Лабораторный прибор измерения отношения двух потоков оптического излучения.',
    generateValue: () => ({ value: `ABS: ${(Math.random() * 2.5 + 0.05).toFixed(3)} на 540 нм`, extra: 'Градуировочный график монохроматора верифицирован' }),
  },
  viscometer: {
    title: 'Вязкозиметр',
    unit: 'Па·с / сСт',
    icon: <Gauge className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Реология',
    seriousDesc: 'Измеритель динамической и кинематической вязкости жидких сред.',
    generateValue: () => ({ value: `${(Math.random() * 450 + 12).toFixed(1)} мПа·с`, extra: 'Ламинарный режим течения в капилляре подтвержден' }),
  },
  polarimeter: {
    title: 'Поляриметр',
    unit: 'Угловые градусы (°)',
    icon: <Eye className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Оптика',
    seriousDesc: 'Прибор для определения угла вращения плоскости поляризации оптически активными веществами.',
    generateValue: () => ({ value: `+${(Math.random() * 85 + 2).toFixed(2)}°`, extra: 'Удельное вращение раствора соответствует чистому сахарозному спектру' }),
  },
  goniometer: {
    title: 'Гониометр',
    unit: 'Градусы, минуты (° \')',
    icon: <Compass className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Кристаллография',
    seriousDesc: 'Прибор для точного измерения двугранных углов между гранями кристаллов и призм.',
    generateValue: () => ({ value: `${Math.floor(Math.random() * 180)}° ${Math.floor(Math.random() * 60)}'`, extra: 'Оптический лимб считывания показаний откалиброван' }),
  },
  variometer: {
    title: 'Вариометр',
    unit: 'м/с',
    icon: <Navigation className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Авиация',
    seriousDesc: 'Пилотажный прибор, показывающий скорость изменения высоты полёта летательного аппарата.',
    generateValue: () => ({ value: `${(Math.random() > 0.5 ? '+' : '-')}${(Math.random() * 15 + 0.5).toFixed(1)} м/с`, extra: 'Вертикальная скорость набора высоты стабилизирована' }),
  },
  inclinometer: {
    title: 'Инклинометр',
    unit: 'Градусы наклона (°)',
    icon: <Navigation className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Геодезия & Авиация',
    seriousDesc: 'Измеритель угла наклона элементов конструкций и скважин относительно гравитационного поля.',
    generateValue: () => ({ value: `${(Math.random() * 45).toFixed(2)}°`, extra: 'Зенитный угол скважины зарегистрирован без девиаций' }),
  },
  gravimeter: {
    title: 'Гравиметр',
    unit: 'мГал (мг) / м/с²',
    icon: <Gauge className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Гравиметрия',
    seriousDesc: 'Высокочувствительный прибор измерения ускорения свободного падения и гравитационных аномалий.',
    generateValue: () => ({ value: `980.${Math.floor(Math.random() * 890 + 100)} мГал`, extra: 'Локальная гравитационная аномалия плотности пород выявлена' }),
  },
  seismograph: {
    title: 'Сейсмограф',
    unit: 'Баллы по шкале Рихтера',
    icon: <Radio className="w-8 h-8 text-[#8f9bff]" />,
    category: 'Сейсмология',
    seriousDesc: 'Непрерывный регистратор колебаний земной коры и сейсмических волн.',
    generateValue: () => ({ value: `${(Math.random() * 4.5 + 0.8).toFixed(1)}M (Рихтер)`, extra: 'Зафиксирован микросейсмический шум P- и S-волн' }),
  },
};

interface ScientificInstrumentsToolProps {
  type: InstrumentType;
  onClose: () => void;
}

export const ScientificInstrumentsTool: React.FC<ScientificInstrumentsToolProps> = ({ type, onClose }) => {
  const cfg = INSTRUMENTS_CONFIG[type] || INSTRUMENTS_CONFIG.dosimeter;
  const [measuring, setMeasuring] = useState(false);
  const [result, setResult] = useState<{ value: string; extra: string } | null>(null);

  const handleMeasure = () => {
    soundManager.playBeep(1200, 0.1);
    setMeasuring(true);
    setResult(null);

    setTimeout(() => {
      soundManager.playBeep(1600, 0.2);
      setMeasuring(false);
      setResult(cfg.generateValue());
    }, 1200);
  };

  // Remove auto-measure on mount/change so first reading appears ONLY after user measurement
  useEffect(() => {
    setResult(null);
    setMeasuring(false);
  }, [type]);

  return (
    <ToolWrapper title={cfg.title} onClose={onClose} headerColor="bg-[#12151e] border-[#222840]">
      <div className="flex-1 flex flex-col items-center justify-between max-w-md mx-auto w-full py-4 font-sans select-none space-y-4">
        
        {/* Academic Header */}
        <div className="w-full bg-[#0f121a] border border-[#222840] p-3 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {cfg.icon}
            <div>
              <h3 className="font-extrabold text-sm text-white">{cfg.title}</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase">{cfg.category} • {cfg.unit}</p>
            </div>
          </div>
          <span className="text-[10px] bg-[#8f9bff]/20 text-[#8f9bff] px-2.5 py-1 rounded-lg border border-[#8f9bff]/40 font-mono font-bold">
            ГОСТ 8.001-2026
          </span>
        </div>

        {/* Serious Tone Instrument Screen */}
        <div className="w-full bg-[#12151e] border-2 border-[#8f9bff]/50 rounded-3xl p-5 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(143,155,255,0.15)]">
          {/* Hardware Corner Brackets */}
          <div className="absolute top-2 left-3 text-[9px] font-mono text-[#8f9bff]/60">S/N: LAB-9042-88</div>
          <div className="absolute top-2 right-3 flex items-center gap-1.5 text-[9px] font-mono text-[#8f9bff]">
            <span className={`w-2 h-2 rounded-full ${measuring ? 'bg-amber-400 animate-ping' : 'bg-[#8f9bff]'}`} />
            <span>{measuring ? 'BUSY' : 'READY'}</span>
          </div>

          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#8f9bff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
          
          {/* Dial / Scope representation */}
          <div className="w-36 h-36 rounded-full border-4 border-[#8f9bff] bg-[#222840]/30 flex flex-col items-center justify-center relative my-3 shadow-[inset_0_0_20px_rgba(143,155,255,0.2)]">
            <div className="absolute inset-2 rounded-full border border-dashed border-[#8f9bff]/40 animate-spin [animation-duration:12s]" />
            {cfg.icon}
            <span className="text-[10px] text-[#8f9bff] font-mono uppercase mt-1.5 font-black tracking-widest">
              {cfg.unit}
            </span>
          </div>

          <p className="text-[11px] text-gray-300 text-center leading-relaxed font-medium mb-3 px-2">
            {cfg.seriousDesc}
          </p>

          {/* Value Display */}
          {measuring ? (
            <div className="py-4 text-[#8f9bff] font-mono text-sm font-black animate-pulse flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>СКАНИРОВАНИЕ И ИЗМЕРЕНИЕ...</span>
            </div>
          ) : result ? (
            <div className="w-full bg-[#0f121a] border border-[#8f9bff] rounded-2xl p-3.5 text-center space-y-1 shadow-md animate-in zoom-in duration-150">
              <div className="text-xl font-black text-[#b8c0ff] font-mono tracking-wide">
                {result.value}
              </div>
              <div className="text-[10px] text-gray-300 font-bold border-t border-[#222840] pt-1 mt-1">
                {result.extra}
              </div>
            </div>
          ) : (
            <div className="py-3 text-gray-400 font-mono text-xs font-bold text-center">
              ОЖИДАНИЕ ИЗМЕРЕНИЯ... НАЖМИТЕ КНОПКУ НИЖЕ
            </div>
          )}

          {/* Telemetry Footer */}
          <div className="w-full border-t border-[#222840] mt-3 pt-2 flex items-center justify-between text-[9px] font-mono text-gray-400">
            <span>КАЛИБРОВКА: 12.2026</span>
            <span>ПОГРЕШНОСТЬ: ±0.01%</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleMeasure}
          disabled={measuring}
          className="w-full py-3.5 bg-[#8f9bff] hover:bg-[#b8c0ff] disabled:opacity-50 text-black font-extrabold text-xs uppercase rounded-2xl shadow-[0_0_15px_rgba(143,155,255,0.3)] transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
        >
          <span>{result ? 'Переснять показания' : 'Снять показания'}</span>
        </button>

      </div>
    </ToolWrapper>
  );
};
