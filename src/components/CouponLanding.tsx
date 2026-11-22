import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Gift, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Lock, 
  Smartphone, 
  ShieldCheck, 
  Coffee,
  Ticket
} from 'lucide-react';
import { MerchantConfig, CustomerLoyaltyCard, Language } from '../types';
import { soundEngine } from '../lib/sound';
import { SecretPinModal } from './SecretPinModal';
import { getT } from '../lib/translations';

interface CouponLandingProps {
  merchant: MerchantConfig;
  card: CustomerLoyaltyCard;
  lang: Language;
  onCouponTransformed: (updatedCard: CustomerLoyaltyCard) => void;
  onOpenCard: () => void;
}

export const CouponLanding: React.FC<CouponLandingProps> = ({
  merchant,
  card,
  lang,
  onCouponTransformed,
  onOpenCard,
}) => {
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isClaimed, setIsClaimed] = useState(Boolean(card.claimedCouponId));
  const isAr = lang === 'ar';
  const t = getT(lang);

  const handleRedeemSuccess = () => {
    soundEngine.playStampSound();
    soundEngine.playRewardChime();

    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 }
    });

    const updatedCard: CustomerLoyaltyCard = {
      ...card,
      currentStamps: Math.max(card.currentStamps, 1),
      claimedCouponId: 'COUPON-WELCOME-1',
      stampsHistory: [
        ...card.stampsHistory,
        {
          stampIndex: 1,
          timestamp: new Date().toISOString(),
          cashierName: 'Welcome Voucher Redeemed',
          branch: 'Main Branch',
        }
      ],
      lastVisited: new Date().toISOString(),
    };

    setIsClaimed(true);
    setTimeout(() => {
      onCouponTransformed(updatedCard);
    }, 1200);
  };

  return (
    <div 
      dir={isAr ? 'rtl' : 'ltr'} 
      className="w-full max-w-sm mx-auto flex flex-col items-center select-none pb-8 animate-fade-in text-white"
    >
      
      {/* Top Banner Tag */}
      <div className="w-full flex items-center justify-between px-2 mb-3 text-xs text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Ticket className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-medium text-amber-300">{t.couponBadge}</span>
        </div>
        <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-zinc-400">
          ONE-TIME PASS
        </span>
      </div>

      {/* The Perforated Ticket Card */}
      <div className="relative w-full rounded-3xl bg-[#FAF7EE] text-[#1C1917] border-2 border-[#E2D8C0] shadow-2xl overflow-hidden transition-all duration-500">
        
        {/* Ticket Header */}
        <div className="p-6 bg-[#F4EFE0] border-b border-[#E3DAC4] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-[#E5DAC4] flex items-center justify-center text-2xl">
              {merchant.logoEmoji}
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight text-[#2C2723]">{merchant.name}</h2>
              <p className="text-[11px] text-[#7D705C]">{merchant.tagline}</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#C23A22]/10 text-[#C23A22] border border-[#C23A22]/20 uppercase">
            FREE CUP
          </span>
        </div>

        {/* Voucher Offer Body */}
        <div className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#C23A22]/10 text-[#C23A22] mb-3 shadow-inner">
            <Coffee className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-extrabold tracking-tight text-[#2C2723]">
            {t.couponTitle}
          </h3>

          <p className="text-xs text-[#7D705C] mt-2 leading-relaxed px-2">
            {t.couponSub}
          </p>

          <div className="my-5 p-3 rounded-2xl bg-white border border-[#E5DAC4] shadow-sm flex items-center justify-center gap-2">
            <span className="font-mono text-sm font-bold tracking-widest text-[#2C2723]">
              WELCOME-COFFEE-FREE
            </span>
          </div>

          {/* QR Code for Cashier Scan */}
          <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-[#E5DAC4] max-w-[170px] mx-auto shadow-sm">
            <QRCodeSVG
              value={`coupon://${merchant.slug}/${card.id}`}
              size={130}
              level="M"
            />
            <span className="text-[10px] font-mono text-[#7D705C] mt-1.5">
              {card.customerPhone}
            </span>
          </div>
        </div>

        {/* Ticket Perforation Notch (Left & Right) */}
        <div className="relative h-6 w-full flex items-center justify-between overflow-hidden">
          <div className="w-6 h-6 rounded-full bg-[#08090A] -ml-3" />
          <div className="perforated-border h-0.5 w-full mx-2" />
          <div className="w-6 h-6 rounded-full bg-[#08090A] -mr-3" />
        </div>

        {/* Ticket Footer Action */}
        <div className="p-5 bg-[#F4EFE0]/60 text-center">
          {isClaimed ? (
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-bold animate-subtle-pulse flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{t.couponRedeemed}</span>
            </div>
          ) : (
            <button
              onClick={() => setIsPinModalOpen(true)}
              className="w-full h-12 rounded-2xl bg-[#C23A22] hover:bg-[#A9321D] text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t.claimCouponBtn}</span>
            </button>
          )}

          <p className="text-[10px] text-[#A6997E] mt-2.5">
            {isAr ? 'الكاشير يدخل الـ PIN لاستلام القهوة وتحويل الكوبون لكارت دائم.' : 'Cashier enters staff PIN to claim drink and activate card.'}
          </p>
        </div>

      </div>

      {/* Button to Switch to Standard Card */}
      <div className="mt-4 w-full">
        <button
          onClick={onOpenCard}
          className="w-full py-2 text-xs text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-1"
        >
          <span>{isAr ? 'عرض كارت الولاء المعتاد' : 'View Standard Loyalty Card'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cashier Verification PIN Modal */}
      <SecretPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        correctPin={merchant.cashierPin}
        onSuccess={handleRedeemSuccess}
      />

    </div>
  );
};
