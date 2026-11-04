import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Link2,
  Plus,
  X,
  MoreVertical,
  Users,
  Flag,
  UserPlus,
  UserCheck,
  Bell,
  BellRing,
  BarChart3,
  FileText,
  Check,
  ChevronLeft,
  ExternalLink,
} from 'lucide-react';
import { triggerHaptic } from '../utils/soundEffects';

/* ---------- Данные ---------- */

interface SocialDef {
  id: string;
  name: string;
  icon: string;
  base: string;
}

export const SOCIALS: SocialDef[] = [
  { id: 'vk', name: 'ВКонтакте', icon: '🔵', base: 'https://vk.com/' },
  { id: 'max', name: 'MAX', icon: '🟣', base: 'https://max.ru/' },
  { id: 'ok', name: 'Одноклассники', icon: '🟠', base: 'https://ok.ru/' },
  { id: 'womanru', name: 'Woman.ru', icon: '🌸', base: 'https://www.woman.ru/' },
  { id: 'igroutka', name: 'Игрутка', icon: '🎮', base: 'https://igroutka.ru/' },
  { id: 'gosuslugi', name: 'Госуслуги', icon: '🏛️', base: 'https://www.gosuslugi.ru/' },
  { id: 'rutube', name: 'Rutube', icon: '📺', base: 'https://rutube.ru/' },
  { id: 'youtube', name: 'YouTube', icon: '▶️', base: 'https://www.youtube.com/' },
  { id: 'spotify', name: 'Spotify', icon: '🎧', base: 'https://open.spotify.com/' },
  { id: 'yamusic', name: 'Яндекс Музыка', icon: '🎵', base: 'https://music.yandex.ru/' },
  { id: 'yapay', name: 'Яндекс Пэй', icon: '💳', base: 'https://pay.yandex.ru/' },
  { id: 'yauchebnik', name: 'Яндекс Учебник', icon: '📘', base: 'https://education.yandex.ru/' },
  { id: 'yaklass', name: 'ЯКласс', icon: '🎓', base: 'https://www.yaklass.ru/' },
  { id: 'rambler', name: 'Рамблер', icon: '🔶', base: 'https://www.rambler.ru/' },
  { id: 'telegram', name: 'Telegram', icon: '✈️', base: 'https://t.me/' },
  { id: 'instagram', name: 'Instagram', icon: '📷', base: 'https://www.instagram.com/' },
  { id: 'x', name: 'X', icon: '✖️', base: 'https://x.com/' },
  { id: 'discord', name: 'Discord', icon: '💬', base: 'https://discord.com/users/' },
  { id: 'duolingo', name: 'Duolingo', icon: '🦉', base: 'https://www.duolingo.com/profile/' },
  { id: 'clashroyale', name: 'Clash Royale', icon: '👑', base: 'https://clashroyale.com/' },
  { id: '2gis', name: '2ГИС', icon: '🗺️', base: 'https://2gis.ru/' },
  { id: 'sber', name: 'Сбербанк', icon: '🟢', base: 'https://www.sberbank.ru/' },
  { id: 'icq', name: 'ICQ', icon: '🌼', base: 'https://icq.com/' },
  { id: 'ie', name: 'Internet Explorer', icon: '🌐', base: 'https://www.microsoft.com/' },
];

interface SocialLink {
  id: string;
  handle: string;
}

interface Poll {
  question: string;
  options: { t: string; v: number }[];
  voted?: number;
}

interface Post {
  id: string;
  title: string;
  text: string;
  date: string;
  reactions: Record<string, number>;
  mine: string[];
  poll?: Poll;
}

interface ExtData {
  socials: SocialLink[];
  posts: Post[];
}

interface Group {
  id: string;
  name: string;
  members: string[];
}

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];
const ME = 'Вы';

const hashStr = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const seeded = (seed: number) => {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const load = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
};

const save = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

const DEMO_TITLES = [
  'Новый день', 'Планы на выходные', 'Что слушаю', 'Небольшая заметка', 'Вопрос к вам',
  'Итоги недели', 'Находка дня', 'Коротко о важном',
];
const DEMO_TEXTS = [
  'Сегодня удалось закончить дела раньше обычного, так что вечер свободен.',
  'Думаю, куда выбраться в выходные. Если есть идеи — пишите.',
  'Наконец-то разобрался с настройками, всё работает стабильно.',
  'Давно не публиковал ничего. Решил вернуться и поделиться мыслями.',
  'Собрал небольшую подборку полезных ссылок, скоро поделюсь.',
  'Неделя выдалась насыщенной, но результатом доволен.',
];

const makeSeed = (name: string): ExtData => {
  const rnd = seeded(hashStr(name));
  const count = 3 + Math.floor(rnd() * 3);
  const pool = [...SOCIALS].sort(() => rnd() - 0.5).slice(0, count);
  const slug = `user${hashStr(name) % 9000 + 1000}`;
  const postCount = 1 + Math.floor(rnd() * 3);
  const posts: Post[] = Array.from({ length: postCount }, (_, i) => {
    const reactions: Record<string, number> = {};
    REACTIONS.forEach((r) => {
      if (rnd() > 0.5) reactions[r] = 1 + Math.floor(rnd() * 25);
    });
    const d = new Date(Date.now() - (i + 1) * 86400000 * (1 + Math.floor(rnd() * 3)));
    return {
      id: `seed-${i}`,
      title: DEMO_TITLES[Math.floor(rnd() * DEMO_TITLES.length)],
      text: DEMO_TEXTS[Math.floor(rnd() * DEMO_TEXTS.length)],
      date: d.toLocaleDateString('ru-RU'),
      reactions,
      mine: [],
    };
  });
  return { socials: pool.map((s) => ({ id: s.id, handle: slug })), posts };
};

const DEFAULT_GROUPS: Group[] = [
  { id: 'g-friends', name: 'Друзья', members: [ME] },
  { id: 'g-work', name: 'Работа', members: [ME] },
  { id: 'g-family', name: 'Семья', members: [ME] },
];

/* ---------- Хранилище ---------- */

const useExtData = (profileKey: string, isOwn: boolean) => {
  const storageKey = `profile_ext_${profileKey}`;
  const [data, setData] = useState<ExtData>(() => {
    const stored = load<ExtData | null>(storageKey, null);
    if (stored) return stored;
    const initial = isOwn ? { socials: [], posts: [] } : makeSeed(profileKey);
    save(storageKey, initial);
    return initial;
  });
  const update = useCallback(
    (fn: (d: ExtData) => ExtData) => {
      setData((prev) => {
        const next = fn(prev);
        save(storageKey, next);
        return next;
      });
    },
    [storageKey]
  );
  return [data, update] as const;
};

/* ---------- Статистика под именем ---------- */

export const ProfileStats: React.FC<{
  profileKey: string;
  isOwn: boolean;
  status: string;
  about?: string;
  music?: string;
  accent?: string;
}> = ({ profileKey, isOwn, status, about, music, accent = '#8f9bff' }) => {
  const info = useMemo(() => {
    const rnd = seeded(hashStr(profileKey + '-stats'));
    const subs = isOwn ? 0 : Math.floor(rnd() * 4800) + 12;
    const track =
      isOwn ? music || '' : rnd() > 0.8 ? ['Кино — Группа крови', 'Земфира — Дождь', 'Монеточка — Каждый раз'][Math.floor(rnd() * 3)] : '';
    const icons = ['🌅', '🍕', '🎸', '🐶', '🏔️', '☕', '🎬', '🚲'];
    const stories = Array.from({ length: 3 }, (_, i) => ({
      icon: icons[Math.floor(rnd() * icons.length)],
      label: i === 0 ? 'Сегодня' : i === 1 ? 'Вчера' : '2 дня назад',
    }));
    return { subs, track, stories };
  }, [profileKey, isOwn, music]);

  const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex items-start justify-between gap-3 py-1.5 border-b border-white/5 last:border-0">
      <span className="text-[11px] text-gray-500 shrink-0">{label}</span>
      <span className="text-xs text-gray-200 text-right break-words min-w-0">{children}</span>
    </div>
  );

  return (
    <div className="bg-[#141824] border border-[#222840] rounded-2xl px-3.5 py-2">
      <Row label="Подписчики">
        <span className="font-bold" style={{ color: accent }}>{info.subs}</span>
      </Row>
      <Row label="Статус">{status || 'В сети'}</Row>
      <Row label="Сейчас слушает">{info.track || '—'}</Row>
      <Row label="О себе">{about ? (about.length > 120 ? about.slice(0, 120) + '…' : about) : '—'}</Row>
      <div className="pt-2">
        <div className="text-[11px] text-gray-500 mb-1.5">Последние истории</div>
        <div className="flex gap-3">
          {info.stories.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className="w-11 h-11 rounded-full p-[2px] flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${accent}, #222840)` }}
              >
                <div className="w-full h-full rounded-full bg-[#0f121a] flex items-center justify-center text-lg">{s.icon}</div>
              </div>
              <span className="text-[9px] text-gray-500">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------- Угловые элементы и панель постов ---------- */

type Panel = null | 'socials' | 'menu' | 'posts';

export const ProfileExtras: React.FC<{
  profileKey: string;
  isOwn: boolean;
  accent?: string;
  topOffset?: number;
}> = ({ profileKey, isOwn, accent = '#8f9bff', topOffset = 56 }) => {
  const [data, update] = useExtData(profileKey, isOwn);
  const [panel, setPanel] = useState<Panel>(null);
  const [toast, setToast] = useState('');

  // социальные сети
  const [picking, setPicking] = useState(false);
  const [pendingSocial, setPendingSocial] = useState<SocialDef | null>(null);
  const [handle, setHandle] = useState('');

  // посты
  const [composing, setComposing] = useState<'post' | 'poll' | null>(null);
  const [pTitle, setPTitle] = useState('');
  const [pText, setPText] = useState('');
  const [pollQ, setPollQ] = useState('');
  const [pollOpts, setPollOpts] = useState(['', '']);

  // меню взаимодействия
  const [groups, setGroups] = useState<Group[]>(() => load<Group[]>('profile_groups', DEFAULT_GROUPS));
  const [relations, setRelations] = useState<{ friends: string[]; subs: string[] }>(() =>
    load('profile_relations', { friends: [], subs: [] })
  );
  const [groupMode, setGroupMode] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(t);
  }, [toast]);

  const closeAll = () => {
    setPanel(null);
    setPicking(false);
    setPendingSocial(null);
    setGroupMode(false);
    setComposing(null);
  };

  const saveGroups = (g: Group[]) => {
    setGroups(g);
    save('profile_groups', g);
  };
  const saveRelations = (r: { friends: string[]; subs: string[] }) => {
    setRelations(r);
    save('profile_relations', r);
  };

  /* соцсети */
  const addSocial = () => {
    if (!pendingSocial) return;
    const clean = handle.trim().replace(/^@/, '');
    if (!clean) return;
    update((d) => ({ ...d, socials: [...d.socials, { id: pendingSocial.id, handle: clean }] }));
    setPendingSocial(null);
    setPicking(false);
    setHandle('');
  };
  const removeSocial = (id: string) => update((d) => ({ ...d, socials: d.socials.filter((s) => s.id !== id) }));

  /* посты */
  const publishPost = () => {
    if (!pTitle.trim() && !pText.trim()) return;
    const post: Post = {
      id: `p-${Date.now()}`,
      title: pTitle.trim() || 'Без заголовка',
      text: pText.trim(),
      date: new Date().toLocaleDateString('ru-RU'),
      reactions: {},
      mine: [],
    };
    update((d) => ({ ...d, posts: [post, ...d.posts] }));
    setPTitle('');
    setPText('');
    setComposing(null);
  };
  const publishPoll = () => {
    const opts = pollOpts.map((o) => o.trim()).filter(Boolean);
    if (!pollQ.trim() || opts.length < 2) return;
    const post: Post = {
      id: `p-${Date.now()}`,
      title: 'Опрос',
      text: '',
      date: new Date().toLocaleDateString('ru-RU'),
      reactions: {},
      mine: [],
      poll: { question: pollQ.trim(), options: opts.map((t) => ({ t, v: 0 })) },
    };
    update((d) => ({ ...d, posts: [post, ...d.posts] }));
    setPollQ('');
    setPollOpts(['', '']);
    setComposing(null);
  };
  const toggleReaction = (postId: string, emoji: string) =>
    update((d) => ({
      ...d,
      posts: d.posts.map((p) => {
        if (p.id !== postId) return p;
        const has = p.mine.includes(emoji);
        const reactions = { ...p.reactions, [emoji]: Math.max(0, (p.reactions[emoji] || 0) + (has ? -1 : 1)) };
        if (!reactions[emoji]) delete reactions[emoji];
        return { ...p, reactions, mine: has ? p.mine.filter((e) => e !== emoji) : [...p.mine, emoji] };
      }),
    }));
  const vote = (postId: string, idx: number) =>
    update((d) => ({
      ...d,
      posts: d.posts.map((p) => {
        if (p.id !== postId || !p.poll || p.poll.voted !== undefined) return p;
        const options = p.poll.options.map((o, i) => (i === idx ? { ...o, v: o.v + 1 } : o));
        return { ...p, poll: { ...p.poll, options, voted: idx } };
      }),
    }));

  /* меню */
  const addToGroup = (g: Group) => {
    if (!g.members.includes(profileKey)) {
      saveGroups(groups.map((x) => (x.id === g.id ? { ...x, members: [...x.members, profileKey] } : x)));
    }
    setToast(`Участник добавлен в группу «${g.name}»`);
    closeAll();
  };
  const createGroup = () => {
    const name = newGroupName.trim();
    if (!name) return;
    const g: Group = { id: `g-${Date.now()}`, name, members: [ME, profileKey] };
    saveGroups([...groups, g]);
    setNewGroupName('');
    setToast(`Группа «${name}» создана, участник добавлен`);
    closeAll();
  };
  const report = () => {
    setToast('Жалоба отправлена на рассмотрение');
    closeAll();
  };
  const toggleFriend = () => {
    const is = relations.friends.includes(profileKey);
    saveRelations({ ...relations, friends: is ? relations.friends.filter((x) => x !== profileKey) : [...relations.friends, profileKey] });
    setToast(is ? 'Удалён из друзей' : 'Заявка в друзья отправлена');
    closeAll();
  };
  const toggleSub = () => {
    const is = relations.subs.includes(profileKey);
    saveRelations({ ...relations, subs: is ? relations.subs.filter((x) => x !== profileKey) : [...relations.subs, profileKey] });
    setToast(is ? 'Вы отписались' : 'Вы подписались');
    closeAll();
  };

  const isFriend = relations.friends.includes(profileKey);
  const isSub = relations.subs.includes(profileKey);
  const availableSocials = SOCIALS.filter((s) => !data.socials.some((x) => x.id === s.id));
  const cornerBtn =
    'w-9 h-9 rounded-full bg-[#141824]/90 border border-white/10 hover:border-white/30 text-gray-200 flex items-center justify-center cursor-pointer backdrop-blur-md transition-colors';

  return (
    <>
      {/* Левый угол: соцсети */}
      <button
        onClick={() => {
          triggerHaptic('tap');
          setPanel(panel === 'socials' ? null : 'socials');
          setPicking(false);
        }}
        className={`absolute left-3 z-30 ${cornerBtn}`}
        style={{ top: topOffset }}
        title="Социальные сети"
      >
        <Link2 className="w-4 h-4" style={{ color: accent }} />
      </button>

      {/* Правый угол: меню взаимодействия */}
      <button
        onClick={() => {
          triggerHaptic('tap');
          setPanel(panel === 'menu' ? null : 'menu');
          setGroupMode(false);
        }}
        className={`absolute right-3 z-30 ${cornerBtn}`}
        style={{ top: topOffset }}
        title="Взаимодействие"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {/* Сбоку: вертикальная вкладка постов */}
      <button
        onClick={() => {
          triggerHaptic('tap');
          setPanel(panel === 'posts' ? null : 'posts');
          setComposing(null);
        }}
        className="absolute right-0 z-30 px-1.5 py-3 rounded-l-xl bg-[#141824]/95 border border-r-0 border-white/10 hover:border-white/30 text-[10px] font-extrabold uppercase tracking-widest text-gray-200 cursor-pointer"
        style={{ top: '42%', writingMode: 'vertical-rl' }}
        title="Посты"
      >
        <span style={{ color: accent }}>Посты · {data.posts.length}</span>
      </button>

      {/* Затемнение при открытых панелях */}
      {panel && <div className="absolute inset-0 z-40 bg-black/40" onClick={closeAll} />}

      {/* Панель: соцсети */}
      {panel === 'socials' && (
        <div className="absolute left-3 z-50 w-64 max-h-[60%] overflow-y-auto bg-[#171b27] border border-white/10 rounded-2xl shadow-2xl p-3" style={{ top: topOffset + 44 }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-white uppercase tracking-wide">Социальные сети</span>
            {isOwn && !picking && !pendingSocial && (
              <button
                onClick={() => setPicking(true)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-black cursor-pointer"
                style={{ background: accent }}
                title="Добавить"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          {!picking && !pendingSocial && (
            <div className="space-y-1.5">
              {data.socials.length === 0 && (
                <div className="text-xs text-gray-500 py-3 text-center">
                  {isOwn ? 'Пока ничего не добавлено' : 'Ссылок нет'}
                </div>
              )}
              {data.socials.map((l) => {
                const def = SOCIALS.find((s) => s.id === l.id);
                if (!def) return null;
                return (
                  <div key={l.id} className="flex items-center gap-2 p-2 rounded-xl bg-[#1e2232] border border-white/5">
                    <span className="text-lg">{def.icon}</span>
                    <button
                      className="flex-1 min-w-0 text-left cursor-pointer"
                      onClick={() => window.open(def.base + (['telegram', 'instagram', 'x', 'vk', 'discord', 'duolingo'].includes(def.id) ? l.handle : ''), '_blank', 'noopener,noreferrer')}
                    >
                      <div className="text-xs font-bold text-white truncate">{def.name}</div>
                      <div className="text-[10px] text-gray-500 truncate">@{l.handle}</div>
                    </button>
                    <ExternalLink className="w-3 h-3 text-gray-500" />
                    {isOwn && (
                      <button onClick={() => removeSocial(l.id)} className="text-gray-500 hover:text-red-400 cursor-pointer" title="Убрать">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {isOwn && picking && !pendingSocial && (
            <div>
              <button onClick={() => setPicking(false)} className="flex items-center gap-1 text-[11px] text-gray-400 mb-2 cursor-pointer">
                <ChevronLeft className="w-3.5 h-3.5" /> Назад
              </button>
              <div className="grid grid-cols-2 gap-1.5">
                {availableSocials.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setPendingSocial(s);
                      setHandle('');
                    }}
                    className="flex items-center gap-1.5 p-2 rounded-xl bg-[#1e2232] border border-white/5 hover:border-white/30 text-left cursor-pointer"
                  >
                    <span>{s.icon}</span>
                    <span className="text-[11px] text-white truncate">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {isOwn && pendingSocial && (
            <div className="space-y-2">
              <div className="text-xs text-white font-bold">
                {pendingSocial.icon} {pendingSocial.name}
              </div>
              <input
                autoFocus
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="Ваш логин или ссылка"
                className="w-full bg-[#0f121a] border border-white/10 focus:border-white/40 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
              <div className="flex gap-2">
                <button onClick={() => setPendingSocial(null)} className="flex-1 py-2 rounded-xl bg-[#1e2232] text-gray-300 text-xs font-bold cursor-pointer">
                  Назад
                </button>
                <button onClick={addSocial} className="flex-1 py-2 rounded-xl text-black text-xs font-extrabold cursor-pointer" style={{ background: accent }}>
                  Добавить
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Панель: меню взаимодействия */}
      {panel === 'menu' && (
        <div className="absolute right-3 z-50 w-64 max-h-[65%] overflow-y-auto bg-[#171b27] border border-white/10 rounded-2xl shadow-2xl p-2" style={{ top: topOffset + 44 }}>
          {!groupMode ? (
            <>
              {!isOwn && (
                <>
                  <button onClick={() => setGroupMode(true)} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 text-xs text-white cursor-pointer">
                    <Users className="w-4 h-4 text-sky-400" /> Добавить в группу
                  </button>
                  <button onClick={toggleFriend} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 text-xs text-white cursor-pointer">
                    {isFriend ? <UserCheck className="w-4 h-4 text-emerald-400" /> : <UserPlus className="w-4 h-4 text-emerald-400" />}
                    {isFriend ? 'Удалить из друзей' : 'Добавить в друзья'}
                  </button>
                  <button onClick={toggleSub} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 text-xs text-white cursor-pointer">
                    {isSub ? <BellRing className="w-4 h-4 text-amber-400" /> : <Bell className="w-4 h-4 text-amber-400" />}
                    {isSub ? 'Отписаться' : 'Подписаться'}
                  </button>
                  <div className="h-px bg-white/10 my-1" />
                </>
              )}
              <button onClick={report} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 text-xs text-white cursor-pointer">
                <Flag className="w-4 h-4 text-red-400" /> Пожаловаться
              </button>
            </>
          ) : (
            <div className="p-1">
              <button onClick={() => setGroupMode(false)} className="flex items-center gap-1 text-[11px] text-gray-400 mb-2 cursor-pointer">
                <ChevronLeft className="w-3.5 h-3.5" /> Назад
              </button>
              <div className="text-[11px] text-gray-500 mb-1">Ваши группы</div>
              <div className="space-y-1 mb-3">
                {groups.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => addToGroup(g)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#1e2232] hover:bg-[#2a2a2a] text-xs text-white cursor-pointer"
                  >
                    <span className="truncate">{g.name}</span>
                    {g.members.includes(profileKey) && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-gray-500 mb-1">Новая группа</div>
              <div className="flex gap-1.5">
                <input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Название"
                  className="flex-1 min-w-0 bg-[#0f121a] border border-white/10 focus:border-white/40 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
                <button onClick={createGroup} className="px-3 rounded-xl text-black text-xs font-extrabold cursor-pointer" style={{ background: accent }}>
                  Создать
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Панель: посты (вертикальная, сбоку) */}
      {panel === 'posts' && (
        <div className="absolute top-0 bottom-0 right-0 z-50 w-[82%] max-w-xs bg-[#12151e] border-l border-white/10 shadow-2xl flex flex-col">
          <div className="p-3 border-b border-white/10 flex items-center justify-between shrink-0">
            <span className="text-xs font-extrabold text-white uppercase tracking-wide">Посты</span>
            <button onClick={closeAll} className="text-gray-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {isOwn && !composing && (
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setComposing('post')} className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-black text-[11px] font-extrabold cursor-pointer" style={{ background: accent }}>
                  <FileText className="w-3.5 h-3.5" /> Пост
                </button>
                <button onClick={() => setComposing('poll')} className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#1e2232] border border-white/10 text-white text-[11px] font-extrabold cursor-pointer">
                  <BarChart3 className="w-3.5 h-3.5" /> Опрос
                </button>
              </div>
            )}

            {isOwn && composing === 'post' && (
              <div className="space-y-2 bg-[#171b27] border border-white/10 rounded-2xl p-3">
                <input value={pTitle} onChange={(e) => setPTitle(e.target.value)} placeholder="Заголовок" className="w-full bg-[#0f121a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none" />
                <textarea value={pText} onChange={(e) => setPText(e.target.value)} placeholder="Описание" rows={4} className="w-full bg-[#0f121a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none resize-none" />
                <div className="flex gap-2">
                  <button onClick={() => setComposing(null)} className="flex-1 py-2 rounded-xl bg-[#1e2232] text-gray-300 text-xs font-bold cursor-pointer">Отмена</button>
                  <button onClick={publishPost} className="flex-1 py-2 rounded-xl text-black text-xs font-extrabold cursor-pointer" style={{ background: accent }}>Опубликовать</button>
                </div>
              </div>
            )}

            {isOwn && composing === 'poll' && (
              <div className="space-y-2 bg-[#171b27] border border-white/10 rounded-2xl p-3">
                <input value={pollQ} onChange={(e) => setPollQ(e.target.value)} placeholder="Вопрос" className="w-full bg-[#0f121a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none" />
                {pollOpts.map((o, i) => (
                  <input
                    key={i}
                    value={o}
                    onChange={(e) => setPollOpts((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))}
                    placeholder={`Вариант ${i + 1}`}
                    className="w-full bg-[#0f121a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                ))}
                {pollOpts.length < 5 && (
                  <button onClick={() => setPollOpts((p) => [...p, ''])} className="text-[11px] text-gray-400 hover:text-white cursor-pointer">
                    + Добавить вариант
                  </button>
                )}
                <div className="flex gap-2">
                  <button onClick={() => setComposing(null)} className="flex-1 py-2 rounded-xl bg-[#1e2232] text-gray-300 text-xs font-bold cursor-pointer">Отмена</button>
                  <button onClick={publishPoll} className="flex-1 py-2 rounded-xl text-black text-xs font-extrabold cursor-pointer" style={{ background: accent }}>Создать</button>
                </div>
              </div>
            )}

            {data.posts.length === 0 && !composing && (
              <div className="text-xs text-gray-500 text-center py-8">Постов пока нет</div>
            )}

            {data.posts.map((p) => {
              const total = p.poll ? p.poll.options.reduce((s, o) => s + o.v, 0) : 0;
              return (
                <div key={p.id} className="bg-[#171b27] border border-white/10 rounded-2xl p-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-sm font-extrabold text-white truncate">{p.title}</h4>
                    <span className="text-[10px] text-gray-500 shrink-0">{p.date}</span>
                  </div>
                  {p.text && <p className="text-xs text-gray-300 mt-1.5 leading-relaxed break-words">{p.text}</p>}

                  {p.poll && (
                    <div className="mt-2 space-y-1.5">
                      <div className="text-xs font-bold text-white">{p.poll.question}</div>
                      {p.poll.options.map((o, i) => {
                        const pct = total ? Math.round((o.v / total) * 100) : 0;
                        const voted = p.poll!.voted !== undefined;
                        return (
                          <button
                            key={i}
                            onClick={() => vote(p.id, i)}
                            disabled={voted}
                            className="relative w-full text-left overflow-hidden rounded-xl bg-[#0f121a] border border-white/10 px-3 py-2 text-xs text-white cursor-pointer disabled:cursor-default"
                          >
                            {voted && <span className="absolute inset-y-0 left-0 opacity-30" style={{ width: `${pct}%`, background: accent }} />}
                            <span className="relative flex items-center justify-between gap-2">
                              <span className="truncate">{o.t}{p.poll!.voted === i ? ' ✓' : ''}</span>
                              {voted && <span className="text-[10px] text-gray-300">{pct}%</span>}
                            </span>
                          </button>
                        );
                      })}
                      <div className="text-[10px] text-gray-500">Голосов: {total}</div>
                    </div>
                  )}

                  {/* Реакции ниже */}
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-white/5">
                    {REACTIONS.map((r) => {
                      const mine = p.mine.includes(r);
                      return (
                        <button
                          key={r}
                          onClick={() => toggleReaction(p.id, r)}
                          className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 border cursor-pointer transition-colors ${
                            mine ? 'bg-white/15 border-white/40' : 'bg-[#0f121a] border-white/10 hover:border-white/30'
                          }`}
                        >
                          <span>{r}</span>
                          {!!p.reactions[r] && <span className="text-[10px] text-gray-300">{p.reactions[r]}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Тост */}
      {toast && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-full bg-black/90 border border-white/15 text-xs text-white shadow-xl whitespace-nowrap">
          {toast}
        </div>
      )}
    </>
  );
};

/* ---------- Просмотр профиля другого участника ---------- */

export const ParticipantProfile: React.FC<{
  name: string;
  avatar: string;
  status: string;
  onClose: () => void;
}> = ({ name, avatar, status, onClose }) => {
  const accent = '#8f9bff';
  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-black/60 backdrop-blur-xs font-sans">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0f121a] border-l border-[#222840] shadow-[-10px_0_50px_rgba(0,0,0,0.9)] flex flex-col h-full overflow-hidden">
        <div className="p-3 border-b border-[#222840] flex items-center justify-between bg-[#12151e]/95 shrink-0">
          <span className="font-mono font-bold text-xs uppercase tracking-wider text-gray-300">Профиль участника</span>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pt-14 space-y-4">
          <div className="flex flex-col items-center">
            <div
              className="w-28 h-28 rounded-full bg-[#222840] border-4 flex items-center justify-center text-6xl overflow-hidden"
              style={{ borderColor: accent }}
            >
              {avatar && (avatar.startsWith('data:') || avatar.startsWith('http') || avatar.startsWith('blob:')) ? (
                <img src={avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                avatar
              )}
            </div>
            <h2 className="text-xl font-extrabold mt-3" style={{ color: accent }}>{name}</h2>
          </div>
          <ProfileStats profileKey={name} isOwn={false} status={status} accent={accent} />
        </div>

        <ProfileExtras profileKey={name} isOwn={false} accent={accent} topOffset={60} />
      </div>
    </div>
  );
};
