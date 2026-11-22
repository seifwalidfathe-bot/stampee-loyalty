import React, { useState } from 'react';
import { 
  Scan, 
  Search, 
  Plus, 
  CheckCircle2, 
  Gift, 
  Smartphone, 
  History, 
  Sparkles,
  ArrowRight,
  UserCheck,
  RotateCcw
} from 'lucide-react';
import { CustomerLoyaltyCard, MerchantConfig } from '../types';
import { soundEngine } from '../lib/sound';
import { StampIcon } from './StampIcon';

interface CashierScannerProps {
  merchant: MerchantConfig;
  cards: CustomerLoyaltyCard[];
  activeCardId: string;
  onUpdateCard: (updated: CustomerLoyaltyCard) => void;
  onSelectCard: (cardId: string) => void;
  onCustomerCreated: (phone: string) => CustomerLoyaltyCard;
}

export const CashierScanner: React.FC<CashierScannerProps> = ({
  merchant,
  cards,
  activeCardId,
  onUpdateCard,
  onSelectCard,
  onCustomerCreated,
}) => {
  const [searchPhone, setSearchPhone] = useState('');
  const [stampFeedback, setStampFeedback] = useState<string | null>(null);
  const [cameraScanning, setCameraScanning] = useState(false);

  const activeCard = cards.find(c => c.id === activeCardId) || cards[0];

  const handleAddStamp = (count: number) => {
    if (Boolean(activeCard) === false) return;

    soundEngine.playStampSound();
    const newCurrent = activeCard.currentStamps + count;
    let newUnredeemed = activeCard.unredeemedRewards;
    let newCompleted = activeCard.totalCompletedCards;

    let finalCurrent = newCurrent;
    let unlocked = false;

    if (newCurrent >= merchant.totalStamps) {
      newUnredeemed += 1;
      newCompleted += 1;
      finalCurrent = merchant.totalStamps;
      unlocked = true;
      soundEngine.playRewardChime();
    }

    const newHistory = [
      ...activeCard.stampsHistory,
      ...Array.from({ length: count }).map((_, i) => ({
        stampIndex: activeCard.currentStamps + i + 1,
        timestamp: new Date().toISOString(),
        cashierName: 'Cashier POS Terminal',
        branch: 'Branch 01',
      }))
    ];

    const updated: CustomerLoyaltyCard = {
      ...activeCard,
      currentStamps: finalCurrent,
      unredeemedRewards: newUnredeemed,
      totalCompletedCards: newCompleted,
      stampsHistory: newHistory,
      lastVisited: new Date().toISOString(),
    };

    onUpdateCard(updated);
    setStampFeedback(unlocked ? `Reward earned for ${activeCard.customerName || activeCard.customerPhone}.` : `Stamped +${count}. Total: ${finalCurrent}/${merchant.totalStamps}.`);
    setTimeout(() => setStampFeedback(null), 2500);
  };

  const handleRedeem = () => {
    if (Boolean(activeCard) === false || activeCard.unredeemedRewards <= 0) return;

    soundEngine.playRewardChime();
    const updated: CustomerLoyaltyCard = {
      ...activeCard,
      currentStamps: 0,
      unredeemedRewards: activeCard.unredeemedRewards - 1,
      lastVisited: new Date().toISOString(),
    };

    onUpdateCard(updated);
    setStampFeedback(`Reward redeemed: ${merchant.rewardTitle}.`);
    setTimeout(() => setStampFeedback(null), 2500);
  };

  const handleLookupOrCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchPhone.trim().length === 0) return;

    const existing = cards.find(c => c.customerPhone.includes(searchPhone.trim()));
    if (existing) {
      onSelectCard(existing.id);
      setStampFeedback(`Found member: ${existing.customerName || existing.customerPhone}.`);
    } else {
      const created = onCustomerCreated(searchPhone.trim());
      onSelectCard(created.id);
      setStampFeedback(`New card created for ${created.customerPhone}.`);
    }
    setSearchPhone('');
    setTimeout(() => setStampFeedback(null), 2500);
  };

  const simulateCameraScan = (targetCard: CustomerLoyaltyCard) => {
    setCameraScanning(true);
    soundEngine.playKeypadTick();
    setTimeout(() => {
      setCameraScanning(false);
      onSelectCard(targetCard.id);
      soundEngine.playStampSound();
      setStampFeedback(`QR Code verified for ${targetCard.customerName || targetCard.customerPhone}.`);
      setTimeout(() => setStampFeedback(null), 2500);
    }, 700);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4 pb-12 animate-fade-in text-white">
      
      {/* Terminal Header */}
      <div className="bg-[#121517] border border-[#22272B] rounded-3xl p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Cashier Stamping Terminal</h2>
              <p className="text-[11px] text-zinc-400">{merchant.name} — Shift #01</p>
            </div>
          </div>
          <span className="px-2 py-1 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Ready to Stamp
          </span>
        </div>

        {/* Quick Customer Lookup Form */}
        <form onSubmit={handleLookupOrCreate} className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchPhone}
              onChange={e => setSearchPhone(e.target.value)}
              placeholder="Enter customer phone (e.g. 01002345678)"
              className="w-full h-11 pl-10 pr-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500/50 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 h-11 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold text-white border border-white/10 transition-all shrink-0"
          >
            Lookup
          </button>
        </form>

        {/* Quick Customer Switcher / Scan Simulation */}
        <div className="mt-3">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 block mb-2">
            Simulate Customer QR Scan
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {cards.slice(0, 4).map(c => (
              <button
                key={c.id}
                onClick={() => simulateCameraScan(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono border whitespace-nowrap transition-all ${
                  c.id === activeCard?.id
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 font-bold'
                    : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {c.customerName || c.customerPhone.slice(-6)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Feedback Banner */}
      {stampFeedback && (
        <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-2xl p-3.5 text-xs font-medium text-emerald-300 flex items-center gap-2 animate-fade-in shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{stampFeedback}</span>
        </div>
      )}

      {/* Active Customer Profile & Quick Stamping Actions */}
      {activeCard ? (
        <div className="bg-[#121517] border border-[#22272B] rounded-3xl p-5 shadow-2xl space-y-5">
          
          {/* Customer Telemetry */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold text-sm">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight text-white">
                  {activeCard.customerName || 'Loyalty Member'}
                </h3>
                <span className="font-mono text-xs text-zinc-400 block mt-0.5">
                  {activeCard.customerPhone}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block">Status</span>
              <span className="font-bold text-sm text-rose-400 font-mono">
                {activeCard.currentStamps} / {merchant.totalStamps} Stamps
              </span>
            </div>
          </div>

          {/* Stamps Visual Progress Preview */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
            <div className="grid grid-cols-8 gap-2">
              {Array.from({ length: merchant.totalStamps }).map((_, i) => {
                const isFilled = i < activeCard.currentStamps;
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-xl border flex items-center justify-center text-xs transition-all ${
                      isFilled
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 font-bold scale-105'
                        : 'bg-white/5 border-white/5 text-zinc-600'
                    }`}
                  >
                    {isFilled ? <StampIcon type={merchant.stampIcon} className="w-3.5 h-3.5" /> : (i + 1)}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons: 1-Tap Fast Stamping */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => handleAddStamp(1)}
              className="h-14 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-sm transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 border border-rose-400/30"
            >
              <Plus className="w-5 h-5" />
              <span>+1 Stamp</span>
            </button>

            <button
              onClick={() => handleAddStamp(2)}
              className="h-14 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-95 text-white font-bold text-sm transition-all border border-white/10 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>+2 Stamps (Combo)</span>
            </button>
          </div>

          {/* Redeem Reward Button (if applicable) */}
          {activeCard.unredeemedRewards > 0 && (
            <div className="pt-2 border-t border-white/5">
              <button
                onClick={handleRedeem}
                className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 animate-bounce-subtle"
              >
                <Gift className="w-4 h-4" />
                <span>Redeem: {merchant.rewardTitle} ({activeCard.unredeemedRewards} Available)</span>
              </button>
            </div>
          )}

          {/* Customer History Log */}
          <div className="pt-2 text-[11px] text-zinc-500 flex items-center justify-between">
            <span>Last visit: {new Date(activeCard.lastVisited).toLocaleDateString()}</span>
            <span>Total completed cards: {activeCard.totalCompletedCards}</span>
          </div>

        </div>
      ) : null}

      {/* Camera Simulator Overlay */}
      {cameraScanning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md">
          <div className="w-64 h-64 border-2 border-rose-500/80 rounded-3xl relative flex items-center justify-center overflow-hidden animate-pulse">
            <div className="absolute inset-x-0 h-0.5 bg-rose-400 shadow-lg shadow-rose-400 animate-scan-line top-0" />
            <Smartphone className="w-16 h-16 text-rose-400/50" />
            <span className="absolute bottom-4 text-xs font-mono text-zinc-300">Scanning QR Code...</span>
          </div>
        </div>
      )}
    </div>
  );
};
