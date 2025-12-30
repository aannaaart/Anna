import React, { useState, useEffect, useRef } from 'react';
import htm from 'htm';
import { GameStatus } from './types.js';

const html = htm.bind(React.createElement);

const CHARACTER_IMAGES = [
  "https://media.discordapp.net/attachments/1207985815070842933/1455369310167109632/TE1.png?ex=695479ca&is=6953284a&hm=b55aafdd0700154d1d477672d3240ea2e259a3b67d79171b622b90dc9267694a&=&format=webp&quality=lossless",
  "https://media.discordapp.net/attachments/1207985815070842933/1455369723536605255/TE2.png?ex=69547a2d&is=695328ad&hm=cd42d0e6d320f91ee67449c47d5232ca6e133f2f748fc37f52b14e3f08d77994&=&format=webp&quality=lossless"
];

const FORTUNES_DATA = [
  { title: "運氣逆天家長", sub: "貓辣妹看著你跨越時產生的時空裂縫，決定封你為「星際執行官」。", rank: "S1", color: "#FFD700" },
  { title: "神級好運家長", sub: "貓辣妹為你點燃了永恆之火，你就是新紀元的創世神。", rank: "S3", color: "#FFD700" },
  { title: "天選之人家長", sub: "貓辣妹宣佈你已獲得永生不滅的魔法契印，2025年大吉大利。", rank: "S5", color: "#FFD700" },
  { title: "運氣極佳家長", sub: "貓辣妹送你一瓶「龍息聖水」。2025 年你將是幸運的守護神。", rank: "A1", color: "#94a3b8" },
  { title: "動作俐落家長", sub: "貓辣妹說你的動作優雅如黑豹。2025 年你會活得非常灑脫。", rank: "A5", color: "#94a3b8" },
  { title: "普通好運家長", sub: "雖然你走得一般，但至少沒掉進黑洞裡。2025年平安喜樂。", rank: "B1", color: "#b45309" },
  { title: "中規中矩家長", sub: "貓辣妹建議你 2025 年多泡熱水澡，有助於點擊速度提升。", rank: "B5", color: "#b45309" },
  { title: "勉勉強強家長", sub: "貓辣妹幫你拔出卡在次元縫隙裡的尾巴，2025年請繼續加油。", rank: "C1", color: "#2563eb" },
  { title: "亂點一通家長", sub: "你這是在跟地板吵架嗎？2025 年要學會與空氣溫柔相處才行。", rank: "C5", color: "#2563eb" },
  { title: "運氣極差家長", sub: "貓辣妹已經把 2025 年的大門鎖上了一半，你得跑快點了。", rank: "D1", color: "#64748b" },
  { title: "史前最慢家長", sub: "貓辣妹看你跨越時， 2025 年都快過完了，真是慢到不行。", rank: "D10", color: "#64748b" }
];

const App = () => {
  const [status, setStatus] = useState(GameStatus.START);
  const [playerName, setPlayerName] = useState('');
  const [position, setPosition] = useState(15);
  const [time, setTime] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [currentJumpHeight, setCurrentJumpHeight] = useState(60);
  const [imgIndex, setImgIndex] = useState(0);
  const [effects, setEffects] = useState([]);
  
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

  const handleHop = () => {
    if (status !== GameStatus.PLAYING || isJumping) return;

    const rand = Math.random();
    let moveStep = 0;

    if (rand < 0.45) {
      moveStep = Math.floor(Math.random() * 15) + 5; 
    } else if (rand < 0.85) {
      moveStep = -(Math.floor(Math.random() * 12) + 2); 
    } else {
      moveStep = 0; 
    }

    const randomHeight = Math.floor(Math.random() * 41) + 30;
    setCurrentJumpHeight(randomHeight);

    const nextPos = Math.max(5, position + moveStep);
    
    const newEffects = [
      { id: Date.now(), x: nextPos, y: 80, type: 'sparkle' },
    ];
    
    if (moveStep > 0) {
      const forwardTexts = ["咻!", "躍!", "閃!", "疾!"];
      newEffects.push({ 
        id: Date.now() + 1, 
        x: nextPos, 
        y: 75, 
        type: 'text', 
        color: 'blue',
        content: forwardTexts[Math.floor(Math.random() * forwardTexts.length)] 
      });
    } else if (moveStep < 0) {
      const backwardTexts = ["咚!", "退!", "咦?"];
      newEffects.push({ 
        id: Date.now() + 2, 
        x: nextPos, 
        y: 75, 
        type: 'text', 
        color: 'red',
        content: backwardTexts[Math.floor(Math.random() * backwardTexts.length)] 
      });
    }
    
    setEffects(prev => [...prev, ...newEffects]);
    
    setTimeout(() => {
      setEffects(prev => prev.filter(e => !newEffects.find(ne => ne.id === e.id)));
    }, 700);

    setPosition(nextPos);
    setIsJumping(true);
    
    if (nextPos >= finishLinePercent) {
      setStatus(GameStatus.WIN);
    }

    setTimeout(() => {
      setIsJumping(false);
    }, 350); 
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
  }, [status, isJumping, position]);

  const startGame = () => {
    if (!playerName.trim()) return;
    setStatus(GameStatus.PLAYING);
  };

  const reset = () => {
    setPosition(15);
    setTime(0);
    setStatus(GameStatus.PLAYING);
    setIsJumping(false);
    setImgIndex(0);
    setEffects([]);
  };

  const getFortune = (s) => {
    let index = Math.floor(s / 1.5); 
    if (index >= FORTUNES_DATA.length) index = FORTUNES_DATA.length - 1;
    return FORTUNES_DATA[index];
  };

  const fortune = getFortune(time);

  return html`
    <div className="relative w-full h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-[#fafafa]">
      
      ${status === GameStatus.START && html`
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white p-4">
          <div className="max-w-md w-full bg-white border-[6px] border-black p-8 shadow-[16px_16px_0px_#000] space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="space-y-2 text-center">
              <p className="text-xl font-black text-slate-400 tracking-widest animate-pulse">
                沒有訣竅 全憑運氣
              </p>
              <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-none">
                跨越 2024...
              </h1>
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
          2024
        </div>
        <div className="absolute top-1/2 right-[5%] -translate-y-1/2 text-5xl md:text-6xl font-black text-slate-200 select-none tracking-tighter">
          2025
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

      ${status === GameStatus.WIN && html`
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white border-[6px] border-black max-w-lg w-full relative shadow-[20px_20px_0px_#000] animate-in zoom-in duration-300 overflow-hidden">
            
            <div className="flex items-stretch border-b-[6px] border-black">
              <div className="w-1/3 flex items-center justify-center text-6xl font-black text-white py-10" style=${{ backgroundColor: fortune.color, textShadow: '4px 4px 0 #000' }}>
                ${fortune.rank}
              </div>
              <div className="w-2/3 bg-white p-6 flex flex-col justify-center border-l-[6px] border-black">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                  2025 運勢結果
                </p>
                <div className="mb-2">
                   <span className="text-5xl md:text-7xl font-black text-black block tracking-tighter break-all leading-none py-1">
                     ${playerName}
                   </span>
                </div>
                <p className="text-5xl font-black tracking-tighter" style=${{ color: fortune.color }}>
                  ${time.toFixed(2)}<span className="text-2xl ml-1 opacity-50 font-black">S</span>
                </p>
              </div>
            </div>

            <div className="p-8 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-3" style=${{ backgroundColor: fortune.color }} />
                <h3 className="text-3xl md:text-4xl font-black text-black uppercase italic tracking-tighter leading-tight">
                  ${fortune.title}
                </h3>
              </div>

              <div className="bg-slate-100 border-[3px] border-black p-6 rounded-lg">
                <p className="text-xl font-bold text-slate-700 leading-relaxed italic">
                  "${fortune.sub}"
                </p>
              </div>
            </div>

            <div className="px-8 pb-8">
              <button 
                onClick=${reset}
                className="w-full py-6 border-[5px] border-black text-white font-black text-3xl tracking-widest transition-all shadow-[10px_10px_0px_#000] active:shadow-none translate-y-0 active:translate-y-[10px] active:translate-x-[10px]"
                style=${{ backgroundColor: fortune.color }}
              >
                再試一次
              </button>
            </div>
          </div>
        </div>
      `}
    </div>
  `;
};

export default App;