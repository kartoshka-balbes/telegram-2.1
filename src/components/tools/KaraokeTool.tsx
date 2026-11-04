import React, { useState, useEffect, useRef } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Music, Play, RotateCcw } from 'lucide-react';
import { soundManager, triggerHaptic } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface SongData {
  title: string;
  speedMultiplier?: number;
  intervalMs: number;
  lyrics: string[];
}

const SONGS: Record<string, SongData> = {
  govnovoz: {
    title: 'Михаил Шелег — Говновоз',
    speedMultiplier: 1.0,
    intervalMs: 500,
    lyrics: [
      'Петрович, врубай насос!',
      'Сорок лет как под наркозом',
      'Я работал говновозом',
      'Ой-ой-ой...',
      'Ну ты даёшь!',
      'Не шофёром, не таксистом',
      'А вонючим говночистом',
      'Ой-ой-ой...',
      'Фу!',
      'За три сотенных бумажки',
      'На зиле возил говяшки',
      'Ой-ой-ой...',
      'И скажу вам, чтоб вы знали',
      'Ох, и много ж вы насрали!',
      'Ой-ой-ой...',
      'Говновоз, говновоз, говновоз',
      'Не отчистить говна от колёс',
      'Если даже духами обдать',
      'Всё равно продолжает вонять',
      'Говночист, говночист, говночист',
      'Должен быть закалён и плечист',
      'Говночист - заклинатель говна!',
      'Нужен людям во все времена',
      'Я не знаю, как там запад',
      'Может, там поменьше запах',
      'Ой-ой-ой...',
      'Наш насерет в таксофоне',
      'И напустит столько вони',
      'Ой-ой-ой...',
      'Вроде стали жрать полегче',
      'Значит надо срать поменьше',
      'Ой-ой-ой...',
      'Но откуда что берётся?',
      'Вдвое больше людям срётся',
      'Ой-ой-ой...',
      'Говновоз, говновоз, говновоз',
      'Много в мире тюльпанов и роз',
      'Много в мире конфет и вина',
      'Но ещё больше в мире говна',
      'Говночист, говночист, говночист',
      'Должен быть закалён и плечист',
      'Говночист - заклинатель говна!',
      'Нужен людям во все времена',
      'Ох, ёксель-моксель, кхе-кхе',
      'Сколько пластилина-то',
      'Петрович, осторожно, здесь склизко!',
      'А-а-а',
      'Приезжают к нам туристы',
      'Я б сказал, народ говнистый',
      'Ой-ой-ой...',
      'Вдоль по улице пройдётся',
      'И бананов обожрётся',
      'Ой-ой-ой...',
      'И такая вот зараза',
      'Гадит мимо унитаза',
      'Ой-ой-ой...',
      'Жопу пальцем вытирает',
      'За собою не смывает',
      'Ой-ой-ой...',
      'И опять говновоз, говновоз',
      'Подгоняй-ка поближе насос',
      'Доставай-ка черпалу свою',
      'И включай посильнее струю',
      'Говночист, говночист, говночист',
      'Должен быть закалён и плечист',
      'Говночист - заклинатель говна!',
      'Нужен людям во все времена',
      'И опять говновоз, говновоз',
      'Подгоняй-ка поближе насос',
      'Доставай-ка черпалу свою',
      'И включай посильнее струю',
      'Говночист, говночист, говночист',
      'Должен быть закалён и плечист',
      'Говночист - заклинатель говна!',
      'Нужен людям во все времена',
    ],
  },
  smeshariki: {
    title: 'Смешарики — Обормот',
    speedMultiplier: 1.2,
    intervalMs: Math.round(500 / 1.2), // ~417ms
    lyrics: [
      'Мне говорят, что я — балбес',
      'Что я вчера с берёзы слез',
      'Не человек, а динамит',
      'И подо мной земля горит',
      'И, в общем, правду говорят',
      'Но в этом я не виноват',
      'А виноват то в этом тот',
      'Кто у меня внутри живё-ё-ёт!!!',
      'Он у меня внутри живёт',
      'Он мне покоя не дает',
      'Он удивительный хитрец',
      'Он баламут и обормо-о-от!',
      'Он всё творит исподтишка',
      'Да так, что кружится башка',
      'Он Баламут и Обормот',
      'Он на слабо меня берёт!!!',
      'Я мог бы по-другому жить',
      'Я мог бы лобзиком пилить',
      'И даже, Боже мой, как знать',
      'Я мог бы марки собирать!!!',
      'И тихо сидя за столом',
      'Листал бы старый, книжный дом',
      'И все соседи, наконец, сказали бы',
      'Ты молодец!!!',
      'Он у меня внутри живёт!',
      'Он мне покоя не даёт!',
      'Он удивительный хитрец',
      'Он баламут и обормот!!!',
      'Он всё творит исподтишка',
      'Да так, что кружится башка',
      'Он баламут и обормот!!!',
      'Он на слабо меня берёт!!!',
      'Он у меня внутри живёт!',
      'Он мне покоя не даёт!',
      'Он удивительный хитрец',
      'Он баламут и обормот!!!',
      'Он всё творит исподтишка',
      'Да так, что кружится башка',
      'Он баламут и обормот!!!',
      'Он на слабо меня берёт!!!',
    ],
  },
  linkin: {
    title: 'Linkin Park — Points of Authority',
    speedMultiplier: 1.3,
    intervalMs: Math.round(500 / 1.3), // ~385ms
    lyrics: [
      'Forfeit the game before somebody else',
      'Takes you out of the frame',
      'And puts your name to shame',
      'Cover up your face, you can\'t run the race',
      'The pace is too fast, you just won\'t last',
      'You love the way I look at you',
      'While taking pleasure in the awful things you put me through',
      'You take away if I give in',
      'My life, my pride is broken',
      'You like to think you\'re never wrong',
      '(You live what you\'ve learned)',
      'You have to act like you\'re someone',
      '(You live what you\'ve learned)',
      'You want someone to hurt like you',
      '(You live what you\'ve learned)',
      'You love the things I say I\'ll do',
      'The way I hurt myself again just to get back at you',
      'You take away when I give in',
      'My life, my pride is broken',
      'You like to think you\'re never wrong',
      '(You live what you\'ve learned)',
      'You have to act like you\'re someone',
      '(You live what you\'ve learned)',
      'You want someone to hurt like you',
      '(You live what you\'ve learned)',
      'You wanna share what you have been through',
      '(You live what you\'ve learned)',
      'Forfeit the game before somebody else',
      'Takes you out of the frame',
      'And puts your name to shame',
      'Cover up your face, you can\'t run the race',
      'The pace is too fast, you just won\'t last',
      'Forfeit the game before somebody else',
      'Takes you out of the frame',
      'And puts your name to shame',
      'Cover up your face, you can\'t run the race',
      'The pace is too fast, you just won\'t last',
      'You like to think you\'re never wrong',
      '(You live what you\'ve learned)',
      'You have to act like you\'re someone',
      '(You live what you\'ve learned)',
      'You want someone to hurt like you',
      '(You live what you\'ve learned)',
      'You wanna share what you have been through',
      '(You live what you\'ve learned)',
      'You like to think you\'re never wrong (forfeit the game)',
      '(You live what you\'ve learned)',
      'You have to act like you\'re someone (forfeit the game)',
      '(You live what you\'ve learned)',
      'You want someone to hurt like you (forfeit the game)',
      '(You live what you\'ve learned)',
      'You wanna share what you have been through',
      '(You live what you\'ve learned)',
    ],
  },
  eminem: {
    title: 'Eminem — Rap God',
    speedMultiplier: 3.0,
    intervalMs: Math.round(500 / 3.0), // ~167ms
    lyrics: [
      'Look, I was gonna go easy on you, not to hurt your feelings',
      'But I\'m only going to get this one chance (six minutes, six minutes)',
      'Something\'s wrong, I can feel it (six minutes, Slim Shady, you\'re on)',
      'Just a feeling I\'ve got, like something\'s about to happen, but I don\'t know what',
      'If that means what I think it means, we\'re in trouble, big trouble',
      'And if he is as bananas as you say, I\'m not taking any chances',
      'You are just what the doc ordered',
      'I\'m beginnin\' to feel like a Rap God, Rap God',
      'All my people from the front to the back nod, back nod',
      'Now, who thinks their arms are long enough to slap box, slap box?',
      'They said I rap like a robot, so call me Rap-bot',
      'But for me to rap like a computer, it must be in my genes',
      'I got a laptop in my back pocket',
      'My pen\'ll go off when I half-cock it',
      'Got a fat knot from that rap profit',
      'Made a livin\' and a killin\' off it',
      'Ever since Bill Clinton was still in office',
      'With Monica Lewinsky feelin\' on his nutsack',
      'I\'m an MC still as honest, but as rude and as indecent as all hell',
      'Syllables, skill-a-holic (kill \'em all with)',
      'This flippity dippity-hippity hip-hop',
      'You don\'t really wanna get into a pissin\' match',
      'With this rappity brat, packin\' a MAC in the back of the Ac\'',
      'Backpack rap crap, yap-yap, yackety-yack',
      'And at the exact same time, I attempt these lyrical acrobat stunts while I\'m practicin\' that',
      'I\'ll still be able to break a motherfuckin\' table',
      'Over the back of a couple of faggots and crack it in half',
      'Only realized it was ironic, I was signed to Aftermath after the fact',
      'How could I not blow? All I do is drop F bombs',
      'Feel my wrath of attack, rappers are havin\' a rough time, period',
      'Here\'s a maxi pad, it\'s actually disastrously bad for the wack',
      'While I\'m masterfully constructing this masterpièce',
      '\'Cause I\'m beginnin\' to feel like a Rap God, Rap God',
      'All my people from the front to the back nod, back nod',
      'Now, who thinks their arms are long enough to slap box, slap box?',
      'Let me show you maintainin\' this shit ain\'t that hard, that hard',
      'Everybody want the key and the secret to rap immortality like Ι have got',
      'Well, to be truthful the blueprint\'s',
      'Simply rage and youthful exuberance',
      'Everybody loves to root for a nuisance',
      'Hit the Earth like an asteroid',
      'Did nothing but shoot for the Moon since (pew!)',
      'MCs get taken to school with this music',
      '\'Cause I use it as a vehicle to "Bus the rhyme"',
      'Now I lead a new school full of students',
      'Me? I\'m a product of Rakim, Lakim Shabazz, 2Pac, N.W.A, Cube',
      'Hey Doc, Ren, Yella, Eazy, thank you',
      'They got Slim inspired enough to one day grow up, blow up, and be in a position',
      'To meet Run-DMC, induct them into the motherfuckin\' Rock and Roll Hall of Fame',
      'Even though I\'ll walk in the church and burst in a ball of flames',
      'Only Hall of Fame I\'ll be inducted in is the alcohol of fame on the wall of shame',
      'You fags think it\'s all a game, \'til I walk a flock of flames',
      'Off a plank and, tell me what in the fuck are you thinkin\'?',
      'Little gay-lookin\' boy, so gay, I can barely say it with a straight face, lookin\' boy',
      'You\'re witnessin\' a mass-occur like you\'re watching a church gathering take place, lookin\' boy',
      '"Oy vey, that boy\'s gay, " that\'s all they say, lookin\' boy',
      'You get a thumbs up, pat on the back',
      'And a "Way to go" from your label every day, lookin\' boy',
      'Hey, lookin\' boy! What you say, lookin\' boy?',
      'I get a "Hell, yeah" from Dre, lookin\' boy',
      'I\'ma work for everything I have, never asked nobody for shit',
      'Get outta my face, lookin\' boy',
      'Basically, boy, you\'re never gonna be capable of keepin\' up with the same pace, lookin\' boy',
      '\'Cause I\'m beginnin\' to feel like a Rap God, Rap God',
      'All my people from the front to the back nod, back nod',
      'The way I\'m racin\' around the track, call me NASCAR, NASCAR',
      'Dale Earnhardt of the trailer park, the White Trash God',
      'Kneel before General Zod, this planet\'s Krypton, no, Asgard, Asgard',
      'So you\'ll be Thor and I\'ll be Odin',
      'You rodent, I\'m omnipotent',
      'Let off, then I\'m reloadin\'',
      'Immediately with these bombs I\'m totin\'',
      'And I should not be woken',
      'I\'m the walkin\' dead, but I\'m just a talkin\' head, a zombie floatin\'',
      'But I got your mom deep-throatin\'',
      'I\'m out my Ramen Noodle, we have nothin\' in common, poodle',
      'I\'m a Doberman, pinch yourself in the arm and pay homage, pupil',
      'It\'s me, my honesty\'s brutal',
      'But it\'s honestly futile if I don\'t utilize what I do though',
      'For good at least once in a while',
      'So I wanna make sure somewhere in this chicken scratch I scribble and doodle enough rhymes',
      'To maybe try to help get some people through tough times',
      'But I gotta keep a few punchlines',
      'Just in case \'cause even you unsigned',
      'Rappers are hungry lookin\' at me like it\'s lunchtime',
      'I know there was a time where once I was king of the underground',
      'But I still rap like I\'m on my Pharoahe Monch grind',
      'So I crunch rhymes, but sometimes when you combine',
      'Appeal with the skin color of mine',
      'You get too big and here they come tryin\'',
      'To censor you like that one line',
      'I said on "I\'m Back" from The Mathers LP one',
      'When I tried to say I\'ll take seven kids from Columbine',
      'Put \'em all in a line, add an AK-47, a revolver and a .9',
      'See if I get away with it now that I ain\'t as big as I was, but I\'m',
      'Morphin\' into an immortal, comin\' through the portal',
      'You\'re stuck in a time warp from 2004 though',
      'And I don\'t know what the fuck that you rhyme for',
      'You\'re pointless as Rapunzel with fuckin\' cornrows',
      'You write normal? Fuck being normal',
      'And I just bought a new raygun from the future',
      'Just to come and shoot ya, like when Fabolous made Ray J mad',
      '\'Cause Fab said he looked like a fag at Mayweather\'s pad',
      'Singin\' to a man while he played piano',
      'Man, oh man, that was a 24-7 special on the cable channel',
      'So Ray J went straight to the radio station the very next day',
      '"Hey Fab, I\'ma kill you"',
      'Lyrics comin\' at you at supersonic speed (JJ Fad)',
      'Uh, summa-lumma, dooma-lumma, you assumin\' I\'m a human',
      'What I gotta do to get it through to you?',
      'I\'m superhuman, innovative and I\'m made of rubber',
      'So that anything you say is ricochetin\' off of me, and it\'ll glue to you',
      'And I\'m devastating, more than ever demonstrating',
      'How to give a motherfuckin\' audience a feeling like it\'s levitating',
      'Never fading, and I know the haters are forever waiting',
      'For the day that they can say I fell off, they\'ll be celebrating',
      '\'Cause I know the way to get \'em motivated',
      'I make elevating music, you make elevator music',
      '"Oh, he\'s too mainstream"',
      'Well, that\'s what they do when they get jealous, they confuse it',
      '"It\'s not hip-hop, it\'s pop, " \'cause I found a hella way to fuse it',
      'With rock, shock rap with Doc',
      'Throw on "Lose Yourself" and make \'em lose it',
      'I don\'t know how to make songs like that',
      'I don\'t know what words to use',
      'Let me know when it occurs to you',
      'While I\'m rippin\' any one of these verses that versus you',
      'It\'s curtains, I\'m inadvertently hurtin\' you',
      'How many verses I gotta murder to prove',
      'That if you were half as nice, your songs you could sacrifice virgins too?',
      'Ugh, school flunky, pill junkie',
      'But look at the accolades, these skills brung me',
      'Full of myself, but still hungry',
      'I bully myself \'cause I make me do what I put my mind to',
      'And I\'m a million leagues above you',
      'Ill when I speak in tongues, but it\'s still tongue-in-cheek, fuck you',
      'I\'m drunk, so, Satan, take the fucking wheel',
      'I\'ma sleep in the front seat',
      'Bumpin\' Heavy D and the Boyz, still "Chunky but Funky"',
      'But in my head, there\'s something I can feel tugging and struggling',
      'Angels fight with devils and here\'s what they want from me',
      'They\'re askin\' me to eliminate some of the women hate',
      'But if you take into consideration the bitter hatred',
      'I have, then you may be a little patient',
      'And more sympathetic to the situation',
      'And understand the discrimination',
      'But fuck it, life\'s handin\' you lemons, make lemonade then',
      'But if I can\'t batter the women',
      'How the fuck am I supposed to bake them a cake then?',
      'Don\'t mistake him for Satan, it\'s a fatal mistake',
      'If you think I need to be overseas and take a vacation',
      'To trip abroad, and make her fall on her face and',
      'Don\'t be a retard, be a king? Think not',
      'Why be a king when you can be a God?',
    ],
  },
};

export const KaraokeTool: React.FC<ToolProps> = ({ onClose }) => {
  const [selectedSongKey, setSelectedSongKey] = useState<string | null>(null);
  const [activeLineIdx, setActiveLineIdx] = useState(0);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedSongKey && SONGS[selectedSongKey]) {
      const currentSong = SONGS[selectedSongKey];
      const totalLines = currentSong.lyrics.length;
      interval = setInterval(() => {
        setActiveLineIdx((prev) => (prev + 1) % totalLines);
      }, currentSong.intervalMs);
    }
    return () => clearInterval(interval);
  }, [selectedSongKey]);

  useEffect(() => {
    if (selectedSongKey && lineRefs.current[activeLineIdx]) {
      lineRefs.current[activeLineIdx]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeLineIdx, selectedSongKey]);

  return (
    <ToolWrapper title="Караоке" onClose={onClose}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col gap-5 py-3">
        {!selectedSongKey ? (
          /* Song Selector */
          <div className="flex-1 flex flex-col justify-center gap-3">
            <div className="text-center mb-2">
              <Music className="w-14 h-14 text-cyan-400 mx-auto mb-2 animate-bounce" />
              <h2 className="text-lg font-bold text-white uppercase font-mono tracking-wide">
                Выберите песню для караоке:
              </h2>
            </div>
            {Object.entries(SONGS).map(([key, song]) => (
              <button
                key={key}
                onClick={() => {
                  triggerHaptic('tap');
                  soundManager.playBeep(900, 0.05);
                  setSelectedSongKey(key);
                  setActiveLineIdx(0);
                }}
                className="bg-slate-900 border border-slate-800 hover:border-cyan-400 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between text-white font-bold text-sm transition-all cursor-pointer group shadow-lg font-mono"
              >
                <div className="flex items-center gap-3">
                  <Play className="w-5 h-5 text-cyan-400 fill-current shrink-0" />
                  <span className="truncate">{song.title}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* Lyrics Player View */
          <div className="flex-1 flex flex-col items-center justify-between gap-4">
            <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-xs font-mono font-bold text-cyan-400 truncate">
                  {SONGS[selectedSongKey].title}
                </span>
              </div>
              <button
                onClick={() => {
                  triggerHaptic('tap');
                  setSelectedSongKey(null);
                  setActiveLineIdx(0);
                }}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl cursor-pointer transition-colors font-mono shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Выбрать другую</span>
              </button>
            </div>

            {/* Karaoke Prompter */}
            <div className="w-full h-80 overflow-y-auto px-4 py-8 space-y-5 text-center flex flex-col items-center scroll-smooth no-scrollbar">
              {SONGS[selectedSongKey].lyrics.map((line, idx) => {
                const isCurrent = idx === activeLineIdx;
                const isPast = idx < activeLineIdx;

                return (
                  <p
                    key={idx}
                    ref={(el) => (lineRefs.current[idx] = el)}
                    className={`transition-all duration-150 font-black font-sans leading-relaxed tracking-wide ${
                      isCurrent
                        ? 'text-cyan-300 text-xl sm:text-2xl scale-110 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] opacity-100'
                        : isPast
                        ? 'text-slate-600 text-sm opacity-40'
                        : 'text-slate-400 text-base opacity-70'
                    }`}
                  >
                    {line}
                  </p>
                );
              })}
            </div>

            <div className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-2xl flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Строка {activeLineIdx + 1} / {SONGS[selectedSongKey].lyrics.length}</span>
              <span className="text-cyan-400 animate-pulse font-bold">● В ЭФИРЕ</span>
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
