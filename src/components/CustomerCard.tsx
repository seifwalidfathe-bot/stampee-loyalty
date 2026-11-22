import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Sparkles, 
  Share2, 
  Gift, 
  Check, 
  Smartphone, 
  QrCode, 
  ShieldCheck,
  History,
  Cake,
  Globe,
  UserPlus,
  Radio,
  Ticket,
  BellRing
} from 'lucide-react';
import { CustomerLoyaltyCard, MerchantConfig, Language, ActiveOrder } from '../types';
import { StampIcon } from './StampIcon';
import { SecretPinModal } from './SecretPinModal';
import { AppleGoogleWalletModal } from './AppleGoogleWalletModal';
import { NfcTapSimulatorModal } from './NfcTapSimulatorModal';
import { DigitalPagerModal } from './DigitalPagerModal';
import { soundEngine } from '../lib/sound';
import { storage } from '../lib/storage';
import { getT } from '../lib/translations';

interface CustomerCardProps {
  card: CustomerLoyaltyCard;
  merchant: MerchantConfig;
  lang: Language;
  onToggleLang: () => void;
  onUpdateCard: (updated: CustomerLoyaltyCard) => void;
  onOpenCashier?: () => void;
  onOpenJoinModal?: () => void;
  onOpenCoupon?: () => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
  card,
  merchant,
  lang,
  onToggleLang,
  onUpdateCard,
  onOpenCashier,
  onOpenJoinModal,
  onOpenCoupon,
}) => {
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isNfcModalOpen, setIsNfcModalOpen] = useState(false);
  const [isPagerModalOpen, setIsPagerModalOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [justStampedIndex, setJustStampedIndex] = useState<number | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const t = getT(lang);
  const isAr = lang === 'ar';

  const orders = storage.getActiveOrders();
  const activeOrder: ActiveOrder = orders.find(o => 
    (o.cardId === card.id || o.customerPhone === card.customerPhone) && (o.status === 'preparing' || o.status === 'ready')
  ) || orders.find(o => o.status === 'preparing' || o.status === 'ready') || {
    id: 'ord-demo-47',
    orderNumber: '47',
    customerPhone: card.customerPhone,
    cardId: card.id,
    status: 'preparing',
    createdAt: new Date().toISOString(),
  };

  const total = merchant.totalStamps;
  const current = card.currentStamps;
  const isCompleted = current >= total;
  const progressPercent = Math.min(100, Math.round((current / total) * 100));

  // Sound trigger helper respecting feature flag
  const playSound = (fn: () => void) => {
    if (merchant.features?.enableSoundEffects === false ? false : true) {
      fn();
    }
  };

  // Check if birthday perk applies
  const isBirthdayMonth = () => {
    if (merchant.features?.enableBirthdayPerk === false) return false;
    if (Boolean(card.birthday) === false) return false;
    try {
      const birthMonth = new Date(card.birthday || '').getMonth();
      const currentMonth = new Date().getMonth();
      return birthMonth === currentMonth;
    } catch {
      return false;
    }
  };

  // Trigger celebration when completed
  useEffect(() => {
    if (isCompleted && card.unredeemedRewards > 0) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#C23A22', '#F59E0B', '#10B981', '#3B82F6']
      });
      playSound(() => soundEngine.playRewardChime());
    }
  }, [isCompleted, card.unredeemedRewards]);

  // Handle staff stamping via PIN
  const handlePinStampSuccess = (stampsToAdd: number) => {
    playSound(() => soundEngine.playStampSound());
    const newCurrent = card.currentStamps + stampsToAdd;
    let newUnredeemed = card.unredeemedRewards;
    let newCompletedCards = card.totalCompletedCards;

    let finalStamps = newCurrent;
    if (newCurrent >= total) {
      newUnredeemed += 1;
      newCompletedCards += 1;
      finalStamps = total;
    }

    const newHistory = [
      ...card.stampsHistory,
      ...Array.from({ length: stampsToAdd }).map((_, i) => ({
        stampIndex: card.currentStamps + i + 1,
        timestamp: new Date().toISOString(),
        cashierName: 'Counter PIN Stamp',
        branch: 'Main Branch',
      }))
    ];

    setJustStampedIndex(finalStamps);
    setTimeout(() => setJustStampedIndex(null), 1000);

    onUpdateCard({
      ...card,
      currentStamps: finalStamps,
      unredeemedRewards: newUnredeemed,
      totalCompletedCards: newCompletedCards,
      stampsHistory: newHistory,
      lastVisited: new Date().toISOString(),
    });
  };

  // Handle reward redemption
  const handleRedeemReward = () => {
    if (card.unredeemedRewards <= 0) return;
    playSound(() => soundEngine.playRewardChime());

    onUpdateCard({
      ...card,
      currentStamps: 0,
      unredeemedRewards: card.unredeemedRewards - 1,
      lastVisited: new Date().toISOString(),
    });

    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 }
    });
  };

  const handleShareCard = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${merchant.name} Loyalty Card`,
          text: `Check my digital stamp card at ${merchant.name}.`,
          url: url,
        });
      } catch {
        // user aborted
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Card Theme Styling
  const getThemeStyles = () => {
    switch (merchant.theme) {
      case 'obsidian-gold':
        return {
          wrapper: 'bg-[#0E1113] border-[#22272B] text-slate-100 shadow-2xl',
          header: 'border-b border-[#22272B] bg-[#14181B]/60',
          slotEmpty: 'border-[#262C31] bg-[#161B1E] text-zinc-600',
          slotFilled: 'bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-sm shadow-amber-500/10',
          accent: 'text-amber-400',
          tag: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
          inkColor: '#F59E0B',
        };
      case 'matcha-minimal':
        return {
          wrapper: 'bg-[#F4F7F2] border-[#DCE4D6] text-[#243324] shadow-xl',
          header: 'border-b border-[#DCE4D6] bg-[#EAF0E6]',
          slotEmpty: 'border-[#CFDAC7] bg-[#E4ECE0] text-[#7A8E76]',
          slotFilled: 'bg-[#2E5A33] border-[#2E5A33] text-[#FAFBF9] shadow-sm',
          accent: 'text-[#2E5A33]',
          tag: 'bg-[#2E5A33]/10 text-[#2E5A33] border-[#2E5A33]/20',
          inkColor: '#2E5A33',
        };
      case 'midnight-rose':
        return {
          wrapper: 'bg-[#120F16] border-[#2B2335] text-slate-100 shadow-2xl',
          header: 'border-b border-[#2B2335] bg-[#1A1621]',
          slotEmpty: 'border-[#2F263B] bg-[#18141F] text-zinc-600',
          slotFilled: 'bg-rose-500/15 border-rose-500/40 text-rose-400 shadow-sm shadow-rose-500/10',
          accent: 'text-rose-400',
          tag: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
          inkColor: '#FB7185',
        };
      case 'tokyo-punch':
        return {
          wrapper: 'bg-[#18181B] border-[#27272A] text-white shadow-2xl',
          header: 'border-b border-[#27272A] bg-[#202024]',
          slotEmpty: 'border-[#3F3F46] bg-[#27272A] text-zinc-500',
          slotFilled: 'bg-orange-500 border-orange-500 text-white shadow-sm shadow-orange-500/30',
          accent: 'text-orange-400',
          tag: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
          inkColor: '#F97316',
        };
      case 'craft-paper':
      default:
        return {
          wrapper: 'paper-texture border-[#DDD3BC] text-[#2C2723] shadow-xl',
          header: 'border-b border-[#E3DAC4] bg-[#F2EDE0]/80',
          slotEmpty: 'border-[#D9CFBA] bg-[#EFE9DA] text-[#A6997E] stamp-slot-debossed',
          slotFilled: 'bg-[#F2ECE0] border-[#C23A22]/50 text-[#C23A22]',
          accent: 'text-[#C23A22]',
          tag: 'bg-[#C23A22]/10 text-[#C23A22] border-[#C23A22]/20',
          inkColor: '#C23A22',
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <div 
      dir={isAr ? 'rtl' : 'ltr'} 
      className="w-full max-w-sm mx-auto flex flex-col items-center select-none pb-8 animate-fade-in"
    >
      
      {/* Top Pass Status & Quick Actions */}
      <div className="w-full flex items-center justify-between px-2 mb-3 text-xs text-zinc-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium tracking-tight">{t.activePass}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 text-zinc-300 hover:text-white px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-colors font-mono font-semibold text-[11px]"
            title="Switch Language (English / عربي)"
          >
            <Globe className="w-3.5 h-3.5 text-rose-400" />
            <span>{isAr ? 'EN' : 'عربي'}</span>
          </button>

          <button
            onClick={() => setShowHistory(prev => (prev ? false : true))}
            className="flex items-center gap-1 hover:text-white px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
            title="View visits history"
          >
            <History className="w-3.5 h-3.5" />
            <span>{t.history}</span>
          </button>

          <button
            onClick={handleShareCard}
            className="flex items-center gap-1 hover:text-white px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
          >
            {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copySuccess ? t.copied : t.share}</span>
          </button>
        </div>
      </div>

      {/* Tannah Digital Pager Live Notification Banner - when active */}
      {merchant.features?.enableDigitalPager && activeOrder && (
        activeOrder.status === 'ready' ? (
          <button
            type="button"
            onClick={() => setIsPagerModalOpen(true)}
            className="w-full mb-3 p-3 rounded-2xl bg-[#FF5500] hover:bg-[#FF6611] text-white flex items-center justify-between shadow-xl shadow-orange-500/25 transition-all animate-bounce-subtle cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white text-[#FF5500] flex items-center justify-center font-black">
                <BellRing className="w-4 h-4 animate-ping" />
              </div>
              <div className="text-left rtl:text-right">
                <span className="text-xs font-bold block">
                  {isAr ? `طلبك #${activeOrder.orderNumber} جاهز للاستلام.` : `Your Order #${activeOrder.orderNumber} is Ready.`}
                </span>
                <span className="text-[10px] opacity-90">
                  {isAr ? 'اضغط لفتح البيجر واستلام هديتك' : 'Tap to open buzzer screen & claim'}
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-xl bg-white/20 text-xs font-bold">
              {isAr ? 'افتح' : 'Open'}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsPagerModalOpen(true)}
            className="w-full mb-3 p-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-between transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-semibold">
                {isAr 
                  ? `طلبك #${activeOrder.orderNumber} قيد التجهيز ☕ العب املأ الكوب` 
                  : `Order #${activeOrder.orderNumber} brewing. Play Fill the Cup.`}
              </span>
            </div>
            <span className="text-[10px] text-amber-400 underline font-mono font-medium">
              {isAr ? 'البيجر واللعبة' : 'Live Pager'}
            </span>
          </button>
        )
      )}

      {/* Birthday Perk Alert Banner */}
      {isBirthdayMonth() && (
        <div className="w-full mb-3 p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 to-rose-500/15 border border-amber-500/30 flex items-center gap-2.5 animate-subtle-pulse">
          <Cake className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="text-[11px]">
            <span className="font-bold text-amber-300 block">{t.birthdayPerk}</span>
            <span className="text-zinc-300">{merchant.birthdayReward}</span>
          </div>
        </div>
      )}

      {/* Main Tactile Stamp Card */}
      <div className={`relative w-full rounded-3xl border transition-all duration-300 overflow-hidden ${theme.wrapper}`}>
        
        {/* Card Header */}
        <div className={`p-5 flex items-center justify-between ${theme.header}`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-black/5 border border-black/5 shadow-inner">
              {merchant.logoEmoji}
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight leading-snug">{merchant.name}</h2>
              <p className="text-[11px] opacity-70 line-clamp-1">{merchant.tagline}</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wide uppercase ${theme.tag}`}>
              {current}/{total} {t.stamps}
            </span>
          </div>
        </div>

        {/* Reward Goal Banner */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-start gap-2.5 bg-black/[0.03] p-3 rounded-2xl border border-black/5">
            <div className={`p-2 rounded-xl bg-white/50 shadow-sm shrink-0 ${theme.accent}`}>
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold tracking-tight opacity-90 uppercase">{t.rewardGoal}</div>
              <div className="text-xs font-semibold leading-tight mt-0.5">{merchant.rewardTitle}</div>
            </div>
          </div>
        </div>

        {/* Stamp Grid */}
        <div className="p-5">
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: total }).map((_, index) => {
              const stampNum = index + 1;
              const isStamped = stampNum <= current;
              const isJustStamped = stampNum === justStampedIndex;
              const isRewardSlot = stampNum === total;

              // Generate slight deterministic angle for realistic rubber stamp feel
              const rotation = ((stampNum * 37) % 18) - 9; // between -9 and +8 deg

              return (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center aspect-square"
                >
                  <div
                    style={{ '--stamp-rot': `${rotation}deg` } as React.CSSProperties}
                    className={`relative w-full h-full rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border ${
                      isStamped
                        ? `${theme.slotFilled} ${isJustStamped ? 'animate-stamp-press' : ''}`
                        : `${theme.slotEmpty} border-dashed`
                    }`}
                  >
                    {isStamped ? (
                      <div 
                        style={{ transform: `rotate(${rotation}deg)` }} 
                        className="flex flex-col items-center justify-center stamped-ink transition-transform"
                      >
                        <StampIcon type={merchant.stampIcon} className="w-6 h-6" />
                        <span className="text-[8px] font-mono font-bold tracking-tighter mt-0.5 opacity-80">
                          #{stampNum}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center opacity-40">
                        {isRewardSlot ? (
                          <Gift className="w-5 h-5 text-amber-500 opacity-80" />
                        ) : (
                          <StampIcon type={merchant.stampIcon} className="w-5 h-5" />
                        )}
                        <span className="text-[9px] font-mono mt-0.5">{stampNum}</span>
                      </div>
                    )}

                    {/* Subtle completed badge */}
                    {isStamped && (
                      <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="mt-4 pt-2">
            <div className="flex justify-between text-[11px] font-medium opacity-75 mb-1.5">
              <span>{isCompleted ? t.cardCompleted : `${total - current} ${t.moreStamps}`}</span>
              <span className="font-mono">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
              <div 
                className="h-full transition-all duration-500 rounded-full"
                style={{ 
                  width: `${progressPercent}%`,
                  backgroundColor: theme.inkColor
                }}
              />
            </div>
          </div>
        </div>

        {/* Perforated Divider */}
        <div className="perforated-border h-1 w-full my-1"></div>

        {/* Card Footer: Reward Redemption or Customer Code */}
        <div className="p-5 pt-3">
          {card.unredeemedRewards > 0 ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-center animate-subtle-pulse">
              <div className="inline-flex items-center justify-center p-2 rounded-full bg-emerald-500 text-white mb-2 shadow-lg shadow-emerald-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                {t.readyToRedeem}
              </h4>
              <p className="text-xs opacity-80 mt-1 mb-3">
                {t.showToBarista} {merchant.rewardTitle}.
              </p>
              <button
                onClick={handleRedeemReward}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-wide transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{t.redeemButton}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] tracking-wider uppercase opacity-60 font-semibold block">
                  {t.customerCardId}
                </span>
                <span className="font-mono text-xs font-bold opacity-90">{card.customerPhone}</span>
                {card.customerName && (
                  <span className="text-[11px] text-zinc-500 block">{card.customerName}</span>
                )}
              </div>
              <button
                onClick={() => setShowQR(prev => (prev ? false : true))}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-black/10 bg-black/5 hover:bg-black/10 text-xs font-medium transition-all"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{showQR ? t.hideQr : t.showQr}</span>
              </button>
            </div>
          )}

          {/* QR Code Reveal Drawer */}
          {showQR && (
            <div className="mt-4 p-4 rounded-2xl bg-white text-black flex flex-col items-center justify-center border border-zinc-200 shadow-md animate-fade-in">
              <div className="p-2 bg-white rounded-xl shadow-inner border border-zinc-100">
                <QRCodeSVG
                  value={`stampee://${card.id}?phone=${encodeURIComponent(card.customerPhone)}`}
                  size={140}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className="text-[11px] font-medium text-zinc-500 mt-2 text-center">
                {t.scanInstruction}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons: Add to Apple/Google Wallet + Staff Stamp */}
      <div className="w-full mt-4 flex flex-col gap-2.5">
        
        {/* Apple & Google Wallet Button */}
        {merchant.features?.enableMobileWallet && (
          <button
            onClick={() => setIsWalletModalOpen(true)}
            className="w-full h-11 rounded-2xl bg-black/60 hover:bg-black/80 active:scale-98 border border-white/15 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="text-sm"></span>
            <span>{t.addToWallet}</span>
          </button>
        )}

        {/* NFC Counter Tap Simulation Button (StampForYou style) */}
        {merchant.features?.enableNfcTap && (
          <button
            onClick={() => setIsNfcModalOpen(true)}
            className="w-full h-11 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-98 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>{isAr ? 'تجربة لمس قرص الـ NFC بالكاونتر' : 'Simulate Counter NFC Tap'}</span>
          </button>
        )}

        {/* Tannah Digital Pager & Waiting Mini-Game */}
        {merchant.features?.enableDigitalPager && (
          <button
            type="button"
            onClick={() => setIsPagerModalOpen(true)}
            className="w-full h-11 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 active:scale-98 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <BellRing className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'بيجر الطلبات ولعبة املأ الكوب' : 'Digital Order Pager & Waiting Game'}</span>
          </button>
        )}

        {/* Staff Quick Stamp Button */}
        {merchant.features?.enableSecretStaffPin && (
          <button
            onClick={() => setIsPinModalOpen(true)}
            className="w-full h-11 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-98 border border-white/10 text-zinc-300 text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>{t.staffQuickStamp}</span>
          </button>
        )}

        {/* Sub Links */}
        <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-zinc-500">
          <button
            onClick={() => {
              if (onOpenCashier) onOpenCashier();
            }}
            className="hover:text-zinc-300 transition-colors flex items-center gap-1"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{t.openCashierTerminal}</span>
          </button>
          
          {merchant.features?.enableCouponHook && onOpenCoupon && (
            <button
              onClick={onOpenCoupon}
              className="hover:text-amber-300 text-amber-400/90 font-medium transition-colors flex items-center gap-1"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>{isAr ? 'كوبون القهوة الأولى' : '1st Coffee Coupon'}</span>
            </button>
          )}

          {onOpenJoinModal && (
            <button
              onClick={onOpenJoinModal}
              className="hover:text-rose-400 transition-colors flex items-center gap-1 text-rose-400/90 font-medium"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isAr ? 'عميل جديد؟' : 'New Member?'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Visit History Drawer */}
      {showHistory && (
        <div className="w-full mt-4 p-4 rounded-2xl bg-[#14171A] border border-white/10 text-zinc-300 text-xs animate-fade-in">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
            <span className="font-bold text-white flex items-center gap-1.5">
              <History className="w-4 h-4 text-rose-400" />
              <span>{t.visitsHistory}</span>
            </span>
            <span className="text-[10px] text-zinc-500">{card.stampsHistory.length} {t.stamps}</span>
          </div>

          {card.stampsHistory.length === 0 ? (
            <p className="text-zinc-500 text-center py-3">{t.noHistory}</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {card.stampsHistory.slice().reverse().map((h, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px] font-mono font-bold">
                      #{h.stampIndex}
                    </div>
                    <div>
                      <div className="font-medium text-white text-[11px]">#{h.stampIndex} {t.stampCollected}</div>
                      <div className="text-[10px] text-zinc-500">{h.cashierName || 'Staff Stamp'}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {new Date(h.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Secret PIN Modal for Direct Stamping */}
      <SecretPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        correctPin={merchant.cashierPin}
        onSuccess={handlePinStampSuccess}
      />

      {/* Apple & Google Wallet Pass Modal */}
      <AppleGoogleWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        card={card}
        merchant={merchant}
        lang={lang}
      />

      {/* NFC Counter Tap Simulator Modal (StampForYou style) */}
      <NfcTapSimulatorModal
        isOpen={isNfcModalOpen}
        onClose={() => setIsNfcModalOpen(false)}
        card={card}
        merchant={merchant}
        lang={lang}
        onStampAdded={() => handlePinStampSuccess(1)}
      />

      {/* Tannah Digital Pager & Waiting Mini-Game Modal */}
      {merchant.features?.enableDigitalPager && (
        <DigitalPagerModal
          isOpen={isPagerModalOpen}
          onClose={() => setIsPagerModalOpen(false)}
          order={activeOrder}
          merchant={merchant}
          card={card}
          lang={lang}
          onOrderClaimed={(orderId) => {
            storage.updateOrderStatus(orderId, 'picked_up');
            handlePinStampSuccess(1);
          }}
          onSimulateReady={(orderId) => {
            storage.updateOrderStatus(orderId, 'ready');
          }}
        />
      )}
    </div>
  );
};
