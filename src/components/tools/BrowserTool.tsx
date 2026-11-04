import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Lock,
  Search,
  Camera,
  Plus,
  X,
  Globe,
  History,
  Download,
  Settings,
  WifiOff,
  ShieldAlert,
  SlidersHorizontal,
  Bookmark,
  ExternalLink,
  ChevronRight,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { soundManager, triggerHaptic } from '../../utils/soundEffects';

interface BrowserToolProps {
  onClose: () => void;
}

interface BrowserTab {
  id: string;
  title: string;
  url: string;
  isSecure: boolean;
  history: string[];
  historyIndex: number;
}

const TOP_SHORTCUTS = [
  { name: 'Telegram 2', url: 'https://telegram2.org', icon: '✈️', desc: 'Официальный поиск' },
  { name: 'Википедия', url: 'https://ru.wikipedia.org', icon: '📖', desc: 'Энциклопедия' },
  { name: 'Хабр', url: 'https://habr.com', icon: '⚡', desc: 'IT-сообщество' },
  { name: 'GitHub', url: 'https://github.com', icon: '🐙', desc: 'Разработка' },
];


interface BrowserError {
  code: string;
  title: string;
  desc: string;
  hints: string[];
  http?: string;
  tone: 'red' | 'amber' | 'gray';
}

const BROWSER_ERRORS: BrowserError[] = [
  { code: 'DNS_PROBE_FINISHED_NXDOMAIN', title: 'Не удаётся найти IP-адрес сервера', tone: 'gray',
    desc: 'Не удалось найти DNS-адрес сервера {host}. Проверьте правильность адреса.',
    hints: ['Проверьте, нет ли опечаток в адресе', 'Проверьте прокси-сервер и настройки DNS', 'Запустите диагностику сети'] },
  { code: 'ERR_CONNECTION_TIMED_OUT', title: 'Превышено время ожидания ответа', tone: 'gray',
    desc: 'Сервер {host} слишком долго не отвечает.',
    hints: ['Проверьте подключение к интернету', 'Проверьте прокси-сервер и брандмауэр', 'Повторите попытку позже'] },
  { code: 'ERR_CONNECTION_REFUSED', title: 'Сервер отклонил запрос на подключение', tone: 'gray',
    desc: 'Сайт {host} отклонил запрос на подключение.',
    hints: ['Проверьте подключение к интернету', 'Проверьте прокси-сервер и брандмауэр'] },
  { code: 'ERR_CONNECTION_RESET', title: 'Соединение было сброшено', tone: 'gray',
    desc: 'Соединение с сайтом {host} было прервано во время загрузки страницы.',
    hints: ['Проверьте подключение к интернету', 'Отключите VPN или прокси-сервер', 'Повторите попытку позже'] },
  { code: 'ERR_INTERNET_DISCONNECTED', title: 'Нет подключения к интернету', tone: 'gray',
    desc: 'Устройство не подключено к сети. Страница {host} не может быть загружена.',
    hints: ['Проверьте сетевые кабели, модем и маршрутизатор', 'Подключитесь к сети Wi-Fi или включите мобильные данные', 'Отключите режим полёта'] },
  { code: 'ERR_NETWORK_CHANGED', title: 'Сетевое подключение изменилось', tone: 'gray',
    desc: 'Во время загрузки страницы {host} было обнаружено изменение сети.',
    hints: ['Повторите попытку', 'Проверьте стабильность сигнала Wi-Fi'] },
  { code: 'ERR_SSL_PROTOCOL_ERROR', title: 'Не удаётся установить безопасное соединение', tone: 'amber',
    desc: 'Сайт {host} отправил недопустимый ответ. Ошибка протокола SSL.',
    hints: ['Проверьте дату и время на устройстве', 'Отключите антивирус, перехватывающий HTTPS-трафик'] },
  { code: 'NET::ERR_CERT_DATE_INVALID', title: 'Ваше подключение не защищено', tone: 'red',
    desc: 'Срок действия сертификата сайта {host} истёк. Злоумышленники могут пытаться похитить ваши данные.',
    hints: ['Проверьте дату и время на устройстве', 'Не вводите пароли и данные карт на этом сайте'] },
  { code: 'NET::ERR_CERT_AUTHORITY_INVALID', title: 'Ваше подключение не защищено', tone: 'red',
    desc: 'Сертификат сайта {host} выдан неизвестным центром сертификации.',
    hints: ['Сайт может быть подменён', 'Вернитесь на безопасную страницу'] },
  { code: 'ERR_TOO_MANY_REDIRECTS', title: 'Слишком много перенаправлений', tone: 'gray',
    desc: 'Страница {host} перенаправила вас слишком много раз.',
    hints: ['Попробуйте удалить файлы cookie для этого сайта', 'Если проблема останется, сайт неисправен'] },
  { code: 'ERR_PROXY_CONNECTION_FAILED', title: 'Не удаётся подключиться к прокси-серверу', tone: 'gray',
    desc: 'Прокси-сервер не отвечает при попытке открыть {host}.',
    hints: ['Проверьте настройки прокси-сервера', 'Обратитесь к сетевому администратору'] },
  { code: 'ERR_EMPTY_RESPONSE', title: 'Сайт не отправил данных', tone: 'gray',
    desc: 'Сервер {host} закрыл соединение, не отправив ответа.',
    hints: ['Повторите попытку позже', 'Проверьте подключение к интернету'] },
  { code: 'ERR_ADDRESS_UNREACHABLE', title: 'Адрес недоступен', tone: 'gray',
    desc: 'Не удаётся достичь узла {host}: нет маршрута до сервера.',
    hints: ['Проверьте настройки сети', 'Попробуйте отключить VPN'] },
  { code: 'ERR_BLOCKED_BY_ADMINISTRATOR', title: 'Доступ заблокирован администратором', tone: 'red',
    desc: 'Доступ к странице {host} запрещён политикой сети.',
    hints: ['Обратитесь к администратору сети'] },
  { code: 'HTTP 403', http: '403 Forbidden', title: 'Доступ запрещён', tone: 'red',
    desc: 'У вас нет прав на просмотр {host}. Сервер отклонил запрос.',
    hints: ['Войдите в учётную запись', 'Проверьте, не заблокирован ли ваш IP-адрес'] },
  { code: 'HTTP 404', http: '404 Not Found', title: 'Страница не найдена', tone: 'amber',
    desc: 'Запрашиваемая страница на сайте {host} не существует или была удалена.',
    hints: ['Проверьте адрес страницы', 'Перейдите на главную страницу сайта'] },
  { code: 'HTTP 500', http: '500 Internal Server Error', title: 'Внутренняя ошибка сервера', tone: 'red',
    desc: 'На сервере {host} произошла непредвиденная ошибка при обработке запроса.',
    hints: ['Повторите попытку через несколько минут', 'Сообщите о проблеме владельцу сайта'] },
  { code: 'HTTP 502', http: '502 Bad Gateway', title: 'Неверный ответ шлюза', tone: 'red',
    desc: 'Шлюз получил некорректный ответ от вышестоящего сервера сайта {host}.',
    hints: ['Обновите страницу', 'Повторите попытку позже'] },
  { code: 'HTTP 503', http: '503 Service Unavailable', title: 'Сервис временно недоступен', tone: 'amber',
    desc: 'Сервер {host} перегружен или находится на техническом обслуживании.',
    hints: ['Повторите попытку через несколько минут'] },
  { code: 'HTTP 504', http: '504 Gateway Timeout', title: 'Шлюз не дождался ответа', tone: 'red',
    desc: 'Сервер-шлюз не получил своевременного ответа от сервера {host}.',
    hints: ['Обновите страницу', 'Повторите попытку позже'] },
  { code: 'HTTP 429', http: '429 Too Many Requests', title: 'Слишком много запросов', tone: 'amber',
    desc: 'С вашего адреса поступило слишком много запросов к {host}. Подождите перед повторной попыткой.',
    hints: ['Повторите через 60 секунд'] },
  { code: 'HTTP 451', http: '451 Unavailable For Legal Reasons', title: 'Доступ ограничен по юридическим причинам', tone: 'red',
    desc: 'Доступ к ресурсу {host} ограничен на основании требований законодательства.',
    hints: ['Страница недоступна в вашем регионе'] },
  { code: 'CLOUDFLARE 1020', http: 'Error 1020', title: 'Access denied', tone: 'red',
    desc: 'Владелец сайта {host} ограничил доступ с вашего IP-адреса или региона.',
    hints: ['Cloudflare Ray ID: 8a1f3c9d2e4b7a60'] },
];

const hashStr = (str: string): number => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
};

const hostOf = (url: string): string => {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
};

export const BrowserTool: React.FC<BrowserToolProps> = ({ onClose }) => {
  const [tabs, setTabs] = useState<BrowserTab[]>([
    {
      id: 'tab-1',
      title: 'Новая вкладка',
      url: 'about:blank',
      isSecure: true,
      history: ['about:blank'],
      historyIndex: 0,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState('tab-1');
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [activeOverlay, setActiveOverlay] = useState<'history' | 'downloads' | 'settings' | null>(null);

  const [browsingHistory, setBrowsingHistory] = useState<Array<{ title: string; url: string; date: string }>>([
    { title: 'Telegram 2 Search Engine', url: 'https://telegram2.org', date: 'Сегодня, 12:45' },
    { title: 'Википедия — свободная энциклопедия', url: 'https://ru.wikipedia.org', date: 'Вчера, 18:30' },
  ]);

  const [downloadsList] = useState([
    { name: 'document_scan_2026.pdf', size: '1.8 MB', date: 'Сегодня', status: 'Завершено' },
    { name: 'update_package_x64.zip', size: '48.2 MB', date: 'Вчера', status: 'Завершено' },
  ]);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const photoInputRef = React.useRef<HTMLInputElement | null>(null);
  const handlePhotoSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) navigateTo(`Поиск по фото: ${file.name}`);
    e.target.value = '';
  };

  const navigateTo = (rawQuery: string) => {
    let target = rawQuery.trim();
    if (!target) return;

    if (!target.startsWith('http://') && !target.startsWith('https://') && !target.startsWith('about:')) {
      if (target.includes('.') && !target.includes(' ')) {
        target = `https://${target}`;
      } else {
        target = `https://telegram2.org/search?q=${encodeURIComponent(target)}`;
      }
    }

    setIsLoading(true);
    setInputUrl(target);
    setAttempt(Math.floor(Math.random() * 1000));

    setTimeout(() => {
      setIsLoading(false);
      let pageTitle = target;
      try {
        const u = new URL(target);
        pageTitle = u.hostname.replace('www.', '');
      } catch {
        pageTitle = target;
      }

      setTabs((prev) =>
        prev.map((tab) => {
          if (tab.id === activeTabId) {
            const newHistory = tab.history.slice(0, tab.historyIndex + 1);
            newHistory.push(target);
            return {
              ...tab,
              url: target,
              title: pageTitle,
              history: newHistory,
              historyIndex: newHistory.length - 1,
            };
          }
          return tab;
        })
      );

      setBrowsingHistory((prev) => [
        {
          title: pageTitle,
          url: target,
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev,
      ]);
    }, 380);
  };

  const handleCreateTab = (initialUrl: string = 'about:blank', title: string = 'Новая вкладка') => {
    triggerHaptic('tap');
    soundManager.playBeep(900, 0.04);
    const newId = `tab-${Date.now()}`;
    const newTab: BrowserTab = {
      id: newId,
      title,
      url: initialUrl,
      isSecure: true,
      history: [initialUrl],
      historyIndex: 0,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
    setInputUrl(initialUrl === 'about:blank' ? '' : initialUrl);
  };

  const handleCloseTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('tap');
    soundManager.playBeep(700, 0.04);
    if (tabs.length === 1) {
      setTabs([
        {
          id: `tab-${Date.now()}`,
          title: 'Новая вкладка',
          url: 'about:blank',
          isSecure: true,
          history: ['about:blank'],
          historyIndex: 0,
        },
      ]);
      setInputUrl('');
      return;
    }

    const nextTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(nextTabs);
    if (activeTabId === tabId) {
      const last = nextTabs[nextTabs.length - 1];
      setActiveTabId(last.id);
      setInputUrl(last.url === 'about:blank' ? '' : last.url);
    }
  };

  const handleBack = () => {
    if (activeTab.historyIndex > 0) {
      triggerHaptic('tap');
      const prevIdx = activeTab.historyIndex - 1;
      const prevUrl = activeTab.history[prevIdx];
      setTabs((prev) =>
        prev.map((t) => (t.id === activeTabId ? { ...t, historyIndex: prevIdx, url: prevUrl } : t))
      );
      setInputUrl(prevUrl === 'about:blank' ? '' : prevUrl);
    }
  };

  const handleForward = () => {
    if (activeTab.historyIndex < activeTab.history.length - 1) {
      triggerHaptic('tap');
      const nextIdx = activeTab.historyIndex + 1;
      const nextUrl = activeTab.history[nextIdx];
      setTabs((prev) =>
        prev.map((t) => (t.id === activeTabId ? { ...t, historyIndex: nextIdx, url: nextUrl } : t))
      );
      setInputUrl(nextUrl === 'about:blank' ? '' : nextUrl);
    }
  };

  const handleRefresh = () => {
    triggerHaptic('tap');
    soundManager.playBeep(1100, 0.05);
    setIsLoading(true);
    setAttempt((a) => a + 1);
    setTimeout(() => setIsLoading(false), 350);
  };

  const handleHome = () => {
    triggerHaptic('tap');
    soundManager.playBeep(850, 0.04);
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? {
              ...t,
              url: 'about:blank',
              title: 'Новая вкладка',
              history: [...t.history, 'about:blank'],
              historyIndex: t.history.length,
            }
          : t
      )
    );
    setInputUrl('');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0d0d0d] text-white select-none overflow-hidden animate-in fade-in duration-200">
      
      {/* 1. TOP TITLEBAR & TAB ROW (Edge to Edge Full Screen) */}
      <div className="bg-[#12151e] border-b border-[#242424] flex items-center justify-between px-2 pt-1.5 pb-0 gap-2 shrink-0">
        
        {/* Left Back to Telegram 2 App Button */}
        <div className="flex items-center gap-1.5 pb-1.5">
          <button
            onClick={() => {
              triggerHaptic('tap');
              soundManager.playBeep(800, 0.05);
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1c2030] hover:bg-[#2c2c2c] text-gray-200 hover:text-[#8f9bff] border border-[#333] hover:border-[#8f9bff]/50 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
            title="Закрыть браузер и вернуться в Telegram 2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Назад в Telegram 2</span>
            <span className="sm:hidden">Назад</span>
          </button>
        </div>

        {/* Browser Tabs Bar */}
        <div className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full pb-0.5">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => {
                  triggerHaptic('tap');
                  setActiveTabId(tab.id);
                  setInputUrl(tab.url === 'about:blank' ? '' : tab.url);
                }}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-xl text-xs max-w-[200px] min-w-[120px] transition-all cursor-pointer border-t border-x ${
                  isActive
                    ? 'bg-[#1e1e1e] text-white border-[#383838] border-b-transparent font-bold shadow-md'
                    : 'bg-[#12151e] text-gray-400 border-transparent hover:bg-[#171b27] hover:text-gray-200'
                }`}
              >
                <Globe className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#8f9bff]' : 'text-gray-500'}`} />
                <span className="truncate flex-1 text-[11px]">{tab.title}</span>
                <button
                  onClick={(e) => handleCloseTab(tab.id, e)}
                  className="opacity-60 group-hover:opacity-100 hover:bg-white/10 rounded-full p-0.5 text-gray-400 hover:text-white transition-opacity"
                  title="Закрыть вкладку"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}

          <button
            onClick={() => handleCreateTab()}
            className="p-1.5 rounded-xl hover:bg-[#212536] text-gray-400 hover:text-[#8f9bff] transition-colors cursor-pointer ml-1 mb-1"
            title="Новая вкладка"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Right Window Action Controls */}
        <div className="flex items-center gap-1 pb-1.5 shrink-0">
          <button
            onClick={() => {
              triggerHaptic('tap');
              onClose();
            }}
            className="p-1.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-[#212536] transition-all cursor-pointer"
            title="Закрыть браузер"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. NAVIGATION & OMNIBOX ADDRESS BAR */}
      <div className="flex items-center px-3 sm:px-4 py-2 bg-[#171b27] border-b border-[#282828] gap-2 shrink-0">
        
        {/* Navigation Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleBack}
            disabled={activeTab.historyIndex <= 0}
            className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-[#262a3b] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
            title="Назад"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleForward}
            disabled={activeTab.historyIndex >= activeTab.history.length - 1}
            className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-[#262a3b] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
            title="Вперёд"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-xl text-gray-300 hover:text-white hover:bg-[#262a3b] cursor-pointer transition-colors ${
              isLoading ? 'animate-spin text-[#8f9bff]' : ''
            }`}
            title="Обновить"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleHome}
            className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-[#262a3b] cursor-pointer transition-colors"
            title="Главная страница"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSearch} />
        {/* Address & Search Omnibox */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigateTo(inputUrl);
          }}
          className="flex-1 min-w-[180px] flex items-center bg-[#101010] border border-[#333] hover:border-[#4d4d4d] focus-within:border-[#8f9bff] focus-within:ring-1 focus-within:ring-[#8f9bff]/30 rounded-xl px-3.5 py-1.5 text-xs transition-all shadow-inner"
        >
          <Lock className="w-3.5 h-3.5 text-[#8f9bff] shrink-0 mr-2" />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Введите адрес сайта или поисковый запрос..."
            className="w-full bg-transparent text-white outline-none placeholder-gray-500 font-mono text-xs sm:text-sm"
          />
          {inputUrl && (
            <button
              type="button"
              onClick={() => setInputUrl('')}
              className="text-gray-500 hover:text-gray-300 p-1 rounded-full hover:bg-white/10 ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            title="Поиск по фото"
            className="text-gray-400 hover:text-[#8f9bff] ml-2 p-1 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
          </button>
          <button type="submit" className="text-gray-400 hover:text-[#8f9bff] ml-1 p-1 cursor-pointer">
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Tool Overlays Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => {
              triggerHaptic('tap');
              setActiveOverlay(activeOverlay === 'history' ? null : 'history');
            }}
            className={`p-2 rounded-xl cursor-pointer transition-colors ${
              activeOverlay === 'history' ? 'bg-[#8f9bff]/20 text-[#8f9bff]' : 'text-gray-400 hover:text-white hover:bg-[#262a3b]'
            }`}
            title="История"
          >
            <History className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              triggerHaptic('tap');
              setActiveOverlay(activeOverlay === 'downloads' ? null : 'downloads');
            }}
            className={`p-2 rounded-xl cursor-pointer transition-colors ${
              activeOverlay === 'downloads' ? 'bg-[#8f9bff]/20 text-[#8f9bff]' : 'text-gray-400 hover:text-white hover:bg-[#262a3b]'
            }`}
            title="Загрузки"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              triggerHaptic('tap');
              setActiveOverlay(activeOverlay === 'settings' ? null : 'settings');
            }}
            className={`p-2 rounded-xl cursor-pointer transition-colors ${
              activeOverlay === 'settings' ? 'bg-[#8f9bff]/20 text-[#8f9bff]' : 'text-gray-400 hover:text-white hover:bg-[#262a3b]'
            }`}
            title="Настройки браузера"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. MAIN FULL-SCREEN VIEWPORT */}
      <div className="flex-1 relative overflow-hidden bg-[#0e1119] flex flex-col">
        
        {/* Dropdown Modals */}
        {activeOverlay && (
          <div className="absolute top-2 right-2 w-80 max-w-[92vw] bg-[#1e1e1e] border border-[#383838] rounded-2xl shadow-2xl z-40 p-4 text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#2e2e2e] mb-3">
              <div className="font-extrabold text-white uppercase tracking-wide text-xs flex items-center gap-2">
                {activeOverlay === 'history' && <History className="w-4 h-4 text-[#8f9bff]" />}
                {activeOverlay === 'downloads' && <Download className="w-4 h-4 text-[#8f9bff]" />}
                {activeOverlay === 'settings' && <Settings className="w-4 h-4 text-[#8f9bff]" />}
                <span>
                  {activeOverlay === 'history' && 'История просмотров'}
                  {activeOverlay === 'downloads' && 'Загруженные файлы'}
                  {activeOverlay === 'settings' && 'Настройки браузера'}
                </span>
              </div>
              <button
                onClick={() => setActiveOverlay(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#282c3d]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* History Overlay */}
            {activeOverlay === 'history' && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {browsingHistory.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      navigateTo(item.url);
                      setActiveOverlay(null);
                    }}
                    className="p-2.5 rounded-xl bg-[#12151e] hover:bg-[#262626] cursor-pointer border border-[#262a3b] transition-colors"
                  >
                    <div className="font-bold text-white truncate text-[11px]">{item.title}</div>
                    <div className="text-[10px] text-gray-500 font-mono truncate">{item.url}</div>
                    <div className="text-[9px] text-[#8f9bff] mt-0.5">{item.date}</div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setBrowsingHistory([]);
                    soundManager.playBeep(700, 0.05);
                  }}
                  className="w-full mt-2 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl border border-red-500/40 text-[11px] font-bold"
                >
                  Очистить историю
                </button>
              </div>
            )}

            {/* Downloads Overlay */}
            {activeOverlay === 'downloads' && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {downloadsList.map((dl, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#12151e] border border-[#262a3b]">
                    <div className="font-bold text-white text-[11px] truncate">{dl.name}</div>
                    <div className="text-[10px] text-gray-400 flex items-center justify-between mt-1">
                      <span>{dl.size}</span>
                      <span className="text-[#8f9bff] font-bold">{dl.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Settings Overlay */}
            {activeOverlay === 'settings' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-gray-300">
                  <span>Поисковая система:</span>
                  <span className="font-bold text-[#8f9bff]">Telegram 2</span>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span>SSL/TLS шифрование:</span>
                  <span className="font-bold text-[#8f9bff]">TLS 1.3 Active</span>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span>Аппаратное ускорение:</span>
                  <span className="font-bold text-[#8f9bff]">ВКЛ</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. CLEAN START PAGE OR BROWSER WEBPAGE */}
        {activeTab.url === 'about:blank' ? (
          // ULTRA CLEAN START PAGE (NO GIANT LISTS)
          <div className="flex-1 overflow-y-auto p-6 sm:p-12 flex flex-col items-center justify-center max-w-2xl mx-auto w-full text-center">
            
            {/* Minimal Logo */}
            <div className="w-16 h-16 rounded-3xl bg-[#8f9bff]/15 border border-[#8f9bff]/40 flex items-center justify-center text-[#8f9bff] mb-4 shadow-[0_0_35px_rgba(143,155,255,0.2)]">
              <Globe className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
              Telegram 2 Browser
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mb-8 max-w-md">
              Быстрый веб-поиск и приватный просмотр страниц на весь экран.
            </p>

            {/* Centered Large Search Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigateTo(inputUrl);
              }}
              className="w-full mb-8"
            >
              <div className="w-full flex items-center bg-[#161a26] border-2 border-[#333] hover:border-[#8f9bff]/60 focus-within:border-[#8f9bff] rounded-2xl px-4 py-3 shadow-xl transition-all">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="Поиск в интернете или URL..."
                  className="w-full bg-transparent text-white placeholder-gray-500 outline-none text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  title="Поиск по фото"
                  className="mr-2 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-extrabold text-xs rounded-xl transition-all cursor-pointer active:scale-95"
                >
                  Найти
                </button>
              </div>
            </form>

            {/* Clean, Curated Shortcuts (Just 4 Essential Sites) */}
            <div className="w-full">
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3 text-left">
                Быстрый доступ
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                {TOP_SHORTCUTS.map((site, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      triggerHaptic('tap');
                      navigateTo(site.url);
                    }}
                    className="p-3 bg-[#161a26] hover:bg-[#242424] active:scale-95 border border-[#2d2d2d] hover:border-[#8f9bff]/50 rounded-2xl flex flex-col items-center gap-1.5 transition-all cursor-pointer group shadow-sm hover:shadow-[0_0_15px_rgba(143,155,255,0.15)]"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{site.icon}</span>
                    <span className="text-xs font-bold text-white group-hover:text-[#8f9bff] truncate max-w-full">
                      {site.name}
                    </span>
                    <span className="text-[10px] text-gray-500 truncate max-w-full font-sans">
                      {site.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        ) : (
          // REALISTIC "SITE CAN'T BE REACHED" PAGE
          (() => {
            const err = BROWSER_ERRORS[(hashStr(activeTab.url) + attempt) % BROWSER_ERRORS.length];
            const host = hostOf(activeTab.url);
            const toneRing =
              err.tone === 'red'
                ? 'border-red-500/60 text-red-400 bg-red-500/15'
                : err.tone === 'amber'
                ? 'border-amber-500/60 text-amber-400 bg-amber-500/15'
                : 'border-[#3a3a3a] text-gray-300 bg-[#1e2232]';
            return (
              <div className="flex-1 overflow-y-auto p-5 sm:p-10 flex flex-col items-start justify-center max-w-xl mx-auto w-full text-left">
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-5 ${toneRing}`}>
                  {err.tone === 'red' ? <ShieldAlert className="w-7 h-7" /> : <WifiOff className="w-7 h-7" />}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">{err.title}</h3>
                <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                  {err.desc.replace('{host}', host)}
                </p>
                <ul className="text-sm text-gray-400 list-disc pl-5 space-y-1 mb-5">
                  {err.hints.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
                <div className="text-xs text-gray-500 font-mono mb-6 break-all">
                  {err.http ? err.http : err.code}
                  {err.http ? <span className="block mt-0.5">{activeTab.url}</span> : null}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRefresh}
                    className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-black rounded-full font-bold text-xs cursor-pointer"
                  >
                    Обновить
                  </button>
                  <button
                    onClick={handleHome}
                    className="px-5 py-2 bg-[#212536] hover:bg-[#333] text-white rounded-full font-bold text-xs cursor-pointer"
                  >
                    На главную
                  </button>
                </div>
              </div>
            );
          })()
        )}

      </div>

      {/* 5. FOOTER STATUS BAR */}
      <div className="px-4 py-1.5 bg-[#0e1119] border-t border-[#1e2232] flex items-center justify-between text-[11px] text-gray-400 font-mono shrink-0">
        <span className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-400 animate-ping' : 'bg-[#8f9bff]'}`} />
          {isLoading ? 'Загрузка ресурса...' : activeTab.url === 'about:blank' ? 'Готово к работе' : 'Сессия защищена SSL/TLS'}
        </span>
        <span>Вкладок открыто: {tabs.length}</span>
      </div>

    </div>
  );
};
