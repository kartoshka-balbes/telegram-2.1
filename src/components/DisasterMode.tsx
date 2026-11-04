import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, AlertTriangle, AlertCircle } from 'lucide-react';
import { useDisasterMode } from '../utils/disasterMode';

// Таймеры, на которые не влияет закрытие приложений
const nativeSetTimeout: typeof window.setTimeout = window.setTimeout.bind(window);
const nativeSetInterval: typeof window.setInterval = window.setInterval.bind(window);

type Generic = 'white' | 'android' | 'windows' | 'samsung';

interface ErrorDef {
  key: string;
  title: string;
  desc: string;
  special?:
    | 'failed' | 'avb' | 'oneui' | 'tux' | 'destroyed' | 'crashdump' | 'nocommand' | 'androidauto' | 'locked';
}

const DEFS: ErrorDef[] = [
  { key: 'memory', title: 'Недостаточно памяти', desc: 'Недостаточно свободной памяти для выполнения операции. Освободите место, удалив ненужные файлы или приложения, и повторите попытку. Доступно: 0 Б.' },
  { key: 'nonet', title: 'Отсутствует подключение к интернету', desc: 'Устройство не подключено к сети. Проверьте настройки Wi-Fi и мобильной передачи данных, отключите режим полёта и повторите попытку.' },
  { key: 'noresp', title: 'Приложение не отвечает', desc: 'Приложение не отвечает уже более 10 секунд. Вы можете подождать или принудительно закрыть его. Несохранённые данные могут быть потеряны.' },
  { key: 'cold', title: 'Переохлаждение устройства', desc: 'Температура аккумулятора ниже допустимой (−12 °C). Для защиты устройства ограничена производительность, зарядка недоступна. Переместите устройство в тёплое место.' },
  { key: 'hot', title: 'Перегрев устройства', desc: 'Температура устройства превышает допустимую (58 °C). Зарядка, камера и фонарик отключены. Дайте устройству остыть и не используйте его до снижения температуры.' },
  { key: 'virus', title: 'Обнаружен вирус', desc: 'Обнаружена вредоносная программа Trojan.AndroidOS.Agent.gen. Она может получать доступ к личным данным и сообщениям. Немедленно удалите заражённый объект.' },
  { key: 'knox', title: 'Knox: ошибка', desc: 'Knox Warranty Void: 0x1. Обнаружено несанкционированное изменение системного программного обеспечения. Защищённые функции Samsung Knox отключены без возможности восстановления.' },
  { key: 'netblock', title: 'Блокировка сети', desc: 'Доступ к мобильной сети заблокирован оператором связи. Причина: IMEI устройства внесён в список ограничений. Обратитесь в службу поддержки оператора.' },
  { key: 'noos', title: 'Отсутствует операционная система', desc: 'Operating system not found. Загрузочный раздел отсутствует или повреждён. Установите операционную систему с помощью загрузочного носителя.' },
  { key: 'failed', title: 'FAILED', desc: 'Boot image verification failed (error 0x0000F4). Загрузка образа остановлена.', special: 'failed' },
  { key: 'avb', title: 'Avb Fail', desc: '', special: 'avb' },
  { key: 'update', title: 'Произошла ошибка во время обновления', desc: 'Не удалось применить обновление системы (код 0x800F0922). Установка прервана, внесённые изменения отменены. Повторите попытку при стабильном подключении и уровне заряда выше 50%.' },
  { key: 'oneui', title: 'One UI', desc: '', special: 'oneui' },
  { key: 'encrypt', title: 'Шифрование не удалось', desc: 'Шифрование было прервано и не может быть завершено. В результате данные на устройстве стали недоступны. Чтобы продолжить использование, необходимо выполнить сброс до заводских настроек.' },
  { key: 'noandroid', title: 'Не удалось загрузить систему Android', desc: 'Данные могут быть повреждены. Если это сообщение появляется снова, возможно, потребуется сброс до заводских настроек, при котором будут удалены все данные пользователя на устройстве.' },
  { key: 'swfail', title: 'Сбой установки ПО', desc: 'Не удалось установить программное обеспечение. Возникла проблема при загрузке или установке обновления. Подключитесь к Smart Switch на компьютере и выполните аварийное восстановление.' },
  { key: 'tux', title: 'Ошибка Tux', desc: '', special: 'tux' },
  { key: 'destroyed', title: 'Система была уничтожена', desc: 'Устройство повреждено и не заслуживает доверия. Загрузка заблокирована. Обратитесь в сервисный центр.', special: 'destroyed' },
  { key: 'data', title: 'Не удалось открыть раздел data', desc: 'Failed to mount /data (Invalid argument). Раздел данных повреждён или зашифрован неподдерживаемым ключом. Доступ к пользовательским данным невозможен.' },
  { key: 'locked', title: 'УСТРОЙСТВО ЗАБЛОКИРОВАНО', desc: 'Устройство заблокировано защитой от сброса (FRP). Для разблокировки войдите в аккаунт Google, который использовался на устройстве ранее.', special: 'locked' },
  { key: 'crash', title: 'Qualcomm CrashDump Mode', desc: '', special: 'crashdump' },
  { key: 'shot', title: 'Не удалось сохранить скриншот', desc: 'Не удалось сохранить снимок экрана: приложение или ваша организация не разрешает создавать скриншоты, либо недостаточно места в хранилище.' },
  { key: 'lithium', title: 'УТЕЧКА ЛИТИЯ', desc: 'Обнаружена утечка электролита аккумулятора. Немедленно отключите зарядное устройство, выключите устройство и не прикасайтесь к нему без защитных перчаток. Обратитесь в сервисный центр.' },
  { key: 'region', title: 'Этот сервис не поддерживается в вашем регионе', desc: 'Выбранный сервис недоступен в вашей стране или регионе из-за ограничений лицензирования. Используйте другой сервис или обратитесь в поддержку.' },
  { key: 'camera', title: 'Сбой камеры', desc: 'Не удалось подключиться к камере. Перезапустите устройство. Если проблема сохранится, обратитесь в сервисный центр.' },
  { key: 'erreur', title: 'Erreur', desc: 'Une erreur s’est produite lors du traitement de votre demande. Veuillez réessayer plus tard ou contacter le service d’assistance.' },
  { key: 'nocmd', title: 'No command.', desc: '', special: 'nocommand' },
  { key: 'bootlock', title: 'Загрузчик заблокирован', desc: 'Загрузчик (bootloader) заблокирован. Установка неподписанных образов и модифицированной прошивки запрещена политикой безопасности устройства.' },
  { key: 'insecure', title: 'Ваше соединение не защищено', desc: 'Злоумышленники могут пытаться похитить ваши данные (например, пароли, сообщения или номера банковских карт). Сертификат сайта недействителен.' },
  { key: 'auto', title: 'Android Auto', desc: '', special: 'androidauto' },
  { key: 'incompat', title: 'Устройство несовместимо', desc: 'Ваше устройство несовместимо с этой версией приложения. Для установки требуется Android 14 или выше.' },
  { key: 'wifi', title: 'Сеть не защищена', desc: 'Данные, передаваемые через эту сеть, могут быть перехвачены третьими лицами. Не вводите пароли и данные банковских карт, пока не подключитесь к защищённой сети.' },
];

interface Win {
  id: number;
  def: ErrorDef;
  style: Generic;
  x: number;
  y: number;
}

const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
const WIN_W = 270;
const WIN_H = 210;
// Интервалы между появлением ошибок сокращены в 1,8 раза
const GAP_SCALE = 1.8;
const STYLES: Generic[] = ['white', 'android', 'windows', 'samsung'];

const Body: React.FC<{ w: Win; onClose: () => void }> = ({ w, onClose }) => {
  const { def, style } = w;
  const sp = def.special;

  const closeBtn = (cls: string) => (
    <button
      onClick={onClose}
      aria-label="Закрыть"
      className={`absolute top-1.5 right-1.5 p-1 rounded cursor-pointer ${cls}`}
    >
      <X className="w-3.5 h-3.5" />
    </button>
  );

  if (sp === 'failed') {
    return (
      <div className="relative w-full h-full bg-red-600 text-white p-4 flex flex-col items-center justify-center text-center">
        {closeBtn('hover:bg-black/30')}
        <div className="text-4xl font-black tracking-widest">FAILED</div>
        <p className="text-[11px] mt-3 leading-snug">{def.desc}</p>
      </div>
    );
  }
  if (sp === 'avb') {
    return (
      <div className="relative w-full h-full bg-sky-300 p-3 overflow-hidden font-mono text-[10px] leading-snug text-red-600 font-bold">
        {closeBtn('text-red-700 hover:bg-black/10')}
        <div>AVB Fail</div>
        <div>[verify_vbmeta_ret: 3]</div>
        <div>ERR: avb_slot_verify failed</div>
        <div>ERR: Failed to load boot image</div>
        <div>ERR: Invalid vbmeta signature</div>
        <div>[fastboot] boot partition: hash mismatch</div>
        <div>Check boot.img: AVB_SLOT_VERIFY_RESULT_ERROR_VERIFICATION</div>
        <div>Rebooting to recovery in 5 seconds...</div>
      </div>
    );
  }
  if (sp === 'oneui') {
    return (
      <div className="relative w-full h-full bg-black flex flex-col items-center justify-center">
        {closeBtn('text-gray-300 hover:bg-white/15')}
        <svg viewBox="0 0 100 90" className="w-20 h-20">
          <polygon points="50,5 97,85 3,85" fill="#facc15" />
          <rect x="46" y="32" width="8" height="30" rx="2" fill="#000" />
          <circle cx="50" cy="72" r="5" fill="#000" />
        </svg>
        <div className="text-white text-lg font-semibold mt-2">Error!</div>
      </div>
    );
  }
  if (sp === 'tux') {
    return (
      <div className="relative w-full h-full bg-black text-gray-200 p-3 flex flex-col items-center font-mono">
        {closeBtn('hover:bg-white/15')}
        <div className="text-5xl mt-1">🐧</div>
        <div className="text-[10px] mt-2 leading-snug w-full">
          <div>Kernel panic - not syncing:</div>
          <div>VFS: Unable to mount root fs on</div>
          <div>unknown-block(0,0)</div>
          <div className="text-gray-500 mt-1">CPU: 0 PID: 1 Comm: swapper/0 Not tainted</div>
          <div className="text-gray-500">---[ end Kernel panic ]---</div>
        </div>
      </div>
    );
  }
  if (sp === 'destroyed') {
    return (
      <div className="relative w-full h-full bg-[#171b27] text-white p-4 flex flex-col items-center justify-center text-center">
        {closeBtn('hover:bg-white/15')}
        <svg viewBox="0 0 100 90" className="w-24 h-24">
          <polygon points="50,4 98,86 2,86" fill="#dc2626" />
          <rect x="45" y="28" width="10" height="32" rx="3" fill="#fff" />
          <circle cx="50" cy="73" r="6" fill="#fff" />
        </svg>
        <div className="text-sm font-bold mt-2">Система была уничтожена</div>
        <p className="text-[10px] text-gray-400 mt-1 leading-snug">{def.desc}</p>
      </div>
    );
  }
  if (sp === 'crashdump') {
    return (
      <div className="relative w-full h-full bg-black text-white p-3 font-mono text-[10px] leading-snug">
        {closeBtn('hover:bg-white/15')}
        <div className="font-bold text-xs mb-1">Qualcomm CrashDump Mode</div>
        <div>Sahara protocol: waiting for host...</div>
        <div>RAM dump is in progress.</div>
        <div>Do not power off the device.</div>
        <div className="text-gray-400 mt-1">ERR_FATAL: apps_proc watchdog bite</div>
        <div className="text-gray-400">subsys: modem  crash reason: 0x4</div>
      </div>
    );
  }
  if (sp === 'nocommand') {
    return (
      <div className="relative w-full h-full bg-black flex flex-col items-center justify-center text-white">
        {closeBtn('hover:bg-white/15')}
        <div className="relative">
          <div className="text-6xl" style={{ transform: 'rotate(90deg)' }}>🤖</div>
          <svg viewBox="0 0 100 90" className="w-8 h-8 absolute -top-1 -right-3">
            <polygon points="50,4 98,86 2,86" fill="#dc2626" />
            <rect x="46" y="30" width="8" height="30" rx="2" fill="#fff" />
            <circle cx="50" cy="72" r="5" fill="#fff" />
          </svg>
        </div>
        <div className="text-sm mt-4 font-mono">No command.</div>
      </div>
    );
  }
  if (sp === 'androidauto') {
    return (
      <div className="relative w-full h-full bg-red-700 text-white p-4 flex flex-col justify-center">
        {closeBtn('hover:bg-black/30')}
        <div className="text-sm font-bold">Android Auto</div>
        <p className="text-[11px] mt-2 leading-snug">
          Can’t connect to your car. Something went wrong while starting Android Auto.
          Check your USB cable and try again. (Error code: 8)
        </p>
      </div>
    );
  }
  if (sp === 'locked') {
    return (
      <div className="relative w-full h-full bg-[#2b0a0a] text-white p-4 flex flex-col items-center justify-center text-center border-2 border-red-600">
        {closeBtn('hover:bg-white/15')}
        <div className="text-lg font-black text-red-500 tracking-wide">УСТРОЙСТВО ЗАБЛОКИРОВАНО</div>
        <p className="text-[11px] mt-2 leading-snug text-red-100">{def.desc}</p>
      </div>
    );
  }

  // Generic styles
  if (style === 'white') {
    return (
      <div className="relative w-full h-full bg-white text-black p-3">
        {closeBtn('text-gray-500 hover:bg-gray-200')}
        <div className="text-[11px] font-bold text-gray-700 pr-6 leading-tight">{def.title}</div>
        <div className="absolute inset-0 flex items-center justify-center px-5 pt-5 text-center text-[12px] leading-snug">
          {def.desc}
        </div>
      </div>
    );
  }
  if (style === 'windows') {
    return (
      <div className="relative w-full h-full bg-[#f0f0f0] text-black flex flex-col">
        <div className="flex items-center justify-between bg-white border-b border-gray-300 pl-2 pr-0.5 h-7 shrink-0">
          <span className="text-[11px] truncate pr-6">{def.title}</span>
          {closeBtn('text-black hover:bg-red-600 hover:text-white !top-0.5')}
        </div>
        <div className="flex-1 flex items-start gap-2.5 p-3 overflow-hidden">
          <AlertCircle className="w-7 h-7 text-red-600 shrink-0" />
          <p className="text-[11px] leading-snug">{def.desc}</p>
        </div>
        <div className="flex justify-end px-3 pb-2">
          <span className="px-5 py-0.5 border border-sky-600 bg-gray-100 text-[11px]">ОК</span>
        </div>
      </div>
    );
  }
  if (style === 'samsung') {
    return (
      <div className="relative w-full h-full bg-[#f6f6f6] text-black p-4 flex flex-col rounded-[22px]">
        {closeBtn('text-gray-500 hover:bg-gray-200 !top-3 !right-3')}
        <div className="text-[13px] font-semibold text-center pr-4 pl-4 leading-tight">{def.title}</div>
        <p className="text-[11px] text-center mt-2 leading-snug text-gray-700 flex-1 overflow-hidden">{def.desc}</p>
        <div className="mt-2 text-center text-[12px] font-semibold text-[#0381fe]">ОК</div>
      </div>
    );
  }
  // android
  return (
    <div className="relative w-full h-full bg-[#2d2d30] text-white p-4 flex flex-col rounded-[24px]">
      {closeBtn('text-gray-300 hover:bg-white/15 !top-3 !right-3')}
      <div className="flex items-center gap-2 pr-6">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <div className="text-[13px] font-medium leading-tight">{def.title}</div>
      </div>
      <p className="text-[11px] mt-2 leading-snug text-gray-300 flex-1 overflow-hidden">{def.desc}</p>
      <div className="mt-2 text-right text-[12px] font-medium text-[#a8c7fa]">ОК</div>
    </div>
  );
};

export const DisasterMode: React.FC = () => {
  const active = useDisasterMode();
  const [wins, setWins] = useState<Win[]>([]);
  const idRef = useRef(0);
  const timers = useRef<number[]>([]);
  const lastDefRef = useRef<string>('');

  const spawn = useCallback(() => {
    const id = ++idRef.current;
    let def = pick(DEFS);
    if (def.key === lastDefRef.current) def = pick(DEFS);
    lastDefRef.current = def.key;
    const maxX = Math.max(0, window.innerWidth - WIN_W - 4);
    const maxY = Math.max(0, window.innerHeight - WIN_H - 4);
    const w: Win = {
      id,
      def,
      style: pick(STYLES),
      x: Math.floor(Math.random() * (maxX + 1)),
      y: Math.floor(Math.random() * (maxY + 1)),
    };
    setWins((prev) => [...prev.slice(-59), w]);
  }, []);

  useEffect(() => {
    const clear = () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };
    if (!active) {
      clear();
      setWins([]);
      return;
    }

    const t = (fn: () => void, ms: number) => timers.current.push(nativeSetTimeout(fn, ms));

    // 0–3 с: 3–5 ошибок в разных частях экрана
    const first = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < first; i++) {
      t(spawn, Math.floor(((i / first) * 2800 + Math.random() * 200) / GAP_SCALE));
    }
    // 4–7 с: количество ошибок увеличивается в 1,5 раза
    const extra = Math.max(1, Math.round(first * 0.5));
    for (let i = 0; i < extra; i++) {
      t(spawn, 4000 + Math.floor(((i / extra) * 2800 + Math.random() * 200) / GAP_SCALE));
    }
    // после 7 с: каждые 0,7 с новая ошибка в случайном месте
    t(() => {
      spawn();
      const iv = nativeSetInterval(spawn, Math.round(700 / GAP_SCALE));
      timers.current.push(iv);
    }, 7000);

    return () => {
      timers.current.forEach((x) => {
        window.clearTimeout(x);
        window.clearInterval(x);
      });
      timers.current = [];
    };
  }, [active, spawn]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[300] pointer-events-none overflow-hidden">
      {wins.map((w, i) => (
        <div
          key={w.id}
          className="absolute pointer-events-auto shadow-[0_8px_30px_rgba(0,0,0,0.6)] overflow-hidden rounded-lg border border-black/30"
          style={{ left: w.x, top: w.y, width: WIN_W, height: WIN_H, zIndex: i }}
        >
          <Body w={w} onClose={() => setWins((prev) => prev.filter((x) => x.id !== w.id))} />
        </div>
      ))}
    </div>
  );
};
