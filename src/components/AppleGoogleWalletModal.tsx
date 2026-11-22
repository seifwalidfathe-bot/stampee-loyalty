import React, { useState } from 'react';
import { X, Check, Smartphone, Bell, MapPin, Sparkles } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { CustomerLoyaltyCard, MerchantConfig, Language } from '../types';
import { StampIcon } from './StampIcon';
import { soundEngine } from '../lib/sound';

interface AppleGoogleWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: CustomerLoyaltyCard;
  merchant: MerchantConfig;
  lang: Language;
}

export const AppleGoogleWalletModal: React.FC<AppleGoogleWalletModalProps> = ({
  isOpen,
  onClose,
  card,
  merchant,
  lang,
}) => {
  const [installedType, setInstalledType] = useState<'apple' | 'google' | null>(null);

  if (isOpen === false) return null;

  const handleInstall = (type: 'apple' | 'google') => {
    soundEngine.playRewardChime();
    setInstalledType(type);
    setTimeout(() => {
      setInstalledType(null);
      onClose();
    }, 2200);
  };

  const isAr = lang === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/85 backdrop-blur-md animate-fade-in text-white overflow-y-auto">
      <div 
        dir={isAr ? 'rtl' : 'ltr'} 
        className="relative w-full max-w-sm bg-[#111315] border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-white/5 border border-white/10 text-white mb-2">
            <Smartphone className="w-5 h-5 text-rose-400" />
          </div>
          <h3 className="text-sm font-bold tracking-tight">
            {isAr ? 'إضافة لمحفظة الموبايل' : 'Add to Mobile Wallet'}
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            {isAr 
              ? 'احفظ كارتك في Apple Wallet أو Google Wallet بدون أي تطبيقات' 
              : 'Keep your pass in Apple Wallet or Google Wallet for 1-tap counter access.'}
          </p>
        </div>

        {/* Realistic Apple Wallet Pass Preview */}
        <div className="rounded-2xl p-4 bg-gradient-to-b from-[#1C1D21] to-[#121316] border border-white/10 shadow-2xl relative overflow-hidden mb-5">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xl">{merchant.logoEmoji}</span>
              <div>
                <span className="text-xs font-bold block leading-tight">{merchant.name}</span>
                <span className="text-[10px] text-zinc-400 font-medium">{merchant.tagline}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono block">
                {isAr ? 'الأختام' : 'STAMPS'}
              </span>
              <span className="text-sm font-bold font-mono text-rose-400">
                {card.currentStamps}/{merchant.totalStamps}
              </span>
            </div>
          </div>

          {/* Reward Callout */}
          <div className="py-3">
            <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-semibold block">
              {isAr ? 'المكافأة' : 'NEXT REWARD'}
            </span>
            <span className="text-xs font-bold text-white block mt-0.5">
              {merchant.rewardTitle}
            </span>
          </div>

          {/* Barcode & Geofence Telemetry */}
          <div className="pt-2 border-t border-white/10 flex flex-col items-center">
            <div className="bg-white p-2 rounded-xl mb-1 shadow-inner">
              <QRCodeSVG
                value={`pass://${merchant.slug}/${card.id}`}
                size={88}
                level="M"
              />
            </div>
            <span className="text-[9px] font-mono text-zinc-400">{card.customerPhone}</span>
          </div>

          {/* Smart Wallet Perks */}
          <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-400" />
              <span>{isAr ? 'تنبيه عند الاقتراب' : 'Near-store notification'}</span>
            </span>
            <span className="flex items-center gap-1">
              <Bell className="w-3 h-3 text-amber-400" />
              <span>{isAr ? 'تحديث تلقائي' : 'Live updates'}</span>
            </span>
          </div>
        </div>

        {/* Action Buttons: Add to Apple Wallet & Google Wallet */}
        <div className="space-y-2.5">
          <button
            onClick={() => handleInstall('apple')}
            className="w-full h-11 rounded-2xl bg-black hover:bg-zinc-900 border border-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg"
          >
            <span className="text-base"></span>
            <span>{isAr ? 'إضافة إلى Apple Wallet' : 'Add to Apple Wallet'}</span>
          </button>

          <button
            onClick={() => handleInstall('google')}
            className="w-full h-11 rounded-2xl bg-[#1F2327] hover:bg-[#282E33] border border-white/10 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span className="text-sm font-bold text-blue-400">G</span>
            <span>{isAr ? 'حفظ في Google Wallet' : 'Save to Google Wallet'}</span>
          </button>
        </div>

        {/* Installation Success Notification */}
        {installedType && (
          <div className="absolute inset-0 bg-[#0E1012]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fade-in z-20">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h4 className="text-sm font-bold text-white">
              {installedType === 'apple' ? 'Added to Apple Wallet' : 'Saved to Google Wallet'}
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              {isAr 
                ? 'تم حفظ الكارت في محفظتك. هتوصلك إشعارات وتحديثات أختامك تلقائياً.' 
                : 'Your pass is ready in your mobile wallet with automatic stamp sync.'}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
