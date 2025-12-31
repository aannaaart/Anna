
import React, { useState, useEffect, useRef } from 'react';
import htm from 'htm';
import { GameStatus } from './types.js';

const html = htm.bind(React.createElement);

const CHARACTER_IMAGES = [
  "https://github.com/aannaaart/Anna/raw/main/TE1.png",
  "https://github.com/aannaaart/Anna/raw/main/TE2.png"
];

// 50 unique dinosaur parent themed fortunes
const FORTUNES_DATA = [
  /* SSR+ (0.00s - 3.00s) - 每 0.6s 一個結果 */
  { title: "時空霸主恐龍家長", sub: "2026 年的物理法則已經對你無效，你是光速的化身！", rank: "SSR+", color: "#FF0080" },
  { title: "歐皇降臨恐龍家長", sub: "貓辣妹說你是千年一遇的點擊天才，2026 年你說了算。", rank: "SSR+", color: "#FF0080" },
  { title: "神選之手恐龍家長", sub: "這種速度...你是不是偷偷用了時光機？2026 好運炸裂！", rank: "SSR+", color: "#FF0080" },
  { title: "次元閃耀恐龍家長", sub: "你的靈魂已經跨越了 2026，留在原地的是你的殘影。", rank: "SSR+", color: "#FF0080" },
  { title: "宇宙奇點恐龍家長", sub: "2026 年所有的財運、桃花、健康都因為你而產生重力塌陷。", rank: "SSR+", color: "#FF0080" },

  /* SSR (3.00s - 5.50s) - 依照使用者需求細分 3-4.5 及 4.5-5.5 */
  { title: "黃金咆哮恐龍家長", sub: "這份霸氣！2026 年你走過的路都會開滿幸運的花朵。", rank: "SSR", color: "#FFD700" },
  { title: "閃光龍影恐龍家長", sub: "你的點擊聲是 2026 年最美妙的序曲，注定大富大貴。", rank: "SSR", color: "#FFD700" },
  { title: "凱旋領袖恐龍家長", sub: "帶領全家人走向 2026，你就是那個最強的幸運核心。", rank: "SSR", color: "#FFD700" },
  { title: "傳奇之魂恐龍家長", sub: "貓辣妹已經把你的名字刻在 2026 的金牌榜首位了。", rank: "SSR", color: "#FFD700" },
  { title: "皇家典範恐龍家長", sub: "優雅、迅速、果斷。2026 年所有的困難都將為你讓路。", rank: "SSR", color: "#FFD700" },
  { title: "至高天賦恐龍家長", sub: "你對運氣的掌控力已經達到了藝術的層次。", rank: "SSR", color: "#FFD700" },

  /* SR (5.50s - 10.00s) - 每 0.45s 一個結果 */
  { title: "疾風獵手恐龍家長", sub: "風起雲湧！2026 年你的工作效率會讓同事集體崩潰。", rank: "SR", color: "#A855F7" },
  { title: "熱血鬥士恐龍家長", sub: "燃燒吧！2026 年你的鬥志會吸引無數貴人前來助陣。", rank: "SR", color: "#A855F7" },
  { title: "靈感湧現恐龍家長", sub: "貓辣妹點了點你的頭，2026 年你的創意將會變成鈔票。", rank: "SR", color: "#A855F7" },
  { title: "鋼鐵意志恐龍家長", sub: "穩定且強大，2026 年你是家人最堅實的後盾。", rank: "SR", color: "#A855F7" },
  { title: "守護星光恐龍家長", sub: "你在 2026 年會成為大家的幸運符，記得收服務費喔。", rank: "SR", color: "#A855F7" },
  { title: "進擊之龍恐龍家長", sub: "不停下腳步的你，2026 年將會收穫豐碩的果實。", rank: "SR", color: "#A855F7" },
  { title: "榮耀勳章恐龍家長", sub: "2026 年你做出的每一個決定都充滿了智慧的光芒。", rank: "SR", color: "#A855F7" },
  { title: "破曉之光恐龍家長", sub: "黑暗終將過去，2026 年你是第一個迎接黎明的人。", rank: "SR", color: "#A855F7" },
  { title: "不屈龍魂恐龍家長", sub: "就算路途崎嶇，你也能優雅地跨過 2025 的阻礙。", rank: "SR", color: "#A855F7" },
  { title: "暴走運氣恐龍家長", sub: "一旦讓你抓到機會，2026 年誰都擋不住你的財氣。", rank: "SR", color: "#A855F7" },

  /* R (10.00s - 20.00s) - 每 0.66s 一個結果 */
  { title: "認真生活恐龍家長", sub: "穩紮穩打才是王道，2026 年你的財富會慢慢累積。", rank: "R", color: "#3B82F6" },
  { title: "文藝氣息恐龍家長", sub: "優雅地跨步，2026 年你的生活會充滿詩意與咖啡香。", rank: "R", color: "#3B82F6" },
  { title: "溫柔守護恐龍家長", sub: "你的善良會感動貓辣妹，2026 年會有意想不到的驚喜。", rank: "R", color: "#3B82F6" },
  { title: "勤勉耕耘恐龍家長", sub: "天道酬勤。2026 年你的每一分努力都不會被浪費。", rank: "R", color: "#3B82F6" },
  { title: "冒險達人恐龍家長", sub: "2026 年多去旅行吧，好運就藏在未知的風景裡。", rank: "R", color: "#3B82F6" },
  { title: "社交達人恐龍家長", sub: "靠嘴就能發財！2026 年你的社交圈會幫你帶來大單。", rank: "R", color: "#3B82F6" },
  { title: "養生至上恐龍家長", sub: "健康就是最大的財富。2026 年記得多喝熱水多運動。", rank: "R", color: "#3B82F6" },
  { title: "樂天主義恐龍家長", sub: "笑一笑沒什麼大不了。2026 年快樂是你最強的防護罩。", rank: "R", color: "#3B82F6" },
  { title: "平穩前進恐龍家長", sub: "不求最快，但求最穩。2026 年你會過得很舒心。", rank: "R", color: "#3B82F6" },
  { title: "糾結美學恐龍家長", sub: "雖然跨得慢一點，但你至少選了一個最美的姿勢。", rank: "R", color: "#3B82F6" },
  { title: "好奇心重恐龍家長", sub: "2026 年保持你的好奇心，新的商機就在你身邊。", rank: "R", color: "#3B82F6" },
  { title: "知足常樂恐龍家長", sub: "2026 年平安就是福，你的心態決定了你的好運。", rank: "R", color: "#3B82F6" },
  { title: "低調強者恐龍家長", sub: "隱藏實力是為了在 2026 年底給所有人一個驚喜。", rank: "R", color: "#3B82F6" },
  { title: "眼神犀利恐龍家長", sub: "看準目標再出手，2026 年你的命中率會提高不少。", rank: "R", color: "#3B82F6" },
  { title: "自在生活恐龍家長", sub: "隨心所欲地跨越，2026 年沒有什麼能束縛你。", rank: "R", color: "#3B82F6" },

  /* N (20.00s+) - 每 1.0s 一個結果 */
  { title: "漫步雲端恐龍家長", sub: "你在 2025 的尾巴待太久了，2026 的車都開走啦！", rank: "N", color: "#64748B" },
  { title: "邊緣發呆恐龍家長", sub: "貓辣妹找你找好久，原來你在起點看蝴蝶。", rank: "N", color: "#64748B" },
  { title: "躺平先鋒恐龍家長", sub: "2026 年你決定跟地板做朋友，運氣也跟著你躺下了。", rank: "N", color: "#64748B" },
  { title: "瞌睡冠軍恐龍家長", sub: "跨年的鐘聲沒把你吵醒，你的 2026 是從夢中開始的。", rank: "N", color: "#64748B" },
  { title: "遲到大王恐龍家長", sub: "2026 年的春節都快到了，你才終於跨過這條線。", rank: "N", color: "#64748B" },
  { title: "迷路指南恐龍家長", sub: "你是去 2026 還是去 1926？貓辣妹建議你買個導航。", rank: "N", color: "#64748B" },
  { title: "發呆高手恐龍家長", sub: "你的反應速度連考拉都覺得你是高手，2026 加油吧。", rank: "N", color: "#64748B" },
  { title: "銅牌候補恐龍家長", sub: "雖然沒拿到金牌，但 2026 年你至少參與了，對吧？", rank: "N", color: "#64748B" },
  { title: "路人甲級恐龍家長", sub: "你在 2026 年的背景圖裡，扮演一個非常稱職的背景。", rank: "N", color: "#64748B" },
  { title: "土下座式恐龍家長", sub: "為了這點成績，你決定向貓辣妹誠懇道歉。2026 再努力。", rank: "N", color: "#64748B" },
  { title: "嘆氣專家恐龍家長", sub: "別再嘆氣了，2026 年的好運都被你吹跑啦！", rank: "N", color: "#64748B" },
  { title: "慢節奏控恐龍家長", sub: "2026 年你會活得很長壽，因為你什麼都不急。", rank: "N", color: "#64748B" },
  { title: "靈魂出竅恐龍家長", sub: "你的身體跨過了，但靈魂好像還留在 2024 年。", rank: "N", color: "#64748B" },
  { title: "灰燼餘溫恐龍家長", sub: "你的能量已在 2025 耗盡，2026 請重新投胎轉運。", rank: "N", color: "#64748B" }
];

const App = () => {
  const [status, setStatus] = useState(GameStatus.START);
  const [playerName, setPlayerName] = useState('');
  const [position, setPosition] = useState(15);
  const [time, setTime] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [currentJumpHeight, setCurrentJumpHeight] = useState(60);
  const [imgIndex, setImgIndex] = useState(0);
  const [effects, setEffects] = useState([]);
  const [finalFortune, setFinalFortune] = useState(null);
  
  const finishLinePercent = 75;
  const timerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      timerRef.current = window.setInterval(() => {
        setTime(prev => prev + 0.01);
      }, 10);
      
      animationRef.current = window.setInterval(() => {
        setImgIndex(prev => (prev === 0 ? 1 : 0));
      }, 250);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) clearInterval(animationRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [status]);

  // 定確性映射函數：確保 50 個結果都有對應的精確秒數區間
  const determineFortune = (s) => {
    // SSR+ Range (0.0s - 3.0s): 5 items, each 0.6s
    if (s < 3.0) {
      const idx = Math.floor(s / 0.6);
      return FORTUNES_DATA[Math.min(idx, 4)];
    }

    // SSR Range (3.0s - 5.5s): 6 items
    if (s < 5.5) {
      if (s < 4.5) {
        // 3.0 - 4.5 (1.5s span for items 5, 6, 7, 8) -> each ~0.375s
        const idx = 5 + Math.floor((s - 3.0) / 0.375);
        return FORTUNES_DATA[Math.min(idx, 8)];
      } else {
        // 4.5 - 5.5 (1.0s span for items 9, 10) -> each 0.5s
        const idx = 9 + Math.floor((s - 4.5) / 0.5);
        return FORTUNES_DATA[Math.min(idx, 10)];
      }
    }

    // SR Range (5.5s - 10.0s): 10 items, each 0.45s
    if (s < 10.0) {
      const idx = 11 + Math.floor((s - 5.5) / 0.45);
      return FORTUNES_DATA[Math.min(idx, 20)];
    }

    // R Range (10.0s - 20.0s): 15 items, each 0.66s
    if (s < 20.0) {
      const idx = 21 + Math.floor((s - 10.0) / 0.66);
      return FORTUNES_DATA[Math.min(idx, 35)];
    }

    // N Range (20.0s+): 14 items, each 1.0s
    const idx = 36 + Math.floor((s - 20.0) / 1.0);
    return FORTUNES_DATA[Math.min(idx, 49)];
  };

  const handleHop = () => {
    if (status !== GameStatus.PLAYING || isJumping) return;

    const rand = Math.random();
    let moveStep = 0;
    if (rand < 0.45) moveStep = Math.floor(Math.random() * 15) + 5; 
    else if (rand < 0.85) moveStep = -(Math.floor(Math.random() * 12) + 2); 

    const randomHeight = Math.floor(Math.random() * 41) + 30;
    setCurrentJumpHeight(randomHeight);
    const nextPos = Math.max(5, position + moveStep);
    
    const newEffects = [{ id: Date.now(), x: nextPos, y: 80, type: 'sparkle' }];
    if (moveStep > 0) newEffects.push({ id: Date.now() + 1, x: nextPos, y: 75, type: 'text', color: 'blue', content: "咻!" });
    else if (moveStep < 0) newEffects.push({ id: Date.now() + 2, x: nextPos, y: 75, type: 'text', color: 'red', content: "咚!" });
    
    setEffects(prev => [...prev, ...newEffects]);
    setTimeout(() => {
      setEffects(prev => prev.filter(e => !newEffects.find(ne => ne.id === e.id)));
    }, 700);

    setPosition(nextPos);
    setIsJumping(true);
    if (nextPos >= finishLinePercent) {
      const winTime = time;
      setFinalTime(winTime);
      setFinalFortune(determineFortune(winTime));
      setStatus(GameStatus.WIN);
    }
    setTimeout(() => setIsJumping(false), 350); 
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (status !== GameStatus.PLAYING) return;
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        handleHop();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, isJumping, position, time]);

  const startGame = () => {
    if (!playerName.trim()) return;
    setStatus(GameStatus.PLAYING);
    setTime(0);
    setFinalFortune(null);
  };

  const reset = () => {
    setPosition(15);
    setTime(0);
    setFinalFortune(null);
    setStatus(GameStatus.PLAYING);
    setIsJumping(false);
  };

  return html`
    <div className="relative w-full h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-[#fafafa]">
      
      ${status === GameStatus.START && html`
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white p-4">
          <div className="max-w-md w-full bg-white border-[6px] border-black p-8 shadow-[16px_16px_0px_#000] space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center space-y-4">
               <div className="space-y-2 text-center">
                 <p className="text-xl font-black text-slate-400 tracking-widest animate-pulse">
                   沒有訣竅 全憑運氣
                 </p>
                 <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-none">
                   跨越 2025...
                 </h1>
               </div>
            </div>
            <div className="space-y-4">
              <input 
                type="text" 
                maxLength="10"
                placeholder="你是哪位恐龍家長"
                value=${playerName}
                onInput=${(e) => setPlayerName(e.target.value)}
                onKeyDown=${(e) => e.key === 'Enter' && startGame()}
                className="w-full text-3xl font-black p-4 border-[5px] border-black focus:outline-none focus:bg-slate-50 placeholder:text-slate-200"
              />
              <button 
                onClick=${startGame}
                disabled=${!playerName.trim()}
                className="w-full py-6 bg-black text-white font-black text-3xl tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
              >
                START
              </button>
            </div>
            <p className="text-center text-sm font-bold text-slate-400">
              一直點擊角色或按空格鍵來前進。
            </p>
          </div>
        </div>
      `}

      <div className="relative w-full max-w-5xl h-[50vh] bg-white border-[3px] border-black overflow-hidden shadow-sm">
        <div className="absolute top-1/2 left-[10%] -translate-y-1/2 text-5xl md:text-6xl font-black text-slate-200 select-none tracking-tighter">
          2025
        </div>
        <div className="absolute top-1/2 right-[5%] -translate-y-1/2 text-5xl md:text-6xl font-black text-slate-200 select-none tracking-tighter">
          2026
        </div>

        <div className="absolute bottom-[20%] left-0 w-full h-1 bg-black/80 z-0" />
        <div className="absolute top-0 h-full w-[8px] bg-red-500 z-10" style=${{ left: `${finishLinePercent}%` }} />

        ${effects.map(effect => html`
          <div 
            key=${effect.id}
            className=${`${effect.type === 'sparkle' ? 'sparkle-effect' : `pop-text ${effect.color || 'blue'}`}`}
            style=${{ 
              left: `${effect.x}%`, 
              bottom: `${effect.y}%`,
              transform: effect.type === 'text' ? 'translateX(-50%)' : 'translate(-50%, 50%)'
            }}
          >
            ${effect.type === 'sparkle' ? '✨' : effect.content}
          </div>
        `)}

        <div 
          onClick=${handleHop}
          className=${`absolute bottom-[20%] transition-all duration-350 ease-out cursor-pointer z-20 flex flex-col items-center ${isJumping ? 'jumping' : ''}`}
          style=${{ 
            left: `${position}%`,
            transform: 'translateX(-50%)',
            '--jump-height': `-${currentJumpHeight}px`
          }}
        >
          <div className=${isJumping ? 'animate-kuuki-hop' : ''}>
             <div className="relative flex flex-col items-center">
               <img src=${CHARACTER_IMAGES[imgIndex]} alt="Character" className="character-img select-none pointer-events-none" style=${{ marginBottom: '-5px' }} />
             </div>
          </div>
          <div className="dino-shadow opacity-20" />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center space-y-1">
        <span className="text-5xl md:text-7xl font-black tracking-tighter text-slate-800">
          ${time.toFixed(2)}<span className="text-2xl text-slate-300 ml-1 font-black">S</span>
        </span>
      </div>

      ${status === GameStatus.WIN && finalFortune && html`
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white border-[6px] border-black max-w-lg w-full relative shadow-[20px_20px_0px_#000] animate-in zoom-in duration-300 overflow-hidden">
            
            <div className="flex items-stretch border-b-[6px] border-black">
              <div className="w-1/3 flex flex-col items-center justify-center text-4xl md:text-5xl font-black text-white py-10 text-center leading-none" style=${{ backgroundColor: finalFortune.color, textShadow: '3px 3px 0 #000' }}>
                ${finalFortune.rank}
              </div>
              <div className="w-2/3 bg-white p-6 flex flex-col justify-center border-l-[6px] border-black">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                  2026 恐龍結算評定
                </p>
                <div className="mb-2">
                   <span className="text-4xl md:text-5xl font-black text-black block tracking-tighter break-all leading-none py-1">
                     ${playerName}
                   </span>
                </div>
                <p className="text-4xl font-black tracking-tighter" style=${{ color: finalFortune.color }}>
                  ${finalTime.toFixed(2)}<span className="text-xl ml-1 opacity-50 font-black">S</span>
                </p>
              </div>
            </div>

            <div className="p-8 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-3" style=${{ backgroundColor: finalFortune.color }} />
                <h3 className="text-2xl md:text-3xl font-black text-black uppercase italic tracking-tighter leading-tight">
                  ${finalFortune.title}
                </h3>
              </div>

              <div className="bg-slate-100 border-[3px] border-black p-6 rounded-lg">
                <p className="text-lg md:text-xl font-bold text-slate-700 leading-relaxed italic">
                  "${finalFortune.sub}"
                </p>
              </div>
            </div>

            <div className="px-8 pb-8">
              <button 
                onClick=${reset}
                className="w-full py-5 border-[5px] border-black text-white font-black text-2xl tracking-widest transition-all shadow-[8px_8px_0px_#000] active:shadow-none translate-y-0 active:translate-y-[8px] active:translate-x-[8px]"
                style=${{ backgroundColor: finalFortune.color }}
              >
                再次挑戰時空
              </button>
            </div>
          </div>
        </div>
      `}
    </div>
  `;
};

export default App;
