import React, { useState } from 'react';
import { X, Radio, Smartphone, CheckCircle2, Sparkles, Coffee } from 'lucide-react';
import { CustomerLoyaltyCard, MerchantConfig, Language } from '../types';
import { soundEngine } from '../lib/sound';

interface NfcTapSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: CustomerLoyaltyCard;
  merchant: MerchantConfig;
  lang: Language;
  onStampAdded: () => void;
}

export const NfcTapSimulatorModal: React.FC<NfcTapSimulatorModalProps> = ({
  isOpen,
  onClose,
  card,
  merchant,
  lang,
  onStampAdded,
}) => {
  const [isTapping, setIsTapping] = useState(false);
  const [tapSuccess, setTapSuccess] = useState(false);

  if (isOpen === false) return null;

  const isAr = lang === 'ar';

  const handleSimulateTap = () => {
    setIsTapping(true);
    soundEngine.playKeypadTick();

    setTimeout(() => {
      soundEngine.playStampSound();
      setIsTapping(false);
      setTapSuccess(true);
      onStampAdded();

      setTimeout(() => {
        setTapSuccess(false);
        onClose();
      }, 1800);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-white">
      <div 
        dir={isAr ? 'rtl' : 'ltr'} 
        className="relative w-full max-w-sm bg-[#121518] border border-white/10 rounded-3xl p-6 shadow-2xl text-center overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-base font-bold text-white">
            {isAr ? 'محاكي لمس الـ NFC على الكاونتر' : 'NFC Counter Tap Simulator'}
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            {isAr 
              ? 'محاكاة تجربة الزبون لما يقرب موبايله من قرص الـ NFC الخشبي عند الكاشير.' 
              : 'Simulates the instant 1-second tap on the counter NFC puck.'}
          </p>
        </div>

        {/* The Physical Counter Puck Visual */}
        <div className="my-6 relative flex flex-col items-center justify-center">
          
          {/* Circular NFC Puck / Disc */}
          <div className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-300 shadow-2xl ${
            tapSuccess
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 scale-105'
              : isTapping
              ? 'bg-rose-500/20 border-rose-500 text-rose-300 scale-95'
              : 'bg-[#1C2025] border-[#2E353E] text-zinc-300 hover:border-emerald-500/50'
          }`}>
            <Radio className="w-10 h-10 mb-1" />
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
              {merchant.name.split(' ')[0]} NFC
            </span>
          </div>

          {/* Smartphone Hovering Animation */}
          <div className={`mt-4 flex items-center gap-2 text-xs font-mono transition-all ${
            tapSuccess ? 'text-emerald-400 font-bold' : 'text-zinc-400'
          }`}>
            <Smartphone className="w-4 h-4" />
            <span>{tapSuccess ? (isAr ? 'تم الختم بالـ NFC بنجاح' : 'NFC Stamped Successfully') : card.customerPhone}</span>
          </div>
        </div>

        {/* Action Button: Tap */}
        {tapSuccess ? (
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>+1 Stamp Added via Counter NFC Puck.</span>
          </div>
        ) : (
          <button
            onClick={handleSimulateTap}
            disabled={isTapping}
            className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
          >
            <Radio className="w-4 h-4" />
            <span>{isAr ? 'المس القرص بالموبايل الآن' : 'Hold Phone to NFC Puck'}</span>
          </button>
        )}

        <p className="mt-4 text-[10px] text-zinc-500">
          {isAr ? 'يعمل بدون فتح أي كاميرا أو تطبيق بمجرد ملامسة الهاتف للقرص.' : 'Works natively without opening camera via standard NDEF web URL.'}
        </p>

      </div>
    </div>
  );
};
