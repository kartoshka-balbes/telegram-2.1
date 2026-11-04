import React, { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { CoolModeExplosions } from './components/CoolModeExplosions';
import { DisasterMode } from './components/DisasterMode';
import { RandomEvents } from './components/RandomEvents';
import { ToolBoundary } from './components/ToolBoundary';
import { startUsageTracking } from './utils/usageTracker';
import { startToolSession, endToolSession } from './utils/toolSession';

startUsageTracking();
import { SearchModal } from './components/SearchModal';
import { UpdatesModal } from './components/UpdatesModal';
import { SettingsModal } from './components/SettingsModal';
import { ChatView } from './components/ChatView';
import { PeopleNearbyTool } from './components/PeopleNearby';
import { StoriesBar } from './components/StoriesBar';
import { SettingsView } from './components/SettingsView';
import { SettingsDrawer } from './components/SettingsDrawer';
import { SplashScreen } from './components/SplashScreen';
import { TopStatusBar } from './components/TopStatusBar';
import { ChatBackground, ChatWallpaperType } from './components/ChatBackground';
import { ProfileDrawer } from './components/ProfileDrawer';

// Tools Imports
import { MorseTool } from './components/tools/MorseTool';
import { PaintTool } from './components/tools/PaintTool';
import { FlashlightTool } from './components/tools/FlashlightTool';
import { StoreTool } from './components/tools/StoreTool';
import { LoginCustomizerTool } from './components/tools/LoginCustomizerTool';
import { PhoneTool } from './components/tools/PhoneTool';
import { DisinfectionTool } from './components/tools/DisinfectionTool';
import { BurgerKingTool } from './components/tools/BurgerKingTool';
import { SberbankTool } from './components/tools/SberbankTool';
import { TaxiTool } from './components/tools/TaxiTool';
import { CoffeeMachineTool } from './components/tools/CoffeeMachineTool';
import { DictaphoneTool } from './components/tools/DictaphoneTool';
import { WeatherTool } from './components/tools/WeatherTool';
import { CompassTool } from './components/tools/CompassTool';
import { FanTool } from './components/tools/FanTool';
import { VpnTool } from './components/tools/VpnTool';
import { GosuslugiTool } from './components/tools/GosuslugiTool';
import { MedicalTestsTool } from './components/tools/MedicalTestsTool';
import { IptvTool } from './components/tools/IptvTool';
import { GaugesTool } from './components/tools/GaugesTool';
import { SpeedometerTool } from './components/tools/SpeedometerTool';
import { PedometerTool } from './components/tools/PedometerTool';
import { KaraokeTool } from './components/tools/KaraokeTool';
import { HealthTool } from './components/tools/HealthTool';
import { Tele2Tool } from './components/tools/Tele2Tool';
import { PharmacyTool } from './components/tools/PharmacyTool';
import { BloodPressureTool } from './components/tools/BloodPressureTool';
import { ReviewsTool } from './components/tools/ReviewsTool';
import { CalendarTool } from './components/tools/CalendarTool';
import { MirrorTool } from './components/tools/MirrorTool';
import { CalculatorTool } from './components/tools/CalculatorTool';
import { ClockTool } from './components/tools/ClockTool';
import { PuzzleTool } from './components/tools/PuzzleTool';
import { TrashTool } from './components/tools/TrashTool';
import { TranslatorTool } from './components/tools/TranslatorTool';
import { KinopoiskTool } from './components/tools/KinopoiskTool';
import { AviasalesTool } from './components/tools/AviasalesTool';
import { AntivirusTool } from './components/tools/AntivirusTool';
import { GyroscopeTool } from './components/tools/GyroscopeTool';
import { SchoolDiaryTool } from './components/tools/SchoolDiaryTool';
import { RadioTool } from './components/tools/RadioTool';
import { MicroscopeTool } from './components/tools/MicroscopeTool';
import { RotatePhoneTool } from './components/tools/RotatePhoneTool';
import { UpgradeDeviceTool } from './components/tools/UpgradeDeviceTool';
import { MicrowaveTool } from './components/tools/MicrowaveTool';
import { EducationTool } from './components/tools/EducationTool';

// New Tools Imports
import { LieDetectorTool } from './components/tools/LieDetectorTool';
import { TimeMachineTool } from './components/tools/TimeMachineTool';
import { SafeTool } from './components/tools/SafeTool';
import { ScalesTool } from './components/tools/ScalesTool';
import { ThermometerTool } from './components/tools/ThermometerTool';
import { SoundMeterTool } from './components/tools/SoundMeterTool';
import { BatteryTool } from './components/tools/BatteryTool';
import { AlarmClockTool } from './components/tools/AlarmClockTool';
import { MemoryCleanerTool } from './components/tools/MemoryCleanerTool';
import { InternetSpeedTool } from './components/tools/InternetSpeedTool';
import { NotepadTool } from './components/tools/NotepadTool';
import { WaterTrackerTool } from './components/tools/WaterTrackerTool';
import { HeaterTool } from './components/tools/HeaterTool';
import { TachometerTool } from './components/tools/TachometerTool';
import { GeigerCounterTool } from './components/tools/GeigerCounterTool';
import { EventLogTool } from './components/tools/EventLogTool';
import { RegistryEditorTool } from './components/tools/RegistryEditorTool';
import { TaskManagerTool } from './components/tools/TaskManagerTool';
import { TextEncoderTool } from './components/tools/TextEncoderTool';
import { PeriodicTableTool } from './components/tools/PeriodicTableTool';
import { MetronomeTool } from './components/tools/MetronomeTool';
import { WheelOfFortuneTool } from './components/tools/WheelOfFortuneTool';
import { LicensePlateTool } from './components/tools/LicensePlateTool';
import { MedicalRecordTool } from './components/tools/MedicalRecordTool';
import { BreathalyzerTool } from './components/tools/BreathalyzerTool';
import { VisionTestTool } from './components/tools/VisionTestTool';
import { HearingTestTool } from './components/tools/HearingTestTool';
import { GlucometerTool } from './components/tools/GlucometerTool';
import { CommandLineTool } from './components/tools/CommandLineTool';
import { EcgTool } from './components/tools/EcgTool';
import { MedicalNoteTool } from './components/tools/MedicalNoteTool';
import { BubbleLevelTool } from './components/tools/BubbleLevelTool';
import { MetalDetectorTool } from './components/tools/MetalDetectorTool';
import { AtmTool } from './components/tools/AtmTool';
import { TaximeterTool } from './components/tools/TaximeterTool';
import { GasStationTool } from './components/tools/GasStationTool';
import { WaterMeterTool } from './components/tools/WaterMeterTool';
import { ElectricityMeterTool } from './components/tools/ElectricityMeterTool';
import { CameraTool } from './components/tools/CameraTool';
import { AlarmTool } from './components/tools/AlarmTool';
import { SmokeDetectorTool } from './components/tools/SmokeDetectorTool';
import { CurrencyConverterTool } from './components/tools/CurrencyConverterTool';
import { SeismometerTool } from './components/tools/SeismometerTool';
import { BarcodeScannerTool } from './components/tools/BarcodeScannerTool';

// Expanded Tools Set 2
import { VtbBankTool } from './components/tools/VtbBankTool';
import { TBankTool } from './components/tools/TBankTool';
import { AlfaBankTool } from './components/tools/AlfaBankTool';
import { GazpromBankTool } from './components/tools/GazpromBankTool';
import { CaptchaTool } from './components/tools/CaptchaTool';
import { NavigatorTool } from './components/tools/NavigatorTool';
import { MusicPlayerTool } from './components/tools/MusicPlayerTool';
import { CourtTool } from './components/tools/CourtTool';
import { AvitoTool } from './components/tools/AvitoTool';
import { DromTool } from './components/tools/DromTool';
import { EdadealTool } from './components/tools/EdadealTool';
import { YouTubeTool } from './components/tools/YouTubeTool';
import { TomographyTool } from './components/tools/TomographyTool';
import { MusicMakerTool } from './components/tools/MusicMakerTool';
import { MailTool } from './components/tools/MailTool';
import { ChatGPTTool } from './components/tools/ChatGPTTool';
import { YandexAliceTool } from './components/tools/YandexAliceTool';
import { HoroscopeTool } from './components/tools/HoroscopeTool';
import { CloudGamingTool } from './components/tools/CloudGamingTool';
import { PokemonSearchTool } from './components/tools/PokemonSearchTool';
import { TaxTool } from './components/tools/TaxTool';
import { WhereAreMyKidsTool } from './components/tools/WhereAreMyKidsTool';
import { SolitaireTool } from './components/tools/SolitaireTool';
import { ChessTool } from './components/tools/ChessTool';
import { CheckersTool } from './components/tools/CheckersTool';
import { BackgammonTool } from './components/tools/BackgammonTool';
import { TrainTicketsTool } from './components/tools/TrainTicketsTool';
import { FoodDeliveryTool } from './components/tools/FoodDeliveryTool';
import { BooksTool } from './components/tools/BooksTool';
import { DuolingoTool } from './components/tools/DuolingoTool';
import { FpsBoosterTool } from './components/tools/FpsBoosterTool';

// 33 New Requested Tools
import { MultiplicationTableTool } from './components/tools/MultiplicationTableTool';
import { AirConditionerTool } from './components/tools/AirConditionerTool';
import { LuxmeterTool } from './components/tools/LuxmeterTool';
import { CarsharingTool } from './components/tools/CarsharingTool';
import { ScooterRentalTool } from './components/tools/ScooterRentalTool';
import { JobSearchTool } from './components/tools/JobSearchTool';
import { PdfScannerTool } from './components/tools/PdfScannerTool';
import { PowerPointTool } from './components/tools/PowerPointTool';
import { ExcelTool } from './components/tools/ExcelTool';
import { WordTool } from './components/tools/WordTool';
import { ApartmentDesignTool } from './components/tools/ApartmentDesignTool';
import { ApartmentSearchTool } from './components/tools/ApartmentSearchTool';
import { CalorieCounterTool } from './components/tools/CalorieCounterTool';
import { HomeWorkoutsTool } from './components/tools/HomeWorkoutsTool';
import { YogaTool } from './components/tools/YogaTool';
import { WeightLossTool } from './components/tools/WeightLossTool';
import { ChatrouletteTool } from './components/tools/ChatrouletteTool';
import { GasStationsNearbyTool } from './components/tools/GasStationsNearbyTool';
import { MetroMapTool } from './components/tools/MetroMapTool';
import { BusScheduleTool } from './components/tools/BusScheduleTool';
import { ConstellationMapTool } from './components/tools/ConstellationMapTool';
import { EventPosterTool } from './components/tools/EventPosterTool';
import { ExpenseTrackerTool } from './components/tools/ExpenseTrackerTool';
import { VaccineCalendarTool } from './components/tools/VaccineCalendarTool';
import { BikeMapTool } from './components/tools/BikeMapTool';
import { ParkingNearbyTool } from './components/tools/ParkingNearbyTool';
import { SpellCheckerTool } from './components/tools/SpellCheckerTool';
import { EvChargingTool } from './components/tools/EvChargingTool';
import { LottoTool } from './components/tools/LottoTool';
import { InternationalPassportTool } from './components/tools/InternationalPassportTool';
import { PassportImproveTool } from './components/tools/PassportImproveTool';
import { LotteryTool } from './components/tools/LotteryTool';
import { SportsBettingTool } from './components/tools/SportsBettingTool';

import { CryptoInvestmentsTool } from './components/tools/CryptoInvestmentsTool';
import { CreditCalculatorTool } from './components/tools/CreditCalculatorTool';
import { RecipesTool } from './components/tools/RecipesTool';
import { TableBookingTool } from './components/tools/TableBookingTool';
import { PeriodTrackerTool } from './components/tools/PeriodTrackerTool';
import { MedicationReminderTool } from './components/tools/MedicationReminderTool';
import { GibddFinesTool } from './components/tools/GibddFinesTool';
import { PddExamTool } from './components/tools/PddExamTool';
import { FlashcardsTool } from './components/tools/FlashcardsTool';
import { NvidiaControlPanelTool } from './components/tools/NvidiaControlPanelTool';
import { ElectricityBillingTool } from './components/tools/ElectricityBillingTool';
import { GasBillingTool } from './components/tools/GasBillingTool';
import { NewsTool } from './components/tools/NewsTool';
import { MeditationTool } from './components/tools/MeditationTool';
import { ScientificInstrumentsTool, InstrumentType } from './components/tools/ScientificInstrumentsTool';
import { LinguisticParsersTool, LinguisticMode } from './components/tools/LinguisticParsersTool';
import { HomeAppliancesGadgetsTool, GadgetType } from './components/tools/HomeAppliancesGadgetsTool';
import { WindowsEmulatorTool } from './components/tools/WindowsEmulatorTool';
import { Game2048Tool } from './components/tools/Game2048Tool';
import { PoliceBulletinTool } from './components/tools/PoliceBulletinTool';
import { GamesOnlineTool } from './components/tools/GamesOnlineTool';

import { ChatItem, MessageItem, UserProfile, QualityLevel, FontFamilyType } from './types';
import { INITIAL_CHATS } from './data/mockData';
import { soundManager, triggerHaptic } from './utils/soundEffects';
import { MessageSquare, Wrench, Settings, Search, Star, Pin, Plus, CheckCheck, Sparkles, LayoutGrid, Check, Send, Edit3, Flame, Bell, ShieldCheck, Zap, X, UserPlus, Radio, Bot, Shield, ArrowUpRight } from 'lucide-react';

const SERIOUS_NOTIFICATIONS = [
  'Системная проверка: Все службы функционируют штатно.',
  'Служба безопасности: Защищённый канал передачи данных активен.',
  'Сервер обновлений: Проверка целостности системы завершена.',
  'Безопасность: Новых внешних подключений не зарегистрировано.',
  'Системный журнал: Синхронизация базы данных успешно проведена.',
  'Сеть: Уровень сигнала стабилен, потерь пакетов нет.',
  'Криптография: TLS-сертификат подтвержден, шифрование сквозное (E2EE).',
  'Управление памятью: Сборщик мусора освободил неиспользуемые страницы.',
  'Резервное копирование: Локальный снимок состояния синхронизирован.',
  'Служба аутентификации: Сессионные токены валидны.',
  'Мониторинг ресурсов: Загрузка центрального процессора в пределах нормы.',
  'Сетевой стек: DNS-запросы перенаправлены через защищенный шлюз.',
  'Файловая система: Ошибок дискового пространства не обнаружено.',
  'Брандмауэр: Входящие пакеты соответствуют установленным правилам.',
  'Служба времени: Синхронизация по протоколу NTP выполнена с точностью 0.2мс.',
  'Телеметрия: Аномалий в журнале событий не зафиксировано.',
  'Контроль доступа: Права суперпользователя подтверждены.',
  'Модуль оптимизации: Индексы таблиц перестроены без сбоев.',
  'Служба оповещений: Очередь событий пуста, все задачи доставлены.',
  'Контрольная сумма: Хэш-сумма системных библиотек SHA-256 проверена.',
  'Питание: Уровень заряда аккумулятора достаточен для фоновых задач.',
  'Интерфейс ввода: Сенсорные события обрабатываются с минимальной задержкой.',
];

const SPAM_NOTIFICATIONS_POOL = [
  { title: 'ВНИМАНИЕ', icon: '🚨', text: 'Обнаружен неопознанный сигнал из розетки!', color: 'border-red-500 bg-red-950/90 text-red-200' },
  { title: 'СБЕРБАНК', icon: '💳', text: 'Зачисление пенсии: +999 999 999 ₽', color: 'border-emerald-500 bg-emerald-950/90 text-emerald-200' },
  { title: 'ГОСУСЛУГИ', icon: '🏛️', text: 'Вам назначен штраф за слишком красивую аватарку!', color: 'border-blue-500 bg-blue-950/90 text-blue-200' },
  { title: 'ТЕЛЕГРАМ', icon: '💬', text: 'Павел Дуров отправил вам сообщение: «Верни стену!»', color: 'border-cyan-400 bg-cyan-950/90 text-cyan-200' },
  { title: 'ВИРУС', icon: '👾', text: 'Троянский конь съел ваши файлы и просит добавки', color: 'border-purple-500 bg-purple-950/90 text-purple-200' },
  { title: 'ДОСТАВКА', icon: '🍕', text: 'Курьер с горячей шаурмой уже на ракете!', color: 'border-orange-500 bg-orange-950/90 text-orange-200' },
  { title: 'КЭШ ПЕРЕПОЛНЕН', icon: '⚠️', text: 'Память устройства забита огурцами (99.9%)', color: 'border-amber-400 bg-amber-950/90 text-amber-200' },
  { title: 'ЯНДЕКС ТАКСИ', icon: '🚕', text: 'Такси бизнес-класса на самокате ожидает в подъезде', color: 'border-yellow-400 bg-yellow-950/90 text-yellow-200' },
  { title: 'МАГАЗИН', icon: '🛒', text: 'Все товары распроданы! Скидка 146%', color: 'border-pink-500 bg-pink-950/90 text-pink-200' },
  { title: 'БАБУШКА', icon: '👵', text: 'Ты покушал? Одень шапку в чате!', color: 'border-emerald-400 bg-emerald-950/90 text-emerald-200' },
  { title: 'СИСТЕМА', icon: '⚡', text: 'Ядро процессора разогрелось до 400°C', color: 'border-red-600 bg-red-950/90 text-red-200' },
  { title: 'НЛО', icon: '🛸', text: 'Связь со спутником установлена через утюг', color: 'border-teal-400 bg-teal-950/90 text-teal-200' },
  { title: 'БУРГЕР КИНГ', icon: '🍔', text: 'Корона победителя ждёт вас на кассе!', color: 'border-red-400 bg-red-950/90 text-red-200' },
  { title: 'АВИТО', icon: '📦', text: 'Ваш лот «Продам воздух в банке» просмотрели 5000 раз', color: 'border-blue-400 bg-blue-950/90 text-blue-200' },
  { title: 'БЕЗОПАСНОСТЬ', icon: '🛡️', text: 'Антивирус подружился с вирусом и играет в карты', color: 'border-indigo-400 bg-indigo-950/90 text-indigo-200' },
];

export interface ScreenNotification {
  id: string;
  title: string;
  text: string;
  icon: string;
  color?: string;
  x?: number;
  y?: number;
  rot?: number;
  zIndex?: number;
}

import { ShortVideosTool } from './components/tools/ShortVideosTool';
import { TelescopeTool } from './components/tools/TelescopeTool';
import { PsychologicalHelpTool } from './components/tools/PsychologicalHelpTool';
import { SupportTool } from './components/tools/SupportTool';
import { BrowserTool } from './components/tools/BrowserTool';
import { CrateOpeningTool } from './components/tools/CrateOpeningTool';
import { TrigonometricCircleTool } from './components/tools/TrigonometricCircleTool';
import { BsodScreen } from './components/BsodScreen';
import { DEFAULT_LOGIN_CUSTOMIZATION, LoginCustomizationData } from './components/LoginScreen';
import { AppTheme } from './types';

const DYNAMIC_CREATORS = [
  {
    name: 'Ольга Сковородкина',
    avatar: '👵',
    messages: ['Засолила 40 банок огурцов на зиму! 🥒']
  },
  {
    name: 'Мошенник',
    avatar: '🥷',
    messages: ['Вам зачислено 500 000 рублей! Перейдите по ссылке!']
  },
  {
    name: 'Туалетный монстр',
    avatar: '👾',
    messages: ['Бу-га-га, я прячусь под раковиной!']
  },
  {
    name: 'Пиво',
    avatar: '🍺',
    messages: ['Свежее и холодное!']
  },
  {
    name: 'Какой-то мужик',
    avatar: '🧔',
    messages: ['Здорово, братуха! Какими судьбами?']
  },
  {
    name: 'Разработчик',
    avatar: '💻',
    messages: ['Новый релиз готов к задеплою!']
  },
  {
    name: 'Дональд Трамп',
    avatar: '🇺🇸',
    messages: ['MAKE CHAT GREAT AGAIN!']
  },
  {
    name: 'Лёня Воронин',
    avatar: '📺',
    messages: ['Египетская сила!']
  },
  {
    name: 'Коля Какашкин',
    avatar: '💩',
    messages: ['Привет от Коли!']
  },
  {
    name: 'Дима Бездарев',
    avatar: '🤡',
    messages: ['Я тут рядом стою!']
  },
  {
    name: 'Уинстон Черчилль',
    avatar: '🎩',
    messages: ['Never give up on your dreams.']
  },
  {
    name: 'Олег Сталин',
    avatar: '🚩',
    messages: ['Пятилетку за три года!']
  },
  {
    name: 'Монгольский завоеватель',
    avatar: '🐎',
    messages: ['Вперед на коннице!']
  },
  {
    name: 'Местный шпион',
    avatar: '🕵️',
    messages: ['Объект находится под наблюдением...']
  },
  {
    name: 'Яндекс Алиса',
    avatar: '🟣',
    messages: ['Чем я могу вам помочь сегодня?']
  },
  {
    name: 'Женя Бравлстарсов',
    avatar: '🎮',
    messages: ['Погнали катку в Бравл Старс!']
  },
  {
    name: 'Костя Дудункин',
    avatar: '🎺',
    messages: ['Ду-ду-ду в трубу!']
  },
  {
    name: 'Оксана Валедолова',
    avatar: '💊',
    messages: ['Примите 20 капель валидола!']
  },
  {
    name: 'Галина Ассенизаторовна',
    avatar: '🚜',
    messages: ['Выезжаю на тракторе!']
  },
];

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [coolMode, setCoolMode] = useState(false);
  const [yearOffset, setYearOffset] = useState(0);

  // Screen Brightness state with instant live feedback
  const [screenBrightness, setScreenBrightness] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('app_screen_brightness');
      if (saved) {
        const val = parseFloat(saved);
        if (!isNaN(val) && val >= 0.2 && val <= 1) return val;
      }
    } catch {}
    return 1;
  });

  useEffect(() => {
    const handleBright = (e: Event) => {
      const custom = e as CustomEvent<number>;
      if (custom.detail !== undefined) setScreenBrightness(custom.detail);
    };
    window.addEventListener('brightness_changed', handleBright);
    return () => window.removeEventListener('brightness_changed', handleBright);
  }, []);

  // Modals state
  const [showSearch, setShowSearch] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  // Active Tool & Active Chat state
  const [activeTool, setActiveTool] = useState<string | null>(null);

  // После закрытия приложения его таймеры и звуки полностью останавливаются
  React.useLayoutEffect(() => {
    if (!activeTool) return;
    startToolSession();
    return () => endToolSession();
  }, [activeTool]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Navigation tab ('chats' | 'tools' | 'settings')
  const [activeTab, setActiveTab] = useState<'chats' | 'tools' | 'settings'>('chats');
  const [searchQuery, setSearchQuery] = useState('');

  // Swipe gesture handling state
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const diffX = touchStartX - e.changedTouches[0].clientX;
    const diffY = touchStartY - e.changedTouches[0].clientY;

    // Check if horizontal swipe is intentional and distinct
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.3) {
      if (diffX > 0) {
        // Swiped Left -> Move forward
        if (activeTab === 'chats') {
          triggerHaptic('tap');
          soundManager.playBeep(850, 0.04);
          setActiveTab('tools');
        } else if (activeTab === 'tools') {
          triggerHaptic('tap');
          soundManager.playBeep(850, 0.04);
          setActiveTab('settings');
        }
      } else {
        // Swiped Right -> Move backward
        if (activeTab === 'settings') {
          triggerHaptic('tap');
          soundManager.playBeep(850, 0.04);
          setActiveTab('tools');
        } else if (activeTab === 'tools') {
          triggerHaptic('tap');
          soundManager.playBeep(850, 0.04);
          setActiveTab('chats');
        }
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
  };

  // Splash screen state
  const [showSplashScreen, setShowSplashScreen] = useState(false);

  // Settings & App Mode state
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [fontFamily, setFontFamily] = useState<FontFamilyType>('sans');
  const [theme, setTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('app_theme') as AppTheme) || 'telegram_dark';
  });
  const [accentColor, setAccentColor] = useState<string>(() => {
    return localStorage.getItem('app_accent_color') || '#8f9bff';
  });
  const [loginCustomization, setLoginCustomization] = useState<LoginCustomizationData>(() => {
    try {
      const saved = localStorage.getItem('app_login_customization');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_LOGIN_CUSTOMIZATION;
  });
  const [isBsodActive, setIsBsodActive] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationFrequency, setNotificationFrequency] = useState<'rare' | 'frequent'>('rare');
  const [activeNotifications, setActiveNotifications] = useState<ScreenNotification[]>([]);
  const [quality, setQuality] = useState<QualityLevel>('1080p');
  const [vrMode, setVrMode] = useState(false);
  const [cinemaMode, setCinemaMode] = useState(false);
  const [powerSavingMode, setPowerSavingMode] = useState(false);
  const [sendSoundEnabled, setSendSoundEnabled] = useState(true);
  const [chatWallpaper, setChatWallpaper] = useState<ChatWallpaperType>('cyber_emerald');
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  const handleToggleVrMode = () => {
    setVrMode((prev) => {
      const next = !prev;
      if (next) setCinemaMode(false); // Mutually exclusive
      return next;
    });
  };

  const handleToggleCinemaMode = () => {
    setCinemaMode((prev) => {
      const next = !prev;
      if (next) setVrMode(false); // Mutually exclusive
      return next;
    });
  };

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Пользователь',
    phoneNumber: '+7 (999) 000-00-00',
    status: '',
    avatar: '🐵',
    music: '',
    description: '',
    about: '',
  });

  // Blocked users & Friends
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);

  // Drafts per chat
  const [drafts, setDrafts] = useState<{ [chatId: string]: string }>({});

  // Chat Folders
  const [activeFolder, setActiveFolder] = useState<string>('Все');
  const [folders, setFolders] = useState<string[]>(['Все', 'Личные', 'Группы', 'Избранное', 'Заблокированные']);

  // Tools Category Filter
  const [selectedToolCategory, setSelectedToolCategory] = useState<string>('Все');

  // Chats Data
  const [chats, setChats] = useState<ChatItem[]>(INITIAL_CHATS);

  // Favorites Chat "Печатает..." Feature (60% chance for 2-7 seconds)
  const [favTyping, setFavTyping] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.60) {
        setFavTyping(true);
        const typingDuration = Math.floor(Math.random() * 5000) + 2000; // 2 to 7 seconds
        setTimeout(() => {
          setFavTyping(false);
        }, typingDuration);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Dynamic Chat Spawning System (Every 2-3 minutes, 33% chance to create a new chat from available creator)
  useEffect(() => {
    const spawnTimer = setInterval(() => {
      if (Math.random() < 0.33) {
        setChats((currentChats) => {
          const existingNames = new Set(currentChats.map((c) => c.name));
          const available = DYNAMIC_CREATORS.filter((creator) => !existingNames.has(creator.name));

          if (available.length === 0) return currentChats;

          const chosen = available[Math.floor(Math.random() * available.length)];
          const newChat: ChatItem = {
            id: `spawn-${Date.now()}`,
            name: chosen.name,
            avatar: chosen.avatar,
            status: 'В сети',
            lastMessage: chosen.messages[0],
            lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            messages: chosen.messages.map((txt, idx) => ({
              id: `m-${idx}`,
              text: txt,
              sender: 'other',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            })),
          };

          return [newChat, ...currentChats];
        });
      }
    }, Math.floor(Math.random() * 60000) + 120000); // 2 to 3 minutes

    return () => clearInterval(spawnTimer);
  }, []);

  useEffect(() => {
    const handleOpenTool = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setActiveTool(customEvent.detail);
      }
    };
    window.addEventListener('open_tool', handleOpenTool);
    return () => window.removeEventListener('open_tool', handleOpenTool);
  }, []);

  // Periodic Notifications System (Frequent = every 0.4 seconds layered over entire screen; Rare = standard gentle interval)
  useEffect(() => {
    if (!notificationsEnabled) return;

    let nextZIndex = 100;

    const triggerNotification = () => {
      if (notificationFrequency === 'frequent') {
        const item = SPAM_NOTIFICATIONS_POOL[Math.floor(Math.random() * SPAM_NOTIFICATIONS_POOL.length)];
        const newNotif: ScreenNotification = {
          id: `${Date.now()}-${Math.random()}`,
          title: item.title,
          text: item.text,
          icon: item.icon,
          color: item.color,
          x: Math.floor(Math.random() * 65) + 2, // 2% to 67%
          y: Math.floor(Math.random() * 75) + 4, // 4% to 79%
          rot: Math.floor(Math.random() * 24) - 12,
          zIndex: nextZIndex++,
        };

        setActiveNotifications((prev) => [...prev.slice(-70), newNotif]);
        soundManager.playBeep(900 + Math.random() * 600, 0.04);
      } else {
        const randMsg = SERIOUS_NOTIFICATIONS[Math.floor(Math.random() * SERIOUS_NOTIFICATIONS.length)];
        const newNotif: ScreenNotification = {
          id: `${Date.now()}-${Math.random()}`,
          title: 'Уведомление',
          text: randMsg,
          icon: '🔔',
          color: 'border-[#8f9bff]/60 bg-[#0f121a]/95 text-white',
        };
        setActiveNotifications((prev) => [newNotif, ...prev.slice(0, 3)]);
        soundManager.playBeep(1200, 0.08);
      }
    };

    if (notificationFrequency === 'frequent') {
      triggerNotification();
      const intervalId = setInterval(triggerNotification, 400); // exactly 0.4 seconds (400ms)!
      return () => clearInterval(intervalId);
    } else {
      const initialDelayTimer = setTimeout(() => {
        triggerNotification();
        const intervalId = setInterval(triggerNotification, 120000); // 120 sec (2 min) in rare mode
        return () => clearInterval(intervalId);
      }, 5000);
      return () => clearTimeout(initialDelayTimer);
    }
  }, [notificationsEnabled, notificationFrequency]);

  const handleSendMessage = (chatId: string, msg: Partial<MessageItem>) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) {
          const newMsg: MessageItem = {
            id: Date.now().toString(),
            text: msg.text || '',
            sender: msg.sender || 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            replyToId: msg.replyToId,
            replyToText: msg.replyToText,
            type: msg.type || 'text',
            locationName: msg.locationName,
            locationCoords: msg.locationCoords,
            duration: msg.duration,
          };
          return {
            ...c,
            lastMessage: newMsg.text,
            lastMessageTime: newMsg.time,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );
  };

  const handleEditMessage = (chatId: string, messageId: string, newText: string) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) {
          return {
            ...c,
            messages: c.messages.map((m) =>
              m.id === messageId ? { ...m, text: newText, isEdited: true } : m
            ),
          };
        }
        return c;
      })
    );
  };

  const handleDeleteMessage = (chatId: string, messageId: string) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) {
          return {
            ...c,
            messages: c.messages.filter((m) => m.id !== messageId),
          };
        }
        return c;
      })
    );
  };

  const handlePinMessage = (chatId: string, messageId: string | undefined) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, pinnedMessageId: messageId } : c))
    );
  };

  const handleToggleReaction = (chatId: string, messageId: string, emoji: string) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) {
          return {
            ...c,
            messages: c.messages.map((m) => {
              if (m.id === messageId) {
                const current = m.reactions || {};
                const count = (current[emoji] || 0) + 1;
                return {
                  ...m,
                  reactions: { ...current, [emoji]: count },
                };
              }
              return m;
            }),
          };
        }
        return c;
      })
    );
  };

  const handleForwardMessage = (targetChatId: string, text: string) => {
    handleSendMessage(targetChatId, { text, sender: 'user' });
  };

  const handleBlockUser = (userName: string) => {
    if (!blockedUsers.includes(userName)) {
      setBlockedUsers((prev) => [...prev, userName]);
      soundManager.playSiren();
    }
  };

  const handleAddFriend = (userName: string) => {
    soundManager.playBeep(1100, 0.1);
    setChats((prev) =>
      prev.map((c) => (c.name === userName ? { ...c, isFriend: true } : c))
    );
  };

  const handleBroadcastTrash = (fileName: string) => {
    const broadcastText = `⚠️ СИСТЕМНОЕ УВЕДОМЛЕНИЕ: Вы успешно уничтожили файл "${fileName}" в корзине!`;

    setChats((prev) =>
      prev.map((c) => {
        const bMsg: MessageItem = {
          id: Date.now().toString(),
          text: broadcastText,
          sender: 'system',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isBroadcast: true,
        };
        return {
          ...c,
          lastMessage: broadcastText,
          lastMessageTime: bMsg.time,
          messages: [...c.messages, bMsg],
        };
      })
    );
  };

  const handleCreateGroup = () => {
    const name = prompt('Введите название новой группы:');
    if (!name || !name.trim()) return;
    const groupName = name.trim();
    const newGroup: ChatItem = {
      id: Date.now().toString(),
      name: groupName,
      avatar: '👥',
      status: 'Группа • 1 участник',
      lastMessage: 'Группа создана',
      lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isGroup: true,
      messages: [
        {
          id: 'init-1',
          text: `Группа "${groupName}" успешно создана!`,
          sender: 'system',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };
    setChats((prev) => [newGroup, ...prev]);
    setActiveChatId(newGroup.id);
  };

  const handleSelectPersonNearby = (name: string, avatar: string) => {
    const existing = chats.find((c) => c.name === name);
    if (existing) {
      setActiveChatId(existing.id);
    } else {
      const newChat: ChatItem = {
        id: Date.now().toString(),
        name,
        avatar,
        status: 'Рядом в радиусе 100м',
        lastMessage: 'Здравствуйте!',
        lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        messages: [
          {
            id: '1',
            text: `Привет! Я ${name}, заметил тебя рядом в локаторе.`,
            sender: 'other',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      };
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChat.id);
    }
  };

  if (showSplashScreen) {
    return <SplashScreen onFinish={() => setShowSplashScreen(false)} />;
  }

  if (!isLoggedIn) {
    return (
      <LoginScreen
        customization={loginCustomization}
        onLoginSuccess={(username) => {
          if (username) {
            setUserProfile((prev) => ({ ...prev, name: username }));
          }
          setIsLoggedIn(true);
        }}
        onLogin={(username) => {
          if (username) {
            setUserProfile((prev) => ({ ...prev, name: username }));
          }
          setIsLoggedIn(true);
        }}
      />
    );
  }

  const activeChat = chats.find((c) => c.id === activeChatId);

  // Tools configuration array
  const ALL_TOOLS = [
    { id: 'games_online', name: 'Игры', icon: '🎮', category: 'Игры' },
    { id: 'browser', name: 'Браузер', icon: '🌐', category: 'Сеть' },
    { id: 'crate_opening', name: 'Открытие ящиков', icon: '📦', category: 'Игры' },
    { id: 'short_videos', name: 'Короткие видео', icon: '🎬', category: 'Медиа' },
    { id: 'puzzle', name: 'Пазлы', icon: '🧩', category: 'Игры' },
    { id: 'people_nearby', name: 'Люди рядом', icon: '📍', category: 'Связь' },
    { id: 'morse', name: 'Морзянка', icon: '📡', category: 'Связь' },
    { id: 'paint', name: 'Рисование', icon: '🎨', category: 'Творчество' },
    { id: 'mirror', name: 'Зеркало', icon: '🪞', category: 'Быт' },
    { id: 'flashlight', name: 'Фонарик', icon: '🔦', category: 'Утилиты' },
    { id: 'store', name: 'Магазин', icon: '🛒', category: 'Сервисы' },
    { id: 'phone', name: 'Телефон', icon: '📞', category: 'Связь' },
    { id: 'microscope', name: 'Микроскоп', icon: '🔬', category: 'Наука' },
    { id: 'telescope', name: 'Телескоп', icon: '🔭', category: 'Космос' },
    { id: 'disinfection', name: 'ДезИнфекция', icon: '🧼', category: 'Безопасность' },
    { id: 'burger_king', name: 'Бургер Кинг', icon: '🍔', category: 'Еда' },
    { id: 'sberbank', name: 'Сбербанк', icon: '💳', category: 'Финансы' },
    { id: 'taxi', name: 'Такси', icon: '🚖', category: 'Транспорт' },
    { id: 'coffee', name: 'Кофемашина', icon: '☕', category: 'Еда' },
    { id: 'dictaphone', name: 'Диктофон', icon: '🎙️', category: 'Утилиты' },
    { id: 'weather', name: 'Погода', icon: '🌤️', category: 'Инфо' },
    { id: 'compass', name: 'Компас', icon: '🧭', category: 'Навигация' },
    { id: 'fan', name: 'Вентилятор', icon: '🌀', category: 'Быт' },
    { id: 'vpn', name: 'VPN', icon: '🛡️', category: 'Сеть' },
    { id: 'gosuslugi', name: 'Госуслуги', icon: '🏛️', category: 'Госсервис' },
    { id: 'medical_tests', name: 'Анализы', icon: '🔬', category: 'Медицина' },
    { id: 'iptv', name: 'IPTV Плеер', icon: '📺', category: 'Медиа' },
    { id: 'barometer', name: 'Барометр', icon: '🌡️', category: 'Приборы' },
    { id: 'ammeter', name: 'Амперметр', icon: '⚡', category: 'Приборы' },
    { id: 'voltmeter', name: 'Вольтметр', icon: '🔋', category: 'Приборы' },
    { id: 'speedometer', name: 'Спидометр', icon: '🏎️', category: 'Приборы' },
    { id: 'pedometer', name: 'Шагомер', icon: '👟', category: 'Здоровье' },
    { id: 'karaoke', name: 'Караоке', icon: '🎤', category: 'Развлечения' },
    { id: 'health', name: 'Здоровье', icon: '❤️', category: 'Здоровье' },
    { id: 'tele2', name: 'Теле2', icon: '📱', category: 'Связь' },
    { id: 'pharmacy', name: 'Аптека', icon: '💊', category: 'Медицина' },
    { id: 'blood_pressure', name: 'Давление', icon: '🩺', category: 'Медицина' },
    { id: 'reviews', name: 'Отзывы', icon: '⭐', category: 'Сообщество' },
    { id: 'calendar', name: 'Календарь 2013', icon: '📅', category: 'Органайзер' },
    { id: 'calculator', name: 'Калькулятор', icon: '🧮', category: 'Утилиты' },
    { id: 'clock', name: 'Часы', icon: '⏰', category: 'Органайзер' },
    { id: 'trash', name: 'Мусорка', icon: '🗑️', category: 'Система' },
    { id: 'translator', name: 'Переводчик', icon: '🗣️', category: 'Утилиты' },
    { id: 'kinopoisk', name: 'Кинопоиск', icon: '🎬', category: 'Медиа' },
    { id: 'aviasales', name: 'Авиасейлс', icon: '✈️', category: 'Путешествия' },
    { id: 'antivirus', name: 'Антивирус', icon: '🛡️', category: 'Безопасность' },
    { id: 'gyroscope', name: 'Гироскоп', icon: '📐', category: 'Приборы' },
    { id: 'diary', name: 'Эл. Дневник', icon: '📚', category: 'Обучение' },
    { id: 'radio', name: 'Радио', icon: '📻', category: 'Медиа' },
    { id: 'psychological_help', name: 'Психологическая помощь', icon: '🧠', category: 'Здоровье' },
    { id: 'support', name: 'Поддержка', icon: '📩', category: 'Сервисы' },
    { id: 'rotate_phone', name: 'Поверните телефон', icon: '🔄', category: 'Инструкции' },
    { id: 'upgrade_device', name: 'Улучшить устройство', icon: '⚡', category: 'Разгон' },
    { id: 'microwave', name: 'Микроволновка', icon: '📦', category: 'Быт' },
    { id: 'education', name: 'Образование', icon: '🎓', category: 'Обучение' },
    { id: 'lie_detector', name: 'Детектор лжи', icon: '🕵️', category: 'Проверка' },
    { id: 'time_machine', name: 'Машина времени', icon: '⏰', category: 'Время' },
    { id: 'safe', name: 'Сейф', icon: '🔒', category: 'Безопасность' },
    { id: 'scales', name: 'Весы', icon: '⚖️', category: 'Приборы' },
    { id: 'thermometer', name: 'Термометр', icon: '🌡️', category: 'Приборы' },
    { id: 'sound_meter', name: 'Шумомер', icon: '🔊', category: 'Приборы' },
    { id: 'battery', name: 'Батарея', icon: '🔋', category: 'Питание' },
    { id: 'alarm_clock', name: 'Будильник', icon: '🔔', category: 'Органайзер' },
    { id: 'memory_cleaner', name: 'Очистка памяти', icon: '🧹', category: 'Система' },
    { id: 'internet', name: 'Интернет', icon: '🌐', category: 'Сеть' },
    { id: 'notepad', name: 'Блокнот', icon: '📝', category: 'Заметки' },
    { id: 'water_tracker', name: 'Трекер воды', icon: '💧', category: 'Здоровье' },
    { id: 'heater', name: 'Обогреватель', icon: '🔥', category: 'Быт' },
    { id: 'tachometer', name: 'Тахометр', icon: '🏎️', category: 'Приборы' },
    { id: 'geiger', name: 'Счётчик Гейгера', icon: '☢️', category: 'Приборы' },
    { id: 'event_log', name: 'Журнал событий', icon: '📜', category: 'Система' },
    { id: 'registry_editor', name: 'Редактор реестра', icon: '💻', category: 'Система' },
    { id: 'task_manager', name: 'Диспетчер задач', icon: '📊', category: 'Система' },
    { id: 'text_encoder', name: 'Кодировщик', icon: '🔐', category: 'Утилиты' },
    { id: 'periodic_table', name: 'Таблица Менделеева', icon: '🧪', category: 'Наука' },
    { id: 'metronome', name: 'Метроном', icon: '🎵', category: 'Музыка' },
    { id: 'wheel_of_fortune', name: 'Колесо фортуны', icon: '🎡', category: 'Развлечения' },
    { id: 'license_plate', name: 'Получение номеров', icon: '🚘', category: 'Сервисы' },
    { id: 'medical_record', name: 'Мед. карта', icon: '📋', category: 'Медицина' },
    { id: 'breathalyzer', name: 'Алкотестер', icon: '🍺', category: 'Приборы' },
    { id: 'vision_test', name: 'Тест на зрение', icon: '👁️', category: 'Здоровье' },
    { id: 'hearing_test', name: 'Тест на слух', icon: '👂', category: 'Здоровье' },
    { id: 'glucometer', name: 'Глюкометр', icon: '🩸', category: 'Медицина' },
    { id: 'command_line', name: 'Командная строка', icon: '⌨️', category: 'Безопасность' },
    { id: 'ecg', name: 'ЭКГ', icon: '📈', category: 'Медицина' },
    { id: 'medical_note', name: 'Справка о здоровье', icon: '📝', category: 'Медицина' },
    { id: 'bubble_level', name: 'Уровень', icon: '📐', category: 'Приборы' },
    { id: 'metal_detector', name: 'Металлодетектор', icon: '🧲', category: 'Приборы' },
    { id: 'atm', name: 'Банкомат', icon: '🏧', category: 'Финансы' },
    { id: 'taximeter', name: 'Таксометр', icon: '🚕', category: 'Сервисы' },
    { id: 'gas_station', name: 'Бензоколонка', icon: '⛽', category: 'Сервисы' },
    { id: 'water_meter', name: 'Счётчик воды', icon: '🚰', category: 'Быт' },
    { id: 'electricity_meter', name: 'Счётчик электричества', icon: '⚡', category: 'Быт' },
    { id: 'camera', name: 'Камера', icon: '📷', category: 'Утилиты' },
    { id: 'alarm', name: 'Сигнализация', icon: '🚨', category: 'Безопасность' },
    { id: 'smoke_detector', name: 'Датчик дыма', icon: '💨', category: 'Безопасность' },
    { id: 'currency_converter', name: 'Конвертер валют', icon: '🔱', category: 'Финансы' },
    { id: 'seismometer', name: 'Сейсмоприёмник', icon: '🌋', category: 'Приборы' },
    { id: 'barcode_scanner', name: 'Сканер штрих-кода', icon: '🏁', category: 'Утилиты' },

    // New Requested Tools
    { id: 'vtb', name: 'ВТБ', icon: '🏦', category: 'Финансы' },
    { id: 't_bank', name: 'Т-Банк', icon: '💳', category: 'Финансы' },
    { id: 'alfa_bank', name: 'Альфа-Банк', icon: '🔴', category: 'Финансы' },
    { id: 'gazprombank', name: 'Газпромбанк', icon: '🔹', category: 'Финансы' },
    { id: 'captcha', name: 'Капча', icon: '🦖', category: 'Защита' },
    { id: 'navigator', name: 'Навигатор', icon: '🗺️', category: 'Навигация' },
    { id: 'music_player', name: 'Музыка YT', icon: '🎵', category: 'Медиа' },
    { id: 'court', name: 'Суд', icon: '⚖️', category: 'Закон' },
    { id: 'police_bulletin', name: 'Полицейская сводка', icon: '🚨', category: 'Безопасность' },
    { id: 'avito', name: 'Авито', icon: '🛒', category: 'Маркет' },
    { id: 'drom', name: 'Дром', icon: '🚗', category: 'Маркет' },
    { id: 'edadeal', name: 'Едадил', icon: '🛒', category: 'Маркет' },
    { id: 'youtube', name: 'YouTube', icon: '▶️', category: 'Медиа' },
    { id: 'tomography', name: 'Томография', icon: '🏥', category: 'Медицина' },
    { id: 'music_maker', name: 'Создать музыку', icon: '🎹', category: 'Музыка' },
    { id: 'mail', name: 'Почта', icon: '✉️', category: 'Связь' },
    { id: 'chatgpt', name: 'ChatGPT', icon: '🤖', category: 'ИИ' },
    { id: 'yandex_alice', name: 'Яндекс Алиса', icon: '🟣', category: 'ИИ' },
    { id: 'horoscope', name: 'Гороскоп', icon: '✨', category: 'Инфо' },
    { id: 'cloud_gaming', name: 'Облачный гейминг', icon: '🎮', category: 'Игры' },
    { id: 'pokemon_search', name: 'Поиск покемонов', icon: '🔴', category: 'Игры' },
    { id: 'taxes', name: 'Налоги', icon: '💸', category: 'Госсервис' },
    { id: 'where_are_my_kids', name: 'Где мои дети', icon: '📡', category: 'Сервисы' },
    { id: 'solitaire', name: 'Пасьянс', icon: '🃏', category: 'Игры' },
    { id: 'chess', name: 'Шахматы', icon: '♟️', category: 'Игры' },
    { id: 'checkers', name: 'Шашки', icon: '🔴', category: 'Игры' },
    { id: 'backgammon', name: 'Нарды', icon: '🎲', category: 'Игры' },
    { id: 'train_tickets', name: 'Билеты на поезд', icon: '🚂', category: 'Билеты' },
    { id: 'food_delivery', name: 'Заказ еды', icon: '🍔', category: 'Еда' },
    { id: 'books', name: 'Книги', icon: '📖', category: 'Обучение' },
    { id: 'duolingo', name: 'Duolingo', icon: '🦉', category: 'Обучение' },
    { id: 'fps_booster', name: 'Повышение FPS', icon: '⚡', category: 'Разгон' },

    // 33 New Requested Tools
    { id: 'multiplication_table', name: 'Таблица умножения', icon: '✖️', category: 'Обучение' },
    { id: 'air_conditioner', name: 'Кондиционер', icon: '❄️', category: 'Быт' },
    { id: 'luxmeter', name: 'Люксометр', icon: '💡', category: 'Приборы' },
    { id: 'carsharing', name: 'Каршеринг', icon: '🚗', category: 'Транспорт' },
    { id: 'scooter_rental', name: 'Аренда самокатов', icon: '🛴', category: 'Транспорт' },
    { id: 'job_search', name: 'Поиск работы', icon: '💼', category: 'Сервисы' },
    { id: 'pdf_scanner', name: 'Сканер PDF', icon: '📄', category: 'Утилиты' },
    { id: 'powerpoint', name: 'PowerPoint', icon: '📙', category: 'Офис' },
    { id: 'excel', name: 'Excel', icon: '📊', category: 'Офис' },
    { id: 'word', name: 'Word', icon: '📘', category: 'Офис' },
    { id: 'apartment_design', name: 'Дизайн квартиры', icon: '🛋️', category: 'Быт' },
    { id: 'apartment_search', name: 'Поиск квартиры', icon: '🏢', category: 'Сервисы' },
    { id: 'calorie_counter', name: 'Счётчик калорий', icon: '🥗', category: 'Здоровье' },
    { id: 'home_workouts', name: 'Тренировки для дома', icon: '🏋️', category: 'Спорт' },
    { id: 'yoga', name: 'Йога', icon: '🧘', category: 'Здоровье' },
    { id: 'weight_loss', name: 'Худеем за 30 дней', icon: '🔥', category: 'Спорт' },
    { id: 'chatroulette', name: 'Чат-рулетка', icon: '🎥', category: 'Связь' },
    { id: 'gas_stations_nearby', name: 'Заправки рядом', icon: '⛽', category: 'Навигация' },
    { id: 'metro_map', name: 'Карта метро', icon: '🚇', category: 'Транспорт' },
    { id: 'bus_schedule', name: 'Расписание автобусов', icon: '🚌', category: 'Транспорт' },
    { id: 'constellation_map', name: 'Карта созвездий', icon: '🌌', category: 'Наука' },
    { id: 'event_poster', name: 'Афиша мероприятий', icon: '🎟️', category: 'Развлечения' },
    { id: 'expense_tracker', name: 'Трекер расходов', icon: '💰', category: 'Финансы' },
    { id: 'vaccine_calendar', name: 'Календарь прививок', icon: '💉', category: 'Медицина' },
    { id: 'bike_map', name: 'Велокарта', icon: '🚴', category: 'Транспорт' },
    { id: 'parking_nearby', name: 'Парковки рядом', icon: '🅿️', category: 'Транспорт' },
    { id: 'spell_checker', name: 'Проверка орфографии', icon: '✏️', category: 'Утилиты' },
    { id: 'ev_charging', name: 'Зарядные станции', icon: '⚡', category: 'Транспорт' },
    { id: 'lotto', name: 'Лото', icon: '🎱', category: 'Игры' },
    { id: 'international_passport', name: 'Загранпаспорт', icon: '🛂', category: 'Госсервис' },
    { id: 'passport_improve', name: 'Паспорт VIP', icon: '🪪', category: 'Госсервис' },
    { id: 'lottery', name: 'Лотерея', icon: '🎟️', category: 'Развлечения' },
    { id: 'sports_betting', name: 'Ставки на спорт', icon: '⚽', category: 'Азарт' },

    // Additional Specialized & High Precision Tools
    { id: 'crypto_investments', name: 'Инвестиции & Крипто', icon: '🪙', category: 'Финансы' },
    { id: 'credit_calculator', name: 'Калькулятор кредита', icon: '💳', category: 'Финансы' },
    { id: 'recipes', name: 'Книга рецептов', icon: '📖', category: 'Быт' },
    { id: 'table_booking', name: 'Бронирование столиков', icon: '🍷', category: 'Сервисы' },
    { id: 'period_tracker', name: 'Трекер цикла', icon: '🌸', category: 'Здоровье' },
    { id: 'medication_reminder', name: 'Напоминание лекарств', icon: '💊', category: 'Медицина' },
    { id: 'gibdd_fines', name: 'Штрафы ГИБДД', icon: '🚔', category: 'Госсервис' },
    { id: 'pdd_exam', name: 'Билеты ПДД', icon: '🚦', category: 'Обучение' },
    { id: 'flashcards', name: 'Флешкарточки', icon: '🎴', category: 'Обучение' },
    { id: 'nvidia_panel', name: 'Панель NVIDIA', icon: '🟢', category: 'Система' },
    { id: 'windows_emulator', name: 'Эмулятор Windows', icon: '🪟', category: 'Система' },
    { id: 'game_2048', name: 'Игра 2048', icon: '🔢', category: 'Игры' },
    { id: 'electricity_billing', name: 'Показания света', icon: '💡', category: 'Коммуналка' },
    { id: 'gas_billing', name: 'Показания газа', icon: '🔥', category: 'Коммуналка' },
    { id: 'news', name: 'Новости', icon: '📰', category: 'Медиа' },
    { id: 'meditation', name: 'Медитация', icon: '🧘', category: 'Здоровье' },

    // Scientific & Industrial Instruments
    { id: 'dynamometer', name: 'Динамометр', icon: '🏋️', category: 'Приборы' },
    { id: 'accelerometer', name: 'Акселерометр', icon: '📈', category: 'Приборы' },
    { id: 'pyrometer', name: 'Пирометр', icon: '🌡️', category: 'Приборы' },
    { id: 'dosimeter', name: 'Дозиметр радиации', icon: '☢️', category: 'Приборы' },
    { id: 'oscilloscope', name: 'Осциллограф', icon: '📉', category: 'Приборы' },
    { id: 'spectrometer', name: 'Спектрометр', icon: '🌈', category: 'Приборы' },
    { id: 'caliper', name: 'Штангенциркуль', icon: '📏', category: 'Приборы' },
    { id: 'micrometer', name: 'Микрометр', icon: '📐', category: 'Приборы' },
    { id: 'vibrometer', name: 'Виброметр', icon: '📳', category: 'Приборы' },
    { id: 'gas_analyzer', name: 'Газоанализатор', icon: '🧪', category: 'Приборы' },
    { id: 'anemometer', name: 'Анемометр ветра', icon: '💨', category: 'Приборы' },
    { id: 'chronometer', name: 'Хронометр', icon: '⏱️', category: 'Приборы' },
    { id: 'manometer', name: 'Манометр давления', icon: '🔘', category: 'Приборы' },
    { id: 'refractometer', name: 'Рефрактометр', icon: '💎', category: 'Приборы' },
    { id: 'densitometer', name: 'Денситометр', icon: '🎚️', category: 'Приборы' },
    { id: 'multimeter', name: 'Мультиметр', icon: '🔋', category: 'Приборы' },
    { id: 'megohmmeter', name: 'Мегаомметр', icon: '⚡', category: 'Приборы' },
    { id: 'frequency_meter', name: 'Частотомер', icon: '📻', category: 'Приборы' },
    { id: 'spectrophotometer', name: 'Спектрофотометр', icon: '🔬', category: 'Приборы' },
    { id: 'viscometer', name: 'Вязкозиметр', icon: '🛢️', category: 'Приборы' },
    { id: 'polarimeter', name: 'Поляриметр', icon: '🕶️', category: 'Приборы' },
    { id: 'goniometer', name: 'Гониометр', icon: '📐', category: 'Приборы' },

    // Aviation, Nautical & Space
    { id: 'altimeter', name: 'Высотомер (Альтиметр)', icon: '✈️', category: 'Авиация' },
    { id: 'variometer', name: 'Вариометр', icon: '🛩️', category: 'Авиация' },
    { id: 'inclinometer', name: 'Инклинометр', icon: '📉', category: 'Авиация' },
    { id: 'gravimeter', name: 'Гравиметр', icon: '🌍', category: 'Наука' },
    { id: 'seismograph', name: 'Сейсмограф', icon: '🌋', category: 'Наука' },
    { id: 'magnetometer', name: 'Магнитометр', icon: '🧲', category: 'Наука' },
    { id: 'bolometer', name: 'Болометр', icon: '☀️', category: 'Наука' },

    // Linguistic Parsers
    { id: 'morphology', name: 'Морфологический разбор', icon: '📝', category: 'Язык' },
    { id: 'syntax', name: 'Синтаксический разбор', icon: '📐', category: 'Язык' },
    { id: 'phonetics', name: 'Фонетический разбор', icon: '🔊', category: 'Язык' },
    { id: 'transcription', name: 'Транскрипция', icon: '🔤', category: 'Язык' },

    // Gadgets & Appliances
    { id: 'ionizer', name: 'Ионизатор воздуха', icon: '🌿', category: 'Быт' },
    { id: 'humidifier', name: 'Увлажнитель воздуха', icon: '💧', category: 'Быт' },
    { id: 'ozonator', name: 'Озонатор', icon: '🫧', category: 'Быт' },
    { id: 'shredder', name: 'Шредер для бумаг', icon: '✂️', category: 'Офис' },
    { id: 'ir_thermometer', name: 'ИК Термометр', icon: '🎯', category: 'Приборы' },
    { id: 'fog_generator', name: 'Генератор тумана', icon: '🌫️', category: 'Спецэффекты' },
    { id: 'insect_repeller', name: 'Отпугиватель насекомых', icon: '🦟', category: 'Быт' },
    { id: 'alien_smarthome', name: 'Умный дом', icon: '🏠', category: 'Быт' },
    { id: 'dumpling_projector', name: 'Проектор звёздного неба', icon: '🌌', category: 'Развлечения' },
    { id: 'dawn_nightlight', name: 'Ночник', icon: '💡', category: 'Быт' },
    { id: 'fan_heater', name: 'Тепловентилятор', icon: '🌀', category: 'Быт' },
    { id: 'electric_stove', name: 'Электрическая плита', icon: '🍳', category: 'Быт' },
    { id: 'fingerprint_scanner', name: 'Сканер отпечатков', icon: '👆', category: 'Безопасность' },
    { id: 'walkie_talkie', name: 'Рация', icon: '📻', category: 'Связь' },
    { id: 'night_vision', name: 'Ночное видение', icon: '🥽', category: 'Спецназ' },
    { id: 'underwater_metal_detector', name: 'Металлоискатель', icon: '🧲', category: 'Поиск' },
    { id: 'pinterest', name: 'Pinterest', icon: '📌', category: 'Медиа' },
    { id: 'trig_circle', name: 'Тригонометрическая окружность', icon: '📐', category: 'Обучение' },
  ];

  const filteredChats = chats
    .filter((c) => !blockedUsers.includes(c.name))
    .filter((c) => {
      if (activeFolder === 'Избранное') return c.isFavorite;
      if (activeFolder === 'Группы') return c.isGroup;
      if (activeFolder === 'Личные') return !c.isGroup;
      return true;
    })
    .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (!isLoggedIn) {
    return (
      <>
        {isBsodActive && (
          <BsodScreen
            onReboot={() => {
              setIsBsodActive(false);
              setShowSplashScreen(true);
              setTimeout(() => setShowSplashScreen(false), 900);
            }}
          />
        )}
        <LoginScreen
          onLoginSuccess={() => {
            setShowSplashScreen(true);
            setIsLoggedIn(true);
            setTimeout(() => setShowSplashScreen(false), 900);
          }}
          customization={loginCustomization}
        />
      </>
    );
  }

  const getThemeVars = () => {
    switch (theme) {
      case 'telegram_light':
        return {
          bg: '#f3f4f8',
          surface: '#ffffff',
          surfaceHover: '#f8fafc',
          border: '#e2e8f0',
          text: '#0f172a',
          textMuted: '#64748b',
          header: '#ffffff',
          bottomNav: '#ffffff',
          inputBg: '#f1f5f9',
        };
      case 'matrix_green':
        return {
          bg: '#010803',
          surface: '#041508',
          surfaceHover: '#09250f',
          border: '#00ff41',
          text: '#00ff41',
          textMuted: '#00cc33',
          header: '#020d05',
          bottomNav: '#020b04',
          inputBg: '#030f06',
        };
      case 'cyberpunk':
        return {
          bg: '#0c0217',
          surface: '#18052c',
          surfaceHover: '#280848',
          border: '#a855f7',
          text: '#00f0ff',
          textMuted: '#c084fc',
          header: '#130324',
          bottomNav: '#0c0217',
          inputBg: '#150428',
        };
      case 'sunset_gold':
        return {
          bg: '#140c06',
          surface: '#22140b',
          surfaceHover: '#331e10',
          border: '#f59e0b',
          text: '#fef3c7',
          textMuted: '#f59e0b',
          header: '#1c1008',
          bottomNav: '#140c06',
          inputBg: '#1e1109',
        };
      case 'oled_black':
        return {
          bg: '#000000',
          surface: '#0b0d13',
          surfaceHover: '#12151e',
          border: '#3f3f46',
          text: '#ffffff',
          textMuted: '#a1a1aa',
          header: '#000000',
          bottomNav: '#000000',
          inputBg: '#0c0c0c',
        };
      case 'windows_xp':
        return {
          bg: '#0055ea',
          surface: '#ffffff',
          surfaceHover: '#e6f0fa',
          border: '#0055ea',
          text: '#000000',
          textMuted: '#4b5563',
          header: '#0055ea',
          bottomNav: '#ece9d8',
          inputBg: '#ffffff',
        };
      case 'telegram_dark':
      default:
        return {
          bg: '#0b0d12',
          surface: '#14161e',
          surfaceHover: '#1c1f2b',
          border: '#222840',
          text: '#ffffff',
          textMuted: '#94a3b8',
          header: '#12141c',
          bottomNav: '#0f1117',
          inputBg: '#171a25',
        };
    }
  };

  const themeVars = getThemeVars();

  return (
    <>
      <style>{`
        :root {
          --app-font: ${
            fontFamily === 'sans'
              ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              : fontFamily === 'serif'
              ? 'Georgia, Cambria, "Times New Roman", Times, serif'
              : fontFamily === 'display'
              ? '"Playfair Display", "Trebuchet MS", sans-serif'
              : fontFamily === 'pixel'
              ? '"Courier New", monospace'
              : fontFamily === 'comic'
              ? '"Comic Sans MS", "Comic Neue", cursive, sans-serif'
              : 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
          };
          --app-accent: ${accentColor};
          --app-bg: ${themeVars.bg};
          --app-surface: ${themeVars.surface};
          --app-surface-hover: ${themeVars.surfaceHover};
          --app-border: ${themeVars.border};
          --app-text: ${themeVars.text};
          --app-text-muted: ${themeVars.textMuted};
          --app-header: ${themeVars.header};
          --app-bottom-nav: ${themeVars.bottomNav};
          --app-input-bg: ${themeVars.inputBg};
        }
        body, button, input, textarea, div, span, p, h1, h2, h3, h4, h5, h6 {
          font-family: var(--app-font) !important;
        }
      `}</style>
      {isBsodActive && (
        <BsodScreen
          onReboot={() => {
            setIsBsodActive(false);
            setShowSplashScreen(true);
            setTimeout(() => setShowSplashScreen(false), 900);
          }}
        />
      )}
      <div
        style={{
          filter: `${
            quality === '144p'
              ? 'blur(5px) contrast(1.4) brightness(0.85) '
              : quality === '240p'
              ? 'blur(3.5px) contrast(1.3) '
              : quality === '360p'
              ? 'blur(2px) contrast(1.2) '
              : quality === '480p'
              ? 'blur(1px) '
              : quality === '720p'
              ? 'blur(0.4px) '
              : ''
          }${powerSavingMode ? 'grayscale(100%) contrast(1.1) ' : ''}${screenBrightness < 1 ? `brightness(${screenBrightness}) ` : ''}`.trim() || undefined,
          fontSize: fontSize === 'small' ? '12px' : fontSize === 'large' ? '16px' : '14px',
          backgroundColor: themeVars.bg,
          color: themeVars.text,
        }}
        className={`flex flex-col h-[100dvh] max-h-[100dvh] w-full antialiased overflow-hidden select-none transition-colors duration-300 ${
          powerSavingMode ? 'grayscale contrast-125 brightness-90' : ''
        } ${
          fontSize === 'small' ? 'text-xs' : fontSize === 'large' ? 'text-base' : 'text-sm'
        }`}
      >
      {/* Top Status Bar (Battery, Clock, Date, Phone Status Icons) */}
      <TopStatusBar powerSavingMode={powerSavingMode} />

      {/* Cool Mode Particles Overlay */}
      {coolMode && <CoolModeExplosions active={coolMode} />}

      {/* Disaster Mode: потоки системных ошибок */}
      <DisasterMode />

      {/* Случайные события: звонок 444 и предупреждение о вирусе */}
      <RandomEvents />

      {/* Dynamic Notifications Overlay */}
      {activeNotifications.length > 0 && (
        <>
          {/* If frequent mode: Full Screen Overlapping Chaos + Top Control Toolbar */}
          {notificationFrequency === 'frequent' ? (
            <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
              {/* Sticky Top Control Toolbar */}
              <div className="fixed top-2.5 left-1/2 -translate-x-1/2 z-[99999] pointer-events-auto bg-black/90 backdrop-blur-xl border border-red-500/80 px-3.5 py-1.5 rounded-full shadow-[0_0_30px_rgba(239,68,68,0.7)] flex items-center gap-3 animate-bounce">
                <span className="text-xs font-black text-red-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  СПАМ (0.4с) • {activeNotifications.length} шт
                </span>
                <button
                  onClick={() => setActiveNotifications([])}
                  className="px-2.5 py-0.5 bg-red-600 hover:bg-red-500 active:scale-95 text-white text-[11px] font-bold rounded-lg cursor-pointer transition-all shadow-md"
                >
                  🧹 Очистить
                </button>
                <button
                  onClick={() => setNotificationsEnabled(false)}
                  className="px-2 py-0.5 bg-gray-800 hover:bg-gray-700 active:scale-95 text-gray-200 text-[11px] font-bold rounded-lg cursor-pointer transition-all border border-gray-600"
                >
                  ⏹️ Выкл
                </button>
              </div>

              {/* Layered notifications scattered across the whole screen */}
              {activeNotifications.map((notif) => (
                <div
                  key={notif.id}
                  style={{
                    position: 'absolute',
                    left: `${notif.x ?? 10}%`,
                    top: `${notif.y ?? 10}%`,
                    transform: `rotate(${notif.rot ?? 0}deg)`,
                    zIndex: notif.zIndex ?? 100,
                  }}
                  className={`pointer-events-auto p-2.5 sm:p-3 rounded-2xl border shadow-2xl backdrop-blur-md max-w-[260px] sm:max-w-xs animate-in zoom-in-90 duration-150 select-none ${
                    notif.color || 'border-red-500 bg-red-950/90 text-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl sm:text-2xl">{notif.icon}</span>
                      <div className="leading-tight">
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider block opacity-90">
                          {notif.title}
                        </span>
                        <p className="text-xs font-bold leading-snug mt-0.5">
                          {notif.text}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveNotifications((prev) => prev.filter((n) => n.id !== notif.id))}
                      className="text-gray-400 hover:text-white bg-black/40 hover:bg-black/60 p-1 rounded-lg text-[10px] font-bold cursor-pointer shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Rare mode: Clean top-right corner toasts */
            <div className="fixed top-14 right-3 z-50 flex flex-col gap-2 pointer-events-none max-w-xs sm:max-w-sm w-full max-h-[60vh] overflow-hidden">
              {activeNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className="bg-[#0f121a]/95 backdrop-blur-md border border-[#8f9bff]/60 p-3 rounded-2xl text-white font-sans flex items-center justify-between gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.9)] pointer-events-auto animate-in slide-in-from-top-4 duration-200"
                >
                  <div className="flex items-center gap-2.5 truncate pr-1">
                    <div className="w-8 h-8 rounded-xl bg-[#8f9bff]/20 border border-[#8f9bff]/50 flex items-center justify-center text-[#8f9bff] shrink-0 font-bold text-xs">
                      {notif.icon || '🔔'}
                    </div>
                    <div className="truncate">
                      <span className="text-[10px] text-[#8f9bff] font-mono font-black uppercase block tracking-wider">
                        {notif.title || 'Уведомление'}
                      </span>
                      <span className="text-xs truncate font-extrabold text-white block">{notif.text}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveNotifications((prev) => prev.filter((n) => n.id !== notif.id))}
                    className="text-gray-400 hover:text-white bg-[#171b27] hover:bg-[#1e2232] p-1.5 rounded-xl text-xs font-bold cursor-pointer shrink-0 border border-[#222840]"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* VR Mode Overlay */}
      {vrMode && (
        <div className="fixed inset-0 pointer-events-none z-40 border-8 border-purple-500/40 flex justify-between p-2">
          <div className="bg-purple-900/20 text-purple-300 font-extrabold text-[10px] px-2 py-0.5 border border-purple-500 uppercase h-fit">
            🕶️ VR L-EYE ({quality})
          </div>
          <div className="bg-purple-900/20 text-purple-300 font-extrabold text-[10px] px-2 py-0.5 border border-purple-500 uppercase h-fit">
            🕶️ VR R-EYE ({quality})
          </div>
        </div>
      )}

      {/* Cinema Mode Letterbox Overlay */}
      {cinemaMode && (
        <div className="fixed inset-0 pointer-events-none z-40 flex flex-col justify-between">
          <div className="h-10 bg-black border-b border-amber-500/40 flex items-center justify-between px-4 text-amber-400 font-black text-xs uppercase tracking-widest shadow-2xl">
            <span>🎬 CINEMA MODE ({quality})</span>
            <span className="text-[10px] text-amber-200">21:9 WIDESCREEN ASPECT</span>
          </div>
          <div className="h-10 bg-black border-t border-amber-500/40 flex items-center justify-center text-amber-500 text-[9px] uppercase font-bold">
            DOLBY ATMOS SURROUND SOUND
          </div>
        </div>
      )}

      {/* Header */}
      <Header
        coolMode={coolMode}
        onToggleCoolMode={() => setCoolMode(!coolMode)}
        onOpenSearch={() => setShowSearch(true)}
        onOpenUpdates={() => setShowUpdates(true)}
        onOpenSettings={() => setActiveTab('settings')}
        onOpenProfileDrawer={() => setShowProfileDrawer(true)}
        userAvatar={userProfile.avatar}
        activeTab={activeTab}
        yearOffset={yearOffset}
      />

      {/* Main Content Area */}
      {activeChat ? (
        <ChatView
          chat={activeChat}
          allChats={chats}
          onBack={() => setActiveChatId(null)}
          onSendMessage={handleSendMessage}
          onEditMessage={handleEditMessage}
          onDeleteMessage={handleDeleteMessage}
          onPinMessage={handlePinMessage}
          onToggleReaction={handleToggleReaction}
          onForwardMessage={handleForwardMessage}
          onBlockUser={handleBlockUser}
          onAddFriend={handleAddFriend}
          draftText={drafts[activeChat.id] || ''}
          onSaveDraft={(cId, txt) => setDrafts((prev) => ({ ...prev, [cId]: txt }))}
          sendSoundEnabled={sendSoundEnabled}
          chatWallpaper={chatWallpaper}
        />
      ) : (
        <div 
          className="flex-1 flex flex-col overflow-hidden bg-[#0b0d12] relative select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Views Container */}
          <div className="flex-1 relative overflow-hidden flex flex-col min-h-0">
            {/* CHATS TAB (Telegram / VK / Viber style modern messenger) */}
            {activeTab === 'chats' && (
              <div className="flex-1 flex flex-col overflow-hidden relative">
                <ChatBackground wallpaper={chatWallpaper} />
                <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
                  {/* Stories Bar */}
                  <StoriesBar />

                  {/* Folder Navigation (pills) */}
                  <div className="px-3 pt-2 pb-1 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 flex-1">
                      {folders.map((f) => {
                        const count = chats.filter((c) => {
                          if (blockedUsers.includes(c.name)) return f === 'Заблокированные';
                          if (f === 'Избранное') return c.isFavorite;
                          if (f === 'Группы') return c.isGroup;
                          if (f === 'Личные') return !c.isGroup;
                          if (f === 'Заблокированные') return false;
                          return true;
                        }).length;

                        const isActive = activeFolder === f;
                        return (
                          <button
                            key={f}
                            onClick={() => {
                              triggerHaptic('tap');
                              soundManager.playBeep(900, 0.03);
                              setActiveFolder(f);
                            }}
                            className={`pl-3.5 pr-2.5 py-1.5 rounded-full text-[13px] font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer select-none ${
                              isActive
                                ? 'bg-gradient-to-r from-[#8f9bff] to-[#b18cff] text-[#0b0d13] shadow-[0_6px_20px_rgba(143,155,255,0.35)]'
                                : 'bg-white/[0.06] text-gray-300 hover:bg-white/[0.1] hover:text-white'
                            }`}
                          >
                            <span>{f}</span>
                            <span
                              className={`min-w-[20px] text-center text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                                isActive ? 'bg-black/20 text-[#0b0d13]' : 'bg-white/10 text-gray-300'
                              }`}
                            >
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={handleCreateGroup}
                      className="w-9 h-9 bg-white/[0.07] hover:bg-white/[0.14] text-white rounded-full border border-white/10 flex items-center justify-center shrink-0 cursor-pointer transition-all active:scale-95"
                      title="Создать группу"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Search */}
                  <div className="px-3 pb-2 pt-1">
                    <div className="relative flex items-center">
                      <Search className="w-4 h-4 text-gray-500 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Поиск по диалогам и сообщениям"
                        className="w-full bg-white/[0.05] hover:bg-white/[0.08] focus:bg-white/[0.08] border border-white/[0.07] focus:border-[#8f9bff]/60 rounded-full pl-10 pr-9 py-2.5 text-[13px] text-white placeholder-gray-500 outline-none transition-all"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 text-gray-400 hover:text-white p-0.5 rounded-full hover:bg-white/10"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Chat List */}
                  <div className="flex-1 overflow-y-auto px-2 pb-24 space-y-0.5">
                    {filteredChats.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-48 text-center text-gray-500 p-4">
                        <div className="w-14 h-14 rounded-3xl bg-white/[0.05] flex items-center justify-center text-2xl mb-3">
                          💬
                        </div>
                        <p className="text-sm font-semibold text-gray-300">Диалогов не найдено</p>
                        <p className="text-xs text-gray-500 mt-1">Попробуйте изменить поисковый запрос или фильтр папки</p>
                      </div>
                    ) : (
                      filteredChats.map((chat) => {
                        const isPinnedOrFav = chat.isFavorite || chat.isPinned;
                        const hasDraft = !!drafts[chat.id];
                        const isTyping = chat.id === 'fav' && favTyping;

                        return (
                          <div
                            key={chat.id}
                            onClick={() => {
                              triggerHaptic('tap');
                              soundManager.playBeep(800, 0.05);
                              setActiveChatId(chat.id);
                            }}
                            className={`px-3 py-2.5 rounded-[1.4rem] transition-all cursor-pointer flex items-center group active:scale-[0.985] select-none ${
                              isPinnedOrFav
                                ? 'bg-gradient-to-r from-[#8f9bff]/[0.13] to-transparent hover:from-[#8f9bff]/[0.2]'
                                : 'hover:bg-white/[0.05]'
                            }`}
                          >
                            <div className="flex items-center gap-3.5 pr-2 overflow-hidden flex-1">
                              {/* Avatar */}
                              <div className="relative shrink-0">
                                <div
                                  className={`w-[52px] h-[52px] rounded-full p-[2px] ${
                                    isPinnedOrFav ? 'bg-gradient-to-br from-[#8f9bff] to-[#ff8fd8]' : 'bg-white/10'
                                  }`}
                                >
                                  <div className="w-full h-full rounded-full bg-[#171a28] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform overflow-hidden">
                                    {chat.avatar}
                                  </div>
                                </div>
                                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#34d399] border-[3px] border-[#0b0d13]" />
                              </div>

                              {/* Info */}
                              <div className="overflow-hidden flex-1">
                                <div className="flex items-center justify-between gap-1 mb-0.5">
                                  <div className="flex items-center gap-1.5 truncate">
                                    <h4 className="font-semibold text-[15px] text-white truncate">{chat.name}</h4>
                                    {chat.isGroup && (
                                      <span className="text-[10px] bg-white/10 text-gray-300 px-1.5 py-0.5 rounded-full font-medium shrink-0">
                                        Группа
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-gray-500 shrink-0 ml-2">{chat.lastMessageTime}</span>
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                  <div className="text-[13px] text-gray-400 truncate flex items-center gap-1.5 flex-1">
                                    {!hasDraft && !isTyping && <CheckCheck className="w-3.5 h-3.5 text-[#8f9bff] shrink-0" />}
                                    {hasDraft ? (
                                      <span className="text-rose-400 truncate">
                                        <span className="font-semibold mr-1">Черновик:</span>
                                        {drafts[chat.id]}
                                      </span>
                                    ) : isTyping ? (
                                      <span className="text-[#8f9bff] font-medium animate-pulse flex items-center gap-1">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8f9bff] animate-bounce" />
                                        <span>печатает...</span>
                                      </span>
                                    ) : (
                                      <span className="truncate">{chat.lastMessage}</span>
                                    )}
                                  </div>

                                  {isPinnedOrFav && <Pin className="w-3.5 h-3.5 text-[#8f9bff] fill-current shrink-0 ml-1 opacity-80" />}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Floating Action Button (FAB) for New Chat / Group */}
                  <button
                    onClick={handleCreateGroup}
                    className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-[#8f9bff] to-[#b18cff] text-[#0b0d13] flex items-center justify-center shadow-[0_10px_30px_rgba(143,155,255,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer z-20"
                    title="Новый диалог / группа"
                  >
                    <Edit3 className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            )}

            {/* TOOLS TAB (Инструменты) */}
            {activeTab === 'tools' && (
              <div className="flex-1 overflow-y-auto p-3.5 flex flex-col relative min-h-0">
                {/* Search */}
                <div className="relative flex items-center mb-3">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Поиск по всем ${ALL_TOOLS.length} инструментам`}
                    className="w-full bg-white/[0.05] hover:bg-white/[0.08] focus:bg-white/[0.08] border border-white/[0.07] focus:border-[#8f9bff]/60 rounded-full pl-10 pr-9 py-2.5 text-[13px] text-white placeholder-gray-500 outline-none transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 text-gray-400 hover:text-white p-0.5 rounded-full hover:bg-white/10"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 -mx-0.5 px-0.5">
                  {['', ...Array.from(new Set(ALL_TOOLS.map((t) => t.category)))].map((cat) => (
                    <button
                      key={cat || 'all'}
                      onClick={() => setSearchQuery(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap cursor-pointer transition-all ${
                        searchQuery === cat
                          ? 'bg-gradient-to-r from-[#8f9bff] to-[#b18cff] text-[#0b0d13]'
                          : 'bg-white/[0.06] text-gray-300 hover:bg-white/[0.1]'
                      }`}
                    >
                      {cat || 'Все'}
                    </button>
                  ))}
                </div>

                {/* Tools grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 pb-28">
                  {ALL_TOOLS.filter((t) =>
                    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    t.category.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        triggerHaptic('tap');
                        soundManager.playBeep(900, 0.05);
                        if (tool.id === 'games_online') {
                          try {
                            window.open('https://igroutka.ru/', '_blank', 'noopener,noreferrer');
                          } catch {}
                        }
                        setActiveTool(tool.id);
                      }}
                      className="relative p-2.5 pt-3.5 bg-gradient-to-b from-white/[0.07] to-white/[0.02] hover:from-white/[0.12] hover:to-white/[0.04] border border-white/[0.07] hover:border-white/20 rounded-[1.5rem] flex flex-col items-center text-center transition-all cursor-pointer group active:scale-[0.96] select-none"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.07] border border-white/10 flex items-center justify-center text-[26px] mb-2 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                        {tool.icon}
                      </div>
                      <span className="font-semibold text-[11.5px] text-white line-clamp-2 leading-tight px-0.5 min-h-[2.1em]">
                        {tool.name}
                      </span>
                      <span className="text-[9.5px] text-gray-500 mt-1 truncate max-w-full">{tool.category}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SETTINGS TAB VIEW */}
            {activeTab === 'settings' && (
              <div className="flex-1 overflow-y-auto flex flex-col relative bg-[#0b0d12] min-h-0">
                <SettingsView
                  userProfile={userProfile}
                  onUpdateProfile={(updated) => setUserProfile(updated)}
                  onOpenProfileDrawer={() => setShowProfileDrawer(true)}
                  coolMode={coolMode}
                  onToggleCoolMode={() => setCoolMode(!coolMode)}
                  fontSize={fontSize}
                  onChangeFontSize={(size) => setFontSize(size)}
                  fontFamily={fontFamily}
                  onChangeFontFamily={(f) => setFontFamily(f)}
                  theme={theme}
                  onChangeTheme={(t) => {
                    setTheme(t);
                    localStorage.setItem('app_theme', t);
                  }}
                  accentColor={accentColor}
                  onChangeAccentColor={(c) => {
                    setAccentColor(c);
                    localStorage.setItem('app_accent_color', c);
                  }}
                  notificationsEnabled={notificationsEnabled}
                  onToggleNotifications={(en) => setNotificationsEnabled(en)}
                  notificationFrequency={notificationFrequency}
                  onChangeNotificationFrequency={(freq) => setNotificationFrequency(freq)}
                  quality={quality}
                  onChangeQuality={(q) => setQuality(q)}
                  vrMode={vrMode}
                  onToggleVrMode={handleToggleVrMode}
                  cinemaMode={cinemaMode}
                  onToggleCinemaMode={handleToggleCinemaMode}
                  powerSavingMode={powerSavingMode}
                  onTogglePowerSavingMode={() => setPowerSavingMode(!powerSavingMode)}
                  sendSoundEnabled={sendSoundEnabled}
                  onToggleSendSound={() => setSendSoundEnabled(!sendSoundEnabled)}
                  chatWallpaper={chatWallpaper}
                  onChangeChatWallpaper={(wp) => setChatWallpaper(wp)}
                  loginCustomization={loginCustomization}
                  onUpdateLoginCustomization={(data) => {
                    setLoginCustomization(data);
                    localStorage.setItem('app_login_customization', JSON.stringify(data));
                  }}
                  onTestLoginScreen={() => {
                    setIsLoggedIn(false);
                  }}
                  onTriggerBsod={() => {
                    setIsBsodActive(true);
                  }}
                  blockedUsers={blockedUsers}
                  onUnblockUser={(name) => setBlockedUsers((prev) => prev.filter((u) => u !== name))}
                />
              </div>
            )}
          </div>

          {/* Profile Sliding Sidebar Drawer */}
          <ProfileDrawer
            isOpen={showProfileDrawer}
            onClose={() => setShowProfileDrawer(false)}
            userProfile={userProfile}
            onUpdateProfile={(updated) => setUserProfile(updated)}
            blockedUsers={blockedUsers}
            onUnblockUser={(name) => setBlockedUsers((prev) => prev.filter((u) => u !== name))}
          />

          {/* Settings Sliding Sidebar Drawer (Also accessible as drawer if needed) */}
          <SettingsDrawer
            isOpen={showSettingsDrawer}
            onClose={() => setShowSettingsDrawer(false)}
            userProfile={userProfile}
            onUpdateProfile={(updated) => setUserProfile(updated)}
            onOpenProfileDrawer={() => {
              setShowSettingsDrawer(false);
              setShowProfileDrawer(true);
            }}
            coolMode={coolMode}
            onToggleCoolMode={() => setCoolMode(!coolMode)}
            fontSize={fontSize}
            onChangeFontSize={(size) => setFontSize(size)}
            fontFamily={fontFamily}
            onChangeFontFamily={(f) => setFontFamily(f)}
            theme={theme}
            onChangeTheme={(t) => {
              setTheme(t);
              localStorage.setItem('app_theme', t);
            }}
            accentColor={accentColor}
            onChangeAccentColor={(c) => {
              setAccentColor(c);
              localStorage.setItem('app_accent_color', c);
            }}
            notificationsEnabled={notificationsEnabled}
            onToggleNotifications={(en) => setNotificationsEnabled(en)}
            notificationFrequency={notificationFrequency}
            onChangeNotificationFrequency={(freq) => setNotificationFrequency(freq)}
            quality={quality}
            onChangeQuality={(q) => setQuality(q)}
            vrMode={vrMode}
            onToggleVrMode={handleToggleVrMode}
            cinemaMode={cinemaMode}
            onToggleCinemaMode={handleToggleCinemaMode}
            powerSavingMode={powerSavingMode}
            onTogglePowerSavingMode={() => setPowerSavingMode(!powerSavingMode)}
            sendSoundEnabled={sendSoundEnabled}
            onToggleSendSound={() => setSendSoundEnabled(!sendSoundEnabled)}
            chatWallpaper={chatWallpaper}
            onChangeChatWallpaper={(wp) => setChatWallpaper(wp)}
            loginCustomization={loginCustomization}
            onUpdateLoginCustomization={(data) => {
              setLoginCustomization(data);
              localStorage.setItem('app_login_customization', JSON.stringify(data));
            }}
            onTestLoginScreen={() => {
              setShowSettingsDrawer(false);
              setIsLoggedIn(false);
            }}
            onTriggerBsod={() => {
              setShowSettingsDrawer(false);
              setIsBsodActive(true);
            }}
          />

          {/* Bottom Navigation: floating glass pill */}
          <div className="shrink-0 z-30 select-none px-3 pb-3 pt-1" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
            <div
              style={{ backgroundColor: 'var(--app-bottom-nav)', borderColor: 'var(--app-border)' }}
              className="backdrop-blur-2xl border rounded-full p-1.5 grid grid-cols-3 gap-1 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
            >
              {(
                [
                  { id: 'chats', label: 'Общение', Icon: MessageSquare, badge: 3 },
                  { id: 'tools', label: 'Инструменты', Icon: LayoutGrid, badge: 0 },
                  { id: 'settings', label: 'Настройки', Icon: Settings, badge: 0 },
                ] as const
              ).map(({ id, label, Icon, badge }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      triggerHaptic('tap');
                      soundManager.playBeep(700, 0.04);
                      setActiveTab(id);
                    }}
                    style={
                      active
                        ? { backgroundColor: 'var(--app-accent)', color: '#0b0d13', boxShadow: `0 6px 20px ${accentColor}55` }
                        : { color: 'var(--app-text)' }
                    }
                    className={`py-2.5 px-2 rounded-full font-semibold text-[12px] flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer active:scale-[0.96] ${
                      active ? '' : 'hover:bg-white/[0.07] opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="relative">
                      <Icon className="w-[18px] h-[18px]" />
                      {badge > 0 && (
                        <span
                          style={active ? { backgroundColor: '#0b0d13', color: 'var(--app-accent)' } : { backgroundColor: 'var(--app-accent)', color: '#0b0d13' }}
                          className="absolute -top-1.5 -right-2 min-w-[14px] h-[14px] text-[9px] font-black rounded-full flex items-center justify-center px-0.5"
                        >
                          {badge}
                        </span>
                      )}
                    </div>
                    {(active || id !== 'tools') && <span>{label}</span>}
                    {!active && id === 'tools' && <span>{label}</span>}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Global Modals */}
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
      {showUpdates && <UpdatesModal onClose={() => setShowUpdates(false)} />}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          userProfile={userProfile}
          onUpdateProfile={(updated) => setUserProfile(updated)}
        />
      )}

      {/* Tools Modals Router */}
      <ToolBoundary resetKey={activeTool} onError={() => setActiveTool(null)}>
      {/* Customizer Tool */}
      {activeTool === 'login_customizer' && (
        <LoginCustomizerTool
          initialData={loginCustomization}
          onClose={() => setActiveTool(null)}
          onSave={(data) => {
            setLoginCustomization(data);
            try {
              localStorage.setItem('app_login_customization', JSON.stringify(data));
            } catch {}
          }}
          onLaunch={(data) => {
            setLoginCustomization(data);
            try {
              localStorage.setItem('app_login_customization', JSON.stringify(data));
            } catch {}
            setActiveTool(null);
            setShowSettingsDrawer(false);
            setIsLoggedIn(false);
          }}
        />
      )}

      {activeTool === 'people_nearby' && (
        <PeopleNearbyTool
          onClose={() => setActiveTool(null)}
          onSelectPerson={handleSelectPersonNearby}
        />
      )}
      {activeTool === 'morse' && <MorseTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'paint' && <PaintTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'flashlight' && <FlashlightTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'store' && <StoreTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'phone' && <PhoneTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'disinfection' && <DisinfectionTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'burger_king' && <BurgerKingTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'sberbank' && <SberbankTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'taxi' && <TaxiTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'coffee' && <CoffeeMachineTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'dictaphone' && <DictaphoneTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'weather' && <WeatherTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'compass' && <CompassTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'fan' && <FanTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'vpn' && <VpnTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'gosuslugi' && <GosuslugiTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'medical_tests' && <MedicalTestsTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'iptv' && <IptvTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'barometer' && (
        <GaugesTool mode="barometer" onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'ammeter' && (
        <GaugesTool mode="ammeter" onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'voltmeter' && (
        <GaugesTool mode="voltmeter" onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'speedometer' && <SpeedometerTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'pedometer' && <PedometerTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'karaoke' && <KaraokeTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'health' && <HealthTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'tele2' && <Tele2Tool onClose={() => setActiveTool(null)} />}
      {activeTool === 'pharmacy' && <PharmacyTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'blood_pressure' && <BloodPressureTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'reviews' && <ReviewsTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'calendar' && <CalendarTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'mirror' && <MirrorTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'calculator' && <CalculatorTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'clock' && <ClockTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'puzzle' && <PuzzleTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'trash' && (
        <TrashTool
          onClose={() => setActiveTool(null)}
          onBroadcastTrash={handleBroadcastTrash}
        />
      )}
      {activeTool === 'translator' && <TranslatorTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'kinopoisk' && <KinopoiskTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'aviasales' && <AviasalesTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'antivirus' && <AntivirusTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'gyroscope' && <GyroscopeTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'diary' && <SchoolDiaryTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'radio' && <RadioTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'microscope' && <MicroscopeTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'telescope' && <TelescopeTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'psychological_help' && <PsychologicalHelpTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'browser' && <BrowserTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'crate_opening' && <CrateOpeningTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'support' && <SupportTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'rotate_phone' && <RotatePhoneTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'upgrade_device' && <UpgradeDeviceTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'microwave' && <MicrowaveTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'education' && <EducationTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'trig_circle' && <TrigonometricCircleTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'lie_detector' && <LieDetectorTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'time_machine' && (
        <TimeMachineTool
          onClose={() => setActiveTool(null)}
          yearOffset={yearOffset}
          onSetYearOffset={(off) => setYearOffset(off)}
        />
      )}
      {activeTool === 'safe' && <SafeTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'scales' && <ScalesTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'thermometer' && <ThermometerTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'sound_meter' && <SoundMeterTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'battery' && <BatteryTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'alarm_clock' && <AlarmClockTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'memory_cleaner' && <MemoryCleanerTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'internet' && <InternetSpeedTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'notepad' && <NotepadTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'water_tracker' && <WaterTrackerTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'heater' && <HeaterTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'tachometer' && <TachometerTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'geiger' && <GeigerCounterTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'event_log' && <EventLogTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'registry_editor' && <RegistryEditorTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'task_manager' && <TaskManagerTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'text_encoder' && <TextEncoderTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'periodic_table' && <PeriodicTableTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'metronome' && <MetronomeTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'wheel_of_fortune' && <WheelOfFortuneTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'license_plate' && <LicensePlateTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'medical_record' && <MedicalRecordTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'breathalyzer' && <BreathalyzerTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'vision_test' && <VisionTestTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'hearing_test' && <HearingTestTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'command_line' && <CommandLineTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'glucometer' && <GlucometerTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'ecg' && <EcgTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'medical_note' && <MedicalNoteTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'bubble_level' && <BubbleLevelTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'metal_detector' && <MetalDetectorTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'atm' && <AtmTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'taximeter' && <TaximeterTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'gas_station' && <GasStationTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'water_meter' && <WaterMeterTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'electricity_meter' && <ElectricityMeterTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'camera' && <CameraTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'alarm' && <AlarmTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'smoke_detector' && <SmokeDetectorTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'currency_converter' && <CurrencyConverterTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'seismometer' && <SeismometerTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'barcode_scanner' && <BarcodeScannerTool onClose={() => setActiveTool(null)} />}

      {/* Expanded Tools Set 2 Modals */}
      {activeTool === 'vtb' && <VtbBankTool onClose={() => setActiveTool(null)} />}
      {activeTool === 't_bank' && <TBankTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'alfa_bank' && <AlfaBankTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'gazprombank' && <GazpromBankTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'captcha' && <CaptchaTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'navigator' && <NavigatorTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'music_player' && <MusicPlayerTool onClose={() => setActiveTool(null)} userAvatar={userProfile.avatar} />}
      {activeTool === 'court' && <CourtTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'police_bulletin' && <PoliceBulletinTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'avito' && <AvitoTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'drom' && <DromTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'edadeal' && <EdadealTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'youtube' && <YouTubeTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'tomography' && <TomographyTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'music_maker' && <MusicMakerTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'mail' && <MailTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'chatgpt' && <ChatGPTTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'yandex_alice' && <YandexAliceTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'horoscope' && <HoroscopeTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'cloud_gaming' && <CloudGamingTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'pokemon_search' && <PokemonSearchTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'taxes' && <TaxTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'where_are_my_kids' && <WhereAreMyKidsTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'solitaire' && <SolitaireTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'chess' && <ChessTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'checkers' && <CheckersTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'backgammon' && <BackgammonTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'train_tickets' && <TrainTicketsTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'food_delivery' && <FoodDeliveryTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'books' && <BooksTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'duolingo' && <DuolingoTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'fps_booster' && <FpsBoosterTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'short_videos' && <ShortVideosTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'games_online' && <GamesOnlineTool onClose={() => setActiveTool(null)} />}

      {/* 33 New Requested Tools Modals */}
      {activeTool === 'multiplication_table' && <MultiplicationTableTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'air_conditioner' && <AirConditionerTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'luxmeter' && <LuxmeterTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'carsharing' && <CarsharingTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'scooter_rental' && <ScooterRentalTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'job_search' && <JobSearchTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'pdf_scanner' && <PdfScannerTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'powerpoint' && <PowerPointTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'excel' && <ExcelTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'word' && <WordTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'apartment_design' && <ApartmentDesignTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'apartment_search' && <ApartmentSearchTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'calorie_counter' && <CalorieCounterTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'home_workouts' && <HomeWorkoutsTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'yoga' && <YogaTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'weight_loss' && <WeightLossTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'chatroulette' && <ChatrouletteTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'gas_stations_nearby' && <GasStationsNearbyTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'metro_map' && <MetroMapTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'bus_schedule' && <BusScheduleTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'constellation_map' && <ConstellationMapTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'event_poster' && <EventPosterTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'expense_tracker' && <ExpenseTrackerTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'vaccine_calendar' && <VaccineCalendarTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'bike_map' && <BikeMapTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'parking_nearby' && <ParkingNearbyTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'spell_checker' && <SpellCheckerTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'ev_charging' && <EvChargingTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'lotto' && <LottoTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'international_passport' && <InternationalPassportTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'passport_improve' && <PassportImproveTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'lottery' && <LotteryTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'sports_betting' && <SportsBettingTool onClose={() => setActiveTool(null)} />}

      {/* Additional Specialized & High Precision Tools Modals */}
      {activeTool === 'crypto_investments' && <CryptoInvestmentsTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'credit_calculator' && <CreditCalculatorTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'recipes' && <RecipesTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'table_booking' && <TableBookingTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'period_tracker' && <PeriodTrackerTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'medication_reminder' && <MedicationReminderTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'gibdd_fines' && <GibddFinesTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'pdd_exam' && <PddExamTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'flashcards' && <FlashcardsTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'nvidia_panel' && <NvidiaControlPanelTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'windows_emulator' && <WindowsEmulatorTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'game_2048' && <Game2048Tool onClose={() => setActiveTool(null)} />}
      {activeTool === 'electricity_billing' && <ElectricityBillingTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'gas_billing' && <GasBillingTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'news' && <NewsTool onClose={() => setActiveTool(null)} />}
      {activeTool === 'meditation' && <MeditationTool onClose={() => setActiveTool(null)} />}
      </ToolBoundary>

      {/* Scientific & Industrial Measuring Instruments Router */}
      {[
        'dynamometer', 'accelerometer', 'pyrometer', 'dosimeter',
        'oscilloscope', 'spectrometer', 'caliper', 'micrometer', 'vibrometer',
        'gas_analyzer', 'anemometer', 'chronometer', 'manometer', 'refractometer',
        'densitometer', 'multimeter', 'megohmmeter', 'frequency_meter', 'spectrophotometer',
        'viscometer', 'polarimeter', 'goniometer', 'altimeter', 'variometer',
        'inclinometer', 'gravimeter', 'seismograph', 'magnetometer', 'bolometer'
      ].includes(activeTool || '') && (
        <ScientificInstrumentsTool type={activeTool as InstrumentType} onClose={() => setActiveTool(null)} />
      )}

      {/* Linguistic Parsers Router */}
      {['morphology', 'syntax', 'phonetics', 'transcription'].includes(activeTool || '') && (
        <LinguisticParsersTool mode={activeTool as LinguisticMode} onClose={() => setActiveTool(null)} />
      )}

      {/* Gadgets & Home Appliances Router */}
      {[
        'ionizer', 'humidifier', 'ozonator', 'shredder', 'ir_thermometer',
        'fog_generator', 'insect_repeller', 'alien_smarthome', 'dumpling_projector',
        'dawn_nightlight', 'fan_heater', 'electric_stove', 'fingerprint_scanner',
        'walkie_talkie', 'night_vision', 'underwater_metal_detector', 'pinterest'
      ].includes(activeTool || '') && (
        <HomeAppliancesGadgetsTool type={activeTool as GadgetType} onClose={() => setActiveTool(null)} />
      )}
    </div>
  </>
);
}

export default App;
