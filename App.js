
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
  { title: "歐皇恐龍家長", sub: "2026 年你的運氣已突破次元壁，這速度連貓辣妹都跪了！", rank: "SSR+", color: "#FF0080" },
  { title: "神速恐龍家長", sub: "你不是在點擊，你是在撕裂時空！2026 全宇宙都是你的遊樂場。", rank: "SSR+", color: "#FF0080" },
  { title: "跨位面恐龍家長", sub: "2026 年所有的彩券行都會掛上你的照片，因為你太歐了！", rank: "SSR+", color: "#FF0080" },
  { title: "天選恐龍家長", sub: "你是被 2026 年選中的那個人，連空氣都為你讓路。", rank: "SSR+", color: "#FF0080" },
  { title: "宇宙主宰恐龍家長", sub: "貓辣妹決定讓你直接當 2026 年的總代理，好運隨你發放。", rank: "SSR+", color: "#FF0080" },
  { title: "黃金恐龍家長", sub: "2026 年你走過的路都會變成金幣，這就是頂級家長的霸氣。", rank: "SSR", color: "#FFD700" },
  { title: "閃光恐龍家長", sub: "你的存在就是一道光！2026 年所有霉運看到你都要戴墨鏡。", rank: "SSR", color: "#FFD700" },
  { title: "霸氣恐龍家長", sub: "貓辣妹說你的氣場已經覆蓋了整個 2026，沒人敢惹你。", rank: "SSR", color: "#FFD700" },
  { title: "凱旋恐龍家長", sub: "旗開得勝！2026 年你的每一天都是慶功宴。", rank: "SSR", color: "#FFD700" },
  { title: "皇家恐龍家長", sub: "這種優雅與速度的結合，2026 年註定是大富大貴之年。", rank: "SSR", color: "#FFD700" },
  { title: "傳說恐龍家長", sub: "貓辣妹幫你寫了一本自傳，標題是《如何在 2026 躺著贏》。", rank: "SSR", color: "#FFD700" },
  { title: "咆哮恐龍家長", sub: "2026 年你的聲音會被聽見，那是好運在向你招手！", rank: "SR", color: "#A855F7" },
  { title: "守護恐龍家長", sub: "你在 2026 年會成為大家的幸運符，記得收服務費。", rank: "SR", color: "#A855F7" },
  { title: "疾風恐龍家長", sub: "風起雲湧！2026 年你的效率會讓同事們集體失業。", rank: "SR", color: "#A855F7" },
  { title: "靈動恐龍家長", sub: "貓辣妹稱讚你的身手，2026 年所有困難你都能閃開。", rank: "SR", color: "#A855F7" },
  { title: "熱血恐龍家長", sub: "燃燒吧！2026 年你的熱情會吸引無數貴人來幫你。", rank: "SR", color: "#A855F7" },
  { title: "鋼鐵恐龍家長", sub: "意志力驚人，2026 年就算遇到逆境你也能把它撞碎。", rank: "SR", color: "#A855F7" },
  { title: "戰鬥恐龍家長", sub: "2026 年是你的戰場，而你已經預定了冠軍獎座。", rank: "SR", color: "#A855F7" },
  { title: "榮耀恐龍家長", sub: "貓辣妹為你戴上 2026 的勳章，你是全家的驕傲。", rank: "SR", color: "#A855F7" },
  { title: "執念恐龍家長", sub: "你的堅持讓 2026 年不得不給你最好的資源。", rank: "SR", color: "#A855F7" },
  { title: "暴走恐龍家長", sub: "一旦認真起來誰都擋不住，2026 年準備大顯身手吧！", rank: "SR", color: "#A855F7" },
  { title: "認真恐龍家長", sub: "2026 年雖然不是最快的，但你的一絲不苟會帶來財富。", rank: "R", color: "#3B82F6" },
  { title: "糾結恐龍家長", sub: "別想太多了，2026 年直接衝就對了！貓辣妹在終點等你。", rank: "R", color: "#3B82F6" },
  { title: "碎念恐龍家長", sub: "2026 年靠嘴就能發財，建議你可以考慮去當網紅。", rank: "R", color: "#3B82F6" },
  { title: "勤奮恐龍家長", sub: "貓辣妹說：天道酬勤。2026 年你的汗水會換成鈔票。", rank: "R", color: "#3B82F6" },
  { title: "冒險恐龍家長", sub: "2026 年多去戶外走走，好運藏在你想不到的地方。", rank: "R", color: "#3B82F6" },
  { title: "自拍恐龍家長", sub: "2026 年你是最亮眼的風景，記得多拍照分享好運。", rank: "R", color: "#3B82F6" },
  { title: "樂天恐龍家長", sub: "愛笑的家長運氣不會差，2026 年每天都開開心心。", rank: "R", color: "#3B82F6" },
  { title: "購物恐龍家長", sub: "2026 年雖然花得多，但賺得更多！盡情刷卡吧。", rank: "R", color: "#3B82F6" },
  { title: "養生恐龍家長", sub: "貓辣妹提醒你：2026 年健康就是最大的財富。", rank: "R", color: "#3B82F6" },
  { title: "健忘恐龍家長", sub: "忘記不愉快的事，2026 年你的大腦只用來裝好運。", rank: "R", color: "#3B82F6" },
  { title: "文藝恐龍家長", sub: "2026 年活得像首詩，雖然有點慢，但很有品味。", rank: "R", color: "#3B82F6" },
  { title: "溫柔恐龍家長", sub: "2026 年你的溫柔會融化一切阻礙，貴人紛紛湧現。", rank: "R", color: "#3B82F6" },
  { title: "迷糊恐龍家長", sub: "傻人有傻福，2026 年你可能會莫名其妙中大獎。", rank: "R", color: "#3B82F6" },
  { title: "焦慮恐龍家長", sub: "放輕鬆！2026 年貓辣妹會幫你搞定所有的麻煩事。", rank: "R", color: "#3B82F6" },
  { title: "孤傲恐龍家長", sub: "2026 年你有自己的節奏，不需要向任何人解釋。", rank: "R", color: "#3B82F6" },
  { title: "慢郎中恐龍家長", sub: "你在 2025 的尾巴待太久了，2026 的車都開走啦！", rank: "N", color: "#64748B" },
  { title: "邊緣恐龍家長", sub: "貓辣妹找你找好久，原來你還在那邊慢慢爬。", rank: "N", color: "#64748B" },
  { title: "躺平恐龍家長", sub: "2026 年你決定跟地板做朋友，運氣也跟著你躺下了。", rank: "N", color: "#64748B" },
  { title: "佛系恐龍家長", sub: "不求名、不求利，2026 年你只要平安跨過線就滿足了。", rank: "N", color: "#64748B" },
  { title: "瞌睡恐龍家長", sub: "跨年的鐘聲沒把你吵醒，你的 2026 是從夢中開始的。", rank: "N", color: "#64748B" },
  { title: "遲到恐龍家長", sub: "2026 年的春節都快到了，你才終於跨過這條線。", rank: "N", color: "#64748B" },
  { title: "迷路恐龍家長", sub: "你是去 2026 還是去 1926？貓辣妹建議你買個導航。", rank: "N", color: "#64748B" },
  { title: "發呆恐龍家長", sub: "2026 年你可能需要一點維他命 B，提升一下你的反應。", rank: "N", color: "#64748B" },
  { title: "銅牌恐龍家長", sub: "雖然沒拿到金牌，但 2026 年你至少參與了，對吧？", rank: "N", color: "#64748B" },
  { title: "路人恐龍家長", sub: "你在 2026 年的背景圖裡，扮演一個非常稱職的背景。", rank: "N", color: "#64748B" },
  { title: "土下座恐龍家長", sub: "為了這點成績，你決定向貓辣妹誠懇道歉。2026 再努力。", rank: "N", color: "#64748B" },
  { title: "嘆氣恐龍家長", sub: "別再嘆氣了，2026 年的氣都被你嘆光了，快點擊！", rank: "N", color: "#64748B" },
  { title: "眼神死恐龍家長", sub: "雖然跨過了，但你感覺 2026 似乎也不過如此嘛。", rank: "N", color: "#64748B" },
  { title: "灰燼恐龍家長", sub: "你的靈魂已在 2025 燃燒殆盡，2026 請重新投胎轉運。", rank: "N", color: "#64748B" }
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

  const determineFortune = (s) => {
    if (s < 1.0) return FORTUNES_DATA[0];
    if (s < 1.5) return FORTUNES_DATA[1];
    if (s < 2.0) return FORTUNES_DATA[2];
    if (s < 2.5) return FORTUNES_DATA[3];
    if (s < 3.0) return FORTUNES_DATA[4];

    if (s < 3.4) return FORTUNES_DATA[5];
    if (s < 3.8) return FORTUNES_DATA[6];
    if (s < 4.2) return FORTUNES_DATA[7];
    if (s < 4.6) return FORTUNES_DATA[8];
    if (s < 5.0) return FORTUNES_DATA[9];
    if (s < 5.4) return FORTUNES_DATA[10];

    const srBase = 11;
    if (s < 8.0) {
      const offset = Math.min(9, Math.floor((s - 5.4) / 0.3));
      return FORTUNES_DATA[srBase + offset] || FORTUNES_DATA[20];
    }

    const rBase = 21;
    if (s < 15.0) {
      const offset = Math.min(14, Math.floor((s - 8.0) / 0.5));
      return FORTUNES_DATA[rBase + offset] || FORTUNES_DATA[35];
    }

    const nBase = 36;
    const offset = Math.min(13, Math.floor((s - 15.0) / 1.0));
    return FORTUNES_DATA[nBase + offset] || FORTUNES_DATA[49];
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
               <img src=${CHARACTER_IMAGES[0]} alt="Preview" className="character-img" />
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
                placeholder="輸入你的名字"
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
              <div className="w-1/3 flex items-center justify-center text-4xl md:text-5xl font-black text-white py-10 text-center leading-none" style=${{ backgroundColor: finalFortune.color, textShadow: '3px 3px 0 #000' }}>
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
