
import React, { useState, useEffect, useRef } from 'react';
import { GameStatus } from './types';

const CHARACTER_IMAGES = [
  "https://media.discordapp.net/attachments/1207985815070842933/1455369310167109632/TE1.png?ex=695479ca&is=6953284a&hm=b55aafdd0700154d1d477672d3240ea2e259a3b67d79171b622b90dc9267694a&=&format=webp&quality=lossless",
  "https://media.discordapp.net/attachments/1207985815070842933/1455369723536605255/TE2.png?ex=69547a2d&is=695328ad&hm=cd42d0e6d320f91ee67449c47d5232ca6e133f2f748fc37f52b14e3f08d77994&=&format=webp&quality=lossless"
];

interface VisualEffect {
  id: number;
  x: number;
  y: number;
  type: 'sparkle' | 'text';
  color?: 'blue' | 'red';
  content?: string;
}

interface Fortune {
  title: string;
  sub: string;
  rank: string;
  color: string;
}

const FORTUNES_DATA: Fortune[] = [
  // S RANK (0-10) - 最強運、最速
  { title: "運氣逆天家長", sub: "貓辣妹看著你跨越時產生的時空裂縫，決定封你為「星際執行官」，你呼出的氣息都變成了金色的流星。", rank: "S1", color: "#FFD700" },
  { title: "速度超快家長", sub: "貓辣妹驚呼你已化身光子恐龍！你剛才的一小步是 2026 年物理規律的一大步，所有行星都將為你停轉。", rank: "S2", color: "#FFD700" },
  { title: "神級好運家長", sub: "貓辣妹為你點燃了永恆之火。你這跨越姿態直接重塑了亞特蘭提斯的遺產，你就是新紀元的創世神。", rank: "S3", color: "#FFD700" },
  { title: "絕對王者家長", sub: "貓辣妹親自為你披上銀河羽衣。她說你這種能在次元間跳躍的恐龍，註定要在 2026 年統治整個魔法位面。", rank: "S4", color: "#FFD700" },
  { title: "天選之人家長", sub: "貓辣妹在你跨越的那一刻，聽到了遠古巨龍的龍鳴。她宣佈你已獲得永生不滅的魔法契印，好運永駐。", rank: "S5", color: "#FFD700" },
  { title: "全服最強家長", sub: "貓辣妹看見你腳下開出了透明的時空之花。她驚嘆你這種超自然的速度，簡直是讓宇宙意志都感到戰慄的奇蹟。", rank: "S6", color: "#FFD700" },
  { title: "歐氣滿滿家長", sub: "貓辣妹將 2026 年的月亮變成了一顆巨大的藍鑽送給你。她說你跨越時的龍鱗閃光，是她見過最純淨的魔力來源。", rank: "S7", color: "#FFD700" },
  { title: "奇蹟化身家長", sub: "貓辣妹決定讓你成為宇宙的中心點。因為你跨越的速度太快，2025 年的時間線已經被你擰成了麻花狀。", rank: "S8", color: "#FFD700" },
  { title: "手速飛快家長", sub: "貓辣妹發現你體內的恐龍之心正在與銀河核心共振。她預言 2026 年只要你揮揮手，全世界的寶藏都會飛向你。", rank: "S9", color: "#FFD700" },
  { title: "宇宙最強家長", sub: "貓辣妹被你的威壓震攝住了！她決定把 2026 年的重力控制權交給你，你可以隨意在天空中奔跑、在星海中潛水。", rank: "S10", color: "#FFD700" },

  // A RANK (11-20) - 優秀
  { title: "運氣極佳家長", sub: "貓辣妹送你一瓶「龍息聖水」。她說你跨越時的步伐充滿了自然的翡翠能量，2026 年你將是森林的守護神。", rank: "A1", color: "#94a3b8" },
  { title: "動作俐落家長", sub: "貓辣妹幫你拍了一張「次元跨越」照片。她說你的動作優雅如暗夜的黑豹恐龍，2026 年你會活得非常灑脫。", rank: "A2", color: "#94a3b8" },
  { title: "卓越不凡家長", sub: "貓辣妹發現你身後跟著一群透明的精靈。她說這些精靈是被你的龍威吸引，將在 2026 年為你祈求一整年的平安。", rank: "A3", color: "#94a3b8" },
  { title: "順風順水家長", sub: "貓辣妹為你召喚了一陣帶香氣的魔法微風。她說 2026 年你只需要跟著風走，就能找到隱藏在雲端的黃金宮殿。", rank: "A4", color: "#94a3b8" },
  { title: "超強直覺家長", sub: "貓辣妹驚訝於你避開了所有時空亂流。她決定在 2026 年送你一對透視魔法眼，讓你看穿所有寶箱的位置。", rank: "A5", color: "#94a3b8" },
  { title: "步伐輕盈家長", sub: "貓辣妹看你跑步時像是在踩水。她說你的靈魂已經部分元素化，2026 年你將擁有在水面上行走的超能力。", rank: "A6", color: "#94a3b8" },
  { title: "優秀典範家長", sub: "貓辣妹幫你修剪了發光的爪子。她說你這種充滿紳士風度的恐龍，是 2026 年魔法社交界的唯一焦點。", rank: "A7", color: "#94a3b8" },
  { title: "活力十足家長", sub: "貓辣妹為你準備了用流星塵埃泡的熱咖啡。她說你跨越時的熱能，足以點亮一整座沉睡了千年的天空之城。", rank: "A8", color: "#94a3b8" },
  { title: "前途光明家長", sub: "貓辣妹看見 2026 年的地平線因為你的到來而變成了粉紅色。她說這是極其罕見的奇觀，象徵著極致的豐收。", rank: "A9", color: "#94a3b8" },
  { title: "反應靈敏家長", sub: "貓辣妹丟給你一顆「幻獸蛋」。她說你這種充滿魔力的跨越法，最適合孵化出傳說中的五彩翼龍，祝你好運。", rank: "A10", color: "#94a3b8" },

  // B RANK (21-30) - 穩健
  { title: "普通好運家長", sub: "貓辣妹打了一個哈欠，但還是禮貌地給了你一顆魔法糖果。她說雖然你走得一般，但至少沒掉進黑洞裡。", rank: "B1", color: "#b45309" },
  { title: "穩扎穩打家長", sub: "貓辣妹看你跑得滿頭大汗。她決定在 2026 年送你一雙「不累靴子」，讓你的恐龍生活能過得更輕鬆一點。", rank: "B2", color: "#b45309" },
  { title: "平凡之路家長", sub: "貓辣妹覺得你很有古龍的沉穩氣息。她告訴你 2026 年雖然沒有驚天動地的冒險，但會過得像岩石一樣安穩。", rank: "B3", color: "#b45309" },
  { title: "沒事就好家長", sub: "貓辣妹在你跨越後遞上了一條熱毛巾。她說你這種追求平凡的勇氣也挺奇幻的，2026 年就當個快樂的普通龍吧。", rank: "B4", color: "#b45309" },
  { title: "佛系運動家長", sub: "貓辣妹問你剛才是不是在跑步？還是只是在做夢？她提醒你 2026 年要注意別在傳送門口睡著，會很危險。", rank: "B5", color: "#b45309" },
  { title: "隨緣跨年家長", sub: "貓辣妹發現你跨越時順手摘了路邊的一朵魔法蘑菇。她說這種蘑菇會讓你產生「自己變得很強」的幻覺，慎用。", rank: "B6", color: "#b45309" },
  { title: "步伐穩定家長", sub: "貓辣妹覺得你的節奏很適合跳祭祀之舞。她邀請你在 2026 年參加一場為期三個月的森林派對，只要不嫌慢就好。", rank: "B7", color: "#b45309" },
  { title: "中規中矩家長", sub: "貓辣妹看著你沉重的鱗片。她建議你 2026 年多去岩漿湖泡泡澡，有助於減輕體重、增加點擊速度。", rank: "B8", color: "#b45309" },
  { title: "小確幸家長", sub: "貓辣妹送你一個「不會響的鬧鐘」。她說 2026 年你不需要跟時間賽跑，隨便跨過來就是你的勝利了。", rank: "B9", color: "#b45309" },
  { title: "慢慢進步家長", sub: "貓辣妹在終點打了半天瞌睡才等到你。她送你一根「慢速法杖」，她說既然快不了，那就讓全世界陪你一起變慢。", rank: "B10", color: "#b45309" },

  // C RANK (31-40) - 掙扎
  { title: "運氣偏差家長", sub: "貓辣妹看你一腳踩進了「迷失軟泥」。她吐槽你這頭龍是不是在 2025 年吃太多魔法蛋糕了，重到跑不動。", rank: "C1", color: "#2563eb" },
  { title: "有點吃力家長", sub: "貓辣妹幫你拔出卡在次元縫隙裡的尾巴。她警告你 2026 年別再隨便去撞時空牆壁了，這很傷身體。", rank: "C2", color: "#2563eb" },
  { title: "勉勉強強家長", sub: "貓辣妹拿出一張「低階通行證」。她說你的速度只能進入 2026 年的地下鐵道，那裡住著一群會說話的灰塵精靈。", rank: "C3", color: "#2563eb" },
  { title: "跌跌撞撞家長", sub: "貓辣妹看你跑得像隻醉酒的迅猛龍。她懷疑你剛才跨越時不小心吸入了太多「懶散粉末」，快點去洗臉！", rank: "C4", color: "#2563eb" },
  { title: "魂不守舍家長", sub: "貓辣妹在你眼前揮揮手。她發現你的靈魂還留在 2025 年的披薩店裡，這跨越的一半只是你的影子而已。", rank: "C5", color: "#2563eb" },
  { title: "差點沒過家長", sub: "貓辣妹把你從時空漩渦的邊緣拉了回來。她說你再慢一秒，就要變成 2026 年的一顆裝飾用路燈了，好險。", rank: "C6", color: "#2563eb" },
  { title: "亂點一通家長", sub: "貓辣妹拿放大鏡檢查你的點擊痕跡。她說你這是在跟地板吵架嗎？2026 年要學會與空氣溫柔相處才行。", rank: "C7", color: "#2563eb" },
  { title: "需要努力家長", sub: "貓辣妹遞給你一雙過期的「噴射皮鞋」。她說這皮鞋雖然會隨時爆炸，但至少能幫你這緩慢的恐龍提點速。", rank: "C8", color: "#2563eb" },
  { title: "走錯路家長", sub: "貓辣妹無奈地指出終點在右邊，而你剛才差點跑進了左邊的「虛無之海」。2026 年請隨身攜帶指南針。", rank: "C9", color: "#2563eb" },
  { title: "辛苦報到家長", sub: "貓辣妹看你跨過線時，衣服都被次元風暴撕爛了。她送你一件「乞丐魔袍」，她說這在 2026 年的廢土界很流行。", rank: "C10", color: "#2563eb" },

  // D RANK (41-50) - 衰運
  { title: "運氣極差家長", sub: "貓辣妹已經把 2026 年的大門鎖上了一半。她冷漠地看著你，說你這動作慢得像是被詛咒了兩萬年的石像。", rank: "D1", color: "#64748b" },
  { title: "倒楣鬼家長", sub: "貓辣妹告訴你一個鬼故事：你跨越時踩壞了貓女神最愛的貓砂盆。2026 年你可能要面對無窮無盡的貓爪攻擊。", rank: "D2", color: "#64748b" },
  { title: "速度超慢家長", sub: "貓辣妹把你製成了「靜止畫」。她說你這種慢速恐龍在 2026 年唯一的用途，就是掛在客廳當作時間靜止的標本。", rank: "D3", color: "#64748b" },
  { title: "遺忘在舊年家長", sub: "貓辣妹甚至沒發現你來了。她正忙著跟其他維度的神祇聊天，而你只能在 2026 年的陰影裡默默玩泥巴。", rank: "D4", color: "#64748b" },
  { title: "走路像爬家長", sub: "貓辣妹拿著小刀想切開你。她懷疑你的體內不是肉，而是裝滿了沉重的、不流動的「歷史廢料」，太沉悶了。", rank: "D5", color: "#64748b" },
  { title: "黑洞吸引家長", sub: "貓辣妹發現你跨過來時，身後拖著一串黑洞。她驚叫道：你是要把 2026 年也毀滅嗎？快點離開這裡！", rank: "D6", color: "#64748b" },
  { title: "化石等級家長", sub: "貓辣妹拿膠水把你黏在了 2025 年的邊界上。她說你太慢了，跨不過去也是一種對世界的保護，你就當裝飾吧。", rank: "D7", color: "#64748b" },
  { title: "灰塵精靈家長", sub: "貓辣妹對你吹了一口氣，你就散成了一堆灰。她說你這具恐龍身體已經過期太久，2026 年的空氣你承受不住。", rank: "D8", color: "#64748b" },
  { title: "史前最慢家長", sub: "貓辣妹看你跨越時， 2026 年已經結束了。你進入的是一個全新的、只有石頭的寂靜紀元，好好享受孤獨吧。", rank: "D9", color: "#64748b" },
  { title: "彻底擺爛家長", sub: "貓辣妹把你丟進了次元垃圾桶。她說既然你連點擊都這麼無力，那就去垃圾桶裡研究如何變成一粒健康的原子吧。", rank: "D10", color: "#64748b" }
];

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.START);
  const [playerName, setPlayerName] = useState('');
  const [position, setPosition] = useState(15);
  const [time, setTime] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [currentJumpHeight, setCurrentJumpHeight] = useState(60);
  const [imgIndex, setImgIndex] = useState(0);
  const [effects, setEffects] = useState<VisualEffect[]>([]);
  
  const finishLinePercent = 75;
  const timerRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);

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
    
    const newEffects: VisualEffect[] = [
      { id: Date.now(), x: nextPos, y: 80, type: 'sparkle' },
    ];
    
    if (moveStep > 0) {
      const forwardTexts = ["咻!", "躍!", "閃!", "疾!", "衝!", "踏!"];
      newEffects.push({ 
        id: Date.now() + 1, 
        x: nextPos, 
        y: 75, 
        type: 'text', 
        color: 'blue',
        content: forwardTexts[Math.floor(Math.random() * forwardTexts.length)] 
      });
    } else if (moveStep < 0) {
      const backwardTexts = ["咚!", "退!", "滑!", "嗚!", "咦?", "踉!"];
      newEffects.push({ 
        id: Date.now() + 2, 
        x: nextPos, 
        y: 75, 
        type: 'text', 
        color: 'red',
        content: backwardTexts[Math.floor(Math.random() * backwardTexts.length)] 
      });
    } else {
      newEffects.push({ 
        id: Date.now() + 3, 
        x: nextPos, 
        y: 75, 
        type: 'text', 
        color: 'blue',
        content: "等下!" 
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
    const handleKeyDown = (e: KeyboardEvent) => {
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

  const getFortune = (s: number): Fortune => {
    let index = Math.floor(s / 0.5); 
    if (index >= FORTUNES_DATA.length) index = FORTUNES_DATA.length - 1;
    return FORTUNES_DATA[index];
  };

  const fortune = getFortune(time);

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-[#fafafa]">
      
      {/* Start Screen UI */}
      {status === GameStatus.START && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white p-4">
          <div className="max-w-md w-full bg-white border-[6px] border-black p-8 shadow-[16px_16px_0px_#000] space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="space-y-2 text-center">
              <p className="text-xl font-black text-slate-400 tracking-widest animate-pulse">
                沒有訣竅 全憑運氣
              </p>
              <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-none">
                你是恐龍家長...
              </h1>
            </div>
            <div className="space-y-4">
              <input 
                type="text" 
                maxLength={10}
                placeholder="輸入你的名字"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && startGame()}
                className="w-full text-3xl font-black p-4 border-[5px] border-black focus:outline-none focus:bg-slate-50 placeholder:text-slate-200"
              />
              <button 
                onClick={startGame}
                disabled={!playerName.trim()}
                className="w-full py-6 bg-black text-white font-black text-3xl tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
              >
                START
              </button>
            </div>
            <p className="text-center text-sm font-bold text-slate-400">
              點擊畫面或按空格鍵來前進。
            </p>
          </div>
        </div>
      )}

      {/* Game Stage */}
      <div className="relative w-full max-w-5xl h-[50vh] bg-white border-[3px] border-black overflow-hidden shadow-sm">
        <div className="absolute top-1/2 left-[10%] -translate-y-1/2 text-5xl md:text-6xl font-black text-slate-200 select-none tracking-tighter">
          2025
        </div>
        <div className="absolute top-1/2 right-[5%] -translate-y-1/2 text-5xl md:text-6xl font-black text-slate-200 select-none tracking-tighter">
          2026
        </div>

        <div className="absolute bottom-[20%] left-0 w-full h-1 bg-black/80 z-0" />
        <div className="absolute top-0 h-full w-[8px] bg-red-500 z-10" style={{ left: `${finishLinePercent}%` }} />

        {effects.map(effect => (
          <div 
            key={effect.id}
            className={`${effect.type === 'sparkle' ? 'sparkle-effect' : `pop-text ${effect.color || 'blue'}`}`}
            style={{ 
              left: `${effect.x}%`, 
              bottom: `${effect.y}%`,
              transform: effect.type === 'text' ? 'translateX(-50%)' : 'translate(-50%, 50%)'
            }}
          >
            {effect.type === 'sparkle' ? '✨' : effect.content}
          </div>
        ))}

        <div 
          onClick={handleHop}
          className={`absolute bottom-[20%] transition-all duration-350 ease-out cursor-pointer z-20 flex flex-col items-center ${isJumping ? 'jumping' : ''}`}
          style={{ 
            left: `${position}%`,
            transform: 'translateX(-50%)',
            ['--jump-height' as any]: `-${currentJumpHeight}px`
          } as React.CSSProperties}
        >
          <div className={`${isJumping ? 'animate-kuuki-hop' : ''}`}>
             <div className="relative flex flex-col items-center">
               <img src={CHARACTER_IMAGES[imgIndex]} alt="Character" className="character-img select-none pointer-events-none" style={{ marginBottom: '-5px' }} />
             </div>
          </div>
          <div className="dino-shadow opacity-20" />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center space-y-1">
        <span className="text-5xl md:text-7xl font-black tracking-tighter text-slate-800">
          {time.toFixed(2)}<span className="text-2xl text-slate-300 ml-1 font-black">S</span>
        </span>
      </div>

      {status === GameStatus.WIN && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white border-[6px] border-black max-w-lg w-full relative shadow-[20px_20px_0px_#000] animate-in zoom-in duration-300 overflow-hidden">
            
            <div className="flex items-stretch border-b-[6px] border-black">
              <div className="w-1/3 flex items-center justify-center text-6xl font-black text-white py-10" style={{ backgroundColor: fortune.color, textShadow: '4px 4px 0 #000' }}>
                {fortune.rank}
              </div>
              <div className="w-2/3 bg-white p-6 flex flex-col justify-center border-l-[6px] border-black">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                  恐龍家長結算結果
                </p>
                <div className="mb-2">
                   <span className="text-5xl md:text-7xl font-black text-black block tracking-tighter break-all leading-none py-1">
                     {playerName}
                   </span>
                </div>
                <p className="text-5xl font-black tracking-tighter" style={{ color: fortune.color }}>
                  {time.toFixed(2)}<span className="text-2xl ml-1 opacity-50 font-black">S</span>
                </p>
              </div>
            </div>

            <div className="p-8 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-3" style={{ backgroundColor: fortune.color }} />
                <h3 className="text-3xl md:text-4xl font-black text-black uppercase italic tracking-tighter leading-tight">
                  {fortune.title}
                </h3>
              </div>

              <div className="bg-slate-100 border-[3px] border-black p-6 rounded-lg">
                <p className="text-xl font-bold text-slate-700 leading-relaxed italic">
                  "{fortune.sub}"
                </p>
              </div>
            </div>

            <div className="px-8 pb-8">
              <button 
                onClick={reset}
                className="w-full py-6 border-[5px] border-black text-white font-black text-3xl tracking-widest transition-all shadow-[10px_10px_0px_#000] active:shadow-none translate-y-0 active:translate-y-[10px] active:translate-x-[10px]"
                style={{ backgroundColor: fortune.color }}
              >
                PLAY AGAIN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
