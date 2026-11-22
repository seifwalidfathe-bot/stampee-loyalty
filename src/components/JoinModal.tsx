import React, { useState } from 'react';
import { X, Sparkles, Gift, Check, Phone, User, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MerchantConfig, CustomerLoyaltyCard, Language } from '../types';
import { soundEngine } from '../lib/sound';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchant: MerchantConfig;
  onJoinSuccess: (card: CustomerLoyaltyCard) => void;
  lang: Language;
}

export const JoinModal: React.FC<JoinModalProps> = ({
  isOpen,
  onClose,
  merchant,
  onJoinSuccess,
  lang,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isOpen === false) return null;

  const isAr = lang === 'ar';
  const hasWelcomeBonus = typeof merchant.features?.enableWelcomeBonus === 'boolean'
    ? merchant.features.enableWelcomeBonus 
    : Boolean(merchant.welcomeStampBonus);
  const hasBirthdayPerk = merchant.features?.enableBirthdayPerk === false ? false : true;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim().length === 0) return;

    setIsSubmitting(true);
    soundEngine.playStampSound();

    const welcomeStamp = hasWelcomeBonus ? 1 : 0;

    const newCard: CustomerLoyaltyCard = {
      id: 'card-' + Math.random().toString(36).substring(2, 9),
      merchantId: merchant.id,
      customerPhone: phone.trim(),
      customerName: name.trim() || undefined,
      birthday: birthday.trim() || undefined,
      currentStamps: welcomeStamp,
      totalCompletedCards: 0,
      unredeemedRewards: 0,
      stampsHistory: welcomeStamp > 0 ? [{
        stampIndex: 1,
        timestamp: new Date().toISOString(),
        cashierName: 'Welcome Gift Stamp',
        branch: 'Auto-Welcome',
      }] : [],
      lastVisited: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    if (welcomeStamp > 0) {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
      soundEngine.playRewardChime();
    }

    setTimeout(() => {
      onJoinSuccess(newCard);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/85 backdrop-blur-md animate-fade-in text-white overflow-y-auto">
      <div 
        dir={isAr ? 'rtl' : 'ltr'} 
        className="relative w-full max-w-sm bg-[#121417] border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 border border-rose-500/30 text-rose-400 mb-3 shadow-md">
            <Gift className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold tracking-tight text-white">
            {isAr ? `انضم لبرنامج ولاء ${merchant.name}` : `Join ${merchant.name} Loyalty`}
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            {isAr 
              ? (hasWelcomeBonus 
                  ? 'سجل في 10 ثواني واستلم أول ختم مجاناً في كارتك.' 
                  : 'سجل رقمك في 10 ثواني وابدأ جمع أختامك.')
              : (hasWelcomeBonus 
                  ? 'Register in 10 seconds and claim your first welcome stamp for free.' 
                  : 'Register in 10 seconds to start collecting your stamps.')}
          </p>
        </div>

        {/* Welcome Bonus Callout */}
        {hasWelcomeBonus && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="text-[11px] text-amber-200">
              <span className="font-bold block">
                {isAr ? 'هدية ترحيبية فورية' : 'Instant Welcome Stamp'}
              </span>
              <span>
                {isAr 
                  ? 'أول ختم محسوب هدية عند التسجيل' 
                  : 'Your first cup stamp is on the house today.'}
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
              {isAr ? 'الاسم' : 'Your Name'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={isAr ? 'مثال: سيف وليد' : 'e.g. Seif Walid'}
                className="w-full h-11 pl-10 pr-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
              {isAr ? 'رقم الموبايل (ضروري للكارت)' : 'Phone Number (Required)'}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="010XXXXXXXX"
                className="w-full h-11 pl-10 pr-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {hasBirthdayPerk && (
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                {isAr ? 'تاريخ الميلاد (لهدية عيد ميلادك)' : 'Birthday (for birthday reward)'}
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={birthday}
                  onChange={e => setBirthday(e.target.value)}
                  className="w-full h-11 pl-10 pr-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 mt-2 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30"
          >
            <Check className="w-4 h-4" />
            <span>
              {isAr ? 'إنشاء الكارت واستلام الختم' : 'Create Card & Get Stamp'}
            </span>
          </button>
        </form>

        <p className="mt-4 text-[10px] text-zinc-500 text-center">
          {isAr ? 'بدون أي باسوردات أو تطبيقات. كارتك محفوظ دائماً.' : 'No passwords or downloads needed. Stored in your phone browser.'}
        </p>
      </div>
    </div>
  );
};
