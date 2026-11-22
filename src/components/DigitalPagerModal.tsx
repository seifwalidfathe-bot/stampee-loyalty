import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  BellRing, 
  X, 
  Coffee, 
  Sparkles, 
  Volume2, 
  RotateCcw, 
  ArrowLeft,
  CheckCircle2,
  Trophy,
  Flame
} from 'lucide-react';
import { MerchantConfig, CustomerLoyaltyCard, Language, ActiveOrder } from '../types';
import { soundEngine } from '../lib/sound';

interface DigitalPagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: ActiveOrder;
  merchant: MerchantConfig;
  card: CustomerLoyaltyCard;
  lang: Language;
  onOrderClaimed?: (orderId: string) => void;
  onSimulateReady?: (orderId: string) => void;
}

interface Bean {
  id: number;
  x: number; // percentage 5 - 95
  y: number; // percentage 0 - 100
  speed: number;
}

export const DigitalPagerModal: React.FC<DigitalPagerModalProps> = ({
  isOpen,
  onClose,
  order,
  merchant,
  card,
  lang,
  onOrderClaimed,
  onSimulateReady,
}) => {
  const isAr = lang === 'ar';
  const isReady = order.status === 'ready';

  // Game state
  const [cupX, setCupX] = useState(50); // percentage 10 - 90
  const [beans, setBeans] = useState<Bean[]>([]);
  const [score, setScore] = useState(0);
  const [cupFillPercent, setCupFillPercent] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [hasCelebratedReady, setHasCelebratedReady] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Trigger sound and celebration when status changes to 'ready'
  useEffect(() => {
    if (isReady && Boolean(hasCelebratedReady) === false) {
      setHasCelebratedReady(true);
      soundEngine.playPagerBuzzer();
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#FF6B00', '#FFA940', '#FFFFFF', '#52C41A']
      });
    }
  }, [isReady, hasCelebratedReady]);

  // Mini-game loop: Spawns and drops coffee beans
  useEffect(() => {
    if (Boolean(isOpen) === false || isReady) return;

    const spawnInterval = setInterval(() => {
      setBeans(prev => {
        if (prev.length >= 6) return prev;
        const newBean: Bean = {
          id: Math.random(),
          x: Math.floor(Math.random() * 80) + 10,
          y: 0,
          speed: Math.random() * 1.5 + 1.2,
        };
        return [...prev, newBean];
      });
    }, 900);

    const fallInterval = setInterval(() => {
      setBeans(prev => {
        const nextBeans: Bean[] = [];
        prev.forEach(b => {
          const nextY = b.y + b.speed;
          // Check collision with cup (cup is at bottom ~82% y, width ~24%)
          const cupLeft = cupX - 12;
          const cupRight = cupX + 12;
          const isCaught = nextY >= 78 && nextY <= 88 && b.x >= cupLeft && b.x <= cupRight;

          if (isCaught) {
            soundEngine.playBeanCatch();
            setScore(s => s + 10);
            setCupFillPercent(f => Math.min(100, f + 12));
          } else if (nextY < 100) {
            nextBeans.push({ ...b, y: nextY });
          }
        });
        return nextBeans;
      });
    }, 50);

    const timerInterval = setInterval(() => {
      setGameTime(t => t + 1);
    }, 1000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(fallInterval);
      clearInterval(timerInterval);
    };
  }, [isOpen, isReady, cupX]);

  // Touch and drag handler for moving cup
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (gameAreaRef.current === null) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const percent = (touchX / rect.width) * 100;
    setCupX(Math.max(12, Math.min(88, percent)));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameAreaRef.current === null) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const percent = (mouseX / rect.width) * 100;
    setCupX(Math.max(12, Math.min(88, percent)));
  };

  if (Boolean(isOpen) === false) return null;

  const handleClaim = () => {
    if (onOrderClaimed) {
      onOrderClaimed(order.id);
    }
    onClose();
  };

  const handleSimulateBarista = () => {
    if (onSimulateReady) {
      onSimulateReady(order.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/90 backdrop-blur-md animate-fade-in text-white overflow-y-auto">
      
      {/* Container switches to vibrant orange when order is READY (Tannah Frame_07 style) */}
      <div 
        dir={isAr ? 'rtl' : 'ltr'} 
        className={`relative w-full max-w-sm rounded-3xl p-6 shadow-2xl transition-all duration-500 overflow-hidden ${
          isReady 
            ? 'bg-[#FF5500] text-white border-4 border-white/20' 
            : 'bg-[#121417] text-white border border-white/10'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} p-2 rounded-full transition-colors z-20 ${
            isReady 
              ? 'bg-black/20 hover:bg-black/30 text-white' 
              : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* VIEW A: ORDER READY ALERT (TANNAH BUZZER HIT) */}
        {isReady ? (
          <div className="py-6 text-center flex flex-col items-center animate-fade-in">
            
            {/* Animated Buzzing WiFi Smile Icon */}
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                <div className="w-16 h-16 rounded-full bg-white text-[#FF5500] flex items-center justify-center shadow-2xl">
                  <BellRing className="w-9 h-9 animate-bounce" />
                </div>
              </div>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
              </span>
            </div>

            <span className="text-xs font-bold tracking-widest uppercase opacity-90 block mb-1">
              {merchant.name}
            </span>

            <h2 className="text-3xl font-black tracking-tight mb-2">
              {isAr ? 'طلبك جاهز' : 'Your Order is Ready.'}
            </h2>

            {/* Giant Order Number Badge */}
            <div className="my-3 px-8 py-3 rounded-2xl bg-white text-[#FF5500] shadow-2xl font-black text-4xl font-mono tracking-tight inline-block">
              #{order.orderNumber}
            </div>

            <p className="text-sm font-semibold opacity-95 max-w-xs mt-2">
              {isAr ? 'تفضل استلمه الآن من الكاشير.' : 'Please pick up your beverage at the counter.'}
            </p>

            {/* Loyalty Stamp Reward Auto-Added Callout */}
            <div className="w-full mt-6 p-4 rounded-2xl bg-black/20 border border-white/20 text-left flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/20 text-white shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold block text-sm">
                  {isAr ? 'تمت إضافة الختم لكارتك' : 'Loyalty Stamp Earned'}
                </span>
                <span className="opacity-80 text-[11px]">
                  {isAr 
                    ? `رصيدك الحالي: ${card.currentStamps}/${merchant.totalStamps} أختام.` 
                    : `Your balance is now ${card.currentStamps}/${merchant.totalStamps} stamps.`}
                </span>
              </div>
            </div>

            {/* Claim / Complete Button */}
            <button
              onClick={handleClaim}
              className="w-full h-13 mt-6 rounded-2xl bg-white text-[#FF5500] hover:bg-white/90 active:scale-98 font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isAr ? 'استلمت الطلب وبطاقة الولاء' : 'Claimed Order & Stamp'}</span>
            </button>
          </div>
        ) : (

          /* VIEW B: PREPARING + INTERACTIVE MINI-GAME "FILL THE CUP" */
          <div className="flex flex-col">
            
            {/* Pager Header */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-semibold mb-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>{isAr ? 'جاري تجهيز طلبك في البار' : 'Brewing at the Bar'}</span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  {isAr ? 'طلبك رقم' : 'Order Number'}
                </h3>
                <span className="text-2xl font-black font-mono text-white">
                  #{order.orderNumber}
                </span>
              </div>

              <p className="text-[11px] text-zinc-400 mt-0.5">
                {isAr ? 'بنرن جوالك ونهتزه أول ما يجهز طلبك.' : 'Your phone will buzz and ring once completed.'}
              </p>
            </div>

            {/* MINI-GAME: "Fill The Cup" (املأ الكوب) */}
            <div className="rounded-2xl bg-black/40 border border-white/5 p-3 flex flex-col">
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                  <Coffee className="w-3.5 h-3.5" />
                  <span>{isAr ? 'املأ الكوب أثناء الانتظار' : 'Fill The Cup Game'}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-400">
                  <span>Score: <b className="text-white">{score}</b></span>
                  <span>{cupFillPercent}%</span>
                </div>
              </div>

              {/* Game Area */}
              <div 
                ref={gameAreaRef}
                onTouchMove={handleTouchMove}
                onMouseMove={handleMouseMove}
                className="relative w-full h-56 rounded-xl bg-gradient-to-b from-[#181B1F] to-[#0D0F11] border border-white/5 overflow-hidden select-none cursor-pointer"
              >
                {/* Coffee Beans Falling */}
                {beans.map(b => (
                  <div
                    key={b.id}
                    style={{ left: `${b.x}%`, top: `${b.y}%` }}
                    className="absolute -translate-x-1/2 w-4 h-4 rounded-full bg-[#6B3A26] border border-[#A25B3D] shadow-sm flex items-center justify-center text-[8px]"
                  >
                    🫘
                  </div>
                ))}

                {/* Catching Cup */}
                <div
                  style={{ left: `${cupX}%`, bottom: '10%' }}
                  className="absolute -translate-x-1/2 w-14 h-12 rounded-b-2xl border-2 border-white/40 bg-zinc-800/90 shadow-xl flex flex-col justify-end p-1 overflow-hidden transition-all duration-75"
                >
                  {/* Liquid inside the cup */}
                  <div 
                    style={{ height: `${cupFillPercent}%` }}
                    className="w-full bg-gradient-to-t from-[#452216] to-[#8A4A2D] rounded-b-xl transition-all duration-150"
                  />
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white/70">
                    ☕
                  </div>
                </div>

                {/* Cup Full Success Message */}
                {cupFillPercent >= 100 && (
                  <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-3 animate-fade-in text-center">
                    <Trophy className="w-8 h-8 text-amber-400 mb-1" />
                    <span className="text-xs font-bold text-white">
                      {isAr ? 'الكوب امتلأ بالكامل' : 'Full Cup Achieved.'}
                    </span>
                    <button
                      onClick={() => setCupFillPercent(0)}
                      className="mt-2 px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-bold"
                    >
                      {isAr ? 'العب تاني' : 'Play Again'}
                    </button>
                  </div>
                )}

                <span className="absolute bottom-1 right-2 text-[9px] text-zinc-600 pointer-events-none">
                  {isAr ? 'حرك صباعك لتحريك الكوب' : 'Drag to catch beans'}
                </span>
              </div>
            </div>

            {/* Test Simulation Controls */}
            <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleSimulateBarista}
                className="w-full h-11 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <BellRing className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'تجربة رنين البيجر (كأن الباريستا ضغط جاهز)' : 'Simulate Barista Ready Alert'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full h-10 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-semibold transition-all"
              >
                {isAr ? 'الرجوع لكارت الولاء' : 'Back to Loyalty Card'}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
