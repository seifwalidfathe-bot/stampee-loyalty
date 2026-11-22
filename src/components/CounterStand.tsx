import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Sparkles, Smartphone, ArrowLeft, Radio, HelpCircle, Check, Copy } from 'lucide-react';
import { MerchantConfig, Language } from '../types';
import { getT } from '../lib/translations';

interface CounterStandProps {
  merchant: MerchantConfig;
  lang: Language;
  onBack: () => void;
}

export const CounterStand: React.FC<CounterStandProps> = ({ merchant, lang, onBack }) => {
  const [showNfcGuide, setShowNfcGuide] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const isAr = lang === 'ar';
  const t = getT(lang);

  const cardUrl = typeof window === 'undefined'
    ? `https://stampee.app/${merchant.slug}`
    : `${window.location.origin}/?merchant=${merchant.slug}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(cardUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div 
      dir={isAr ? 'rtl' : 'ltr'} 
      className="w-full max-w-xl mx-auto pb-12 animate-fade-in text-white"
    >
      
      {/* Top Bar for Actions */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isAr ? 'الرجوع للوحة التحكم' : 'Back to Dashboard'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNfcGuide(prev => (prev ? false : true))}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-semibold transition-all"
          >
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>{isAr ? 'دليل شريحة NFC' : 'NFC Setup Guide'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/30 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printStand}</span>
          </button>
        </div>
      </div>

      {/* Printable Table Tent Container */}
      <div className="bg-[#FAF7EE] text-[#1C1917] rounded-3xl p-8 md:p-12 shadow-2xl border-4 border-[#E2D8C0] text-center flex flex-col items-center justify-between relative overflow-hidden print:m-0 print:p-8 print:border-2 print:shadow-none">
        
        {/* Subtle decorative corners */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#C23A22]/40 rounded-tl" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#C23A22]/40 rounded-tr" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#C23A22]/40 rounded-bl" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#C23A22]/40 rounded-br" />

        {/* Brand Header */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-md border border-[#E5DAC4] text-3xl mb-3">
            {merchant.logoEmoji}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#2C2723]">
            {merchant.name}
          </h1>
          <p className="text-xs md:text-sm font-medium text-[#7D705C] mt-1">
            {merchant.tagline}
          </p>
        </div>

        {/* Combined Dual Interaction Zone (NFC Tap & QR Code) */}
        <div className="my-2 p-6 bg-white rounded-3xl shadow-xl border border-[#E5DAC4] flex flex-col items-center max-w-sm w-full">
          
          {/* NFC Disc Icon */}
          {merchant.features?.enableNfcTap && (
            <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-bold">
              <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>{t.nfcTapStand}</span>
            </div>
          )}

          <QRCodeSVG
            value={cardUrl}
            size={170}
            level="H"
            includeMargin={true}
            bgColor="#FFFFFF"
            fgColor="#1C1917"
          />

          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-[#C23A22] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.nfcOrQr}</span>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="mt-6 max-w-sm">
          <h3 className="text-base md:text-lg font-bold text-[#1C1917]">
            {isAr ? 'اجمع أختامك واستلم هديتك' : 'Collect Stamps. Earn Rewards.'}
          </h3>
          <p className="text-xs text-[#7D705C] mt-1">
            {isAr ? `اجمع ${merchant.totalStamps} أختام واحصل على:` : `Collect ${merchant.totalStamps} stamps to earn:`}
          </p>
          <div className="mt-2 inline-block px-4 py-2 rounded-2xl bg-[#C23A22]/10 border border-[#C23A22]/20 text-[#C23A22] text-xs font-bold">
            🎁 {merchant.rewardTitle}
          </div>
        </div>

        {/* 3 Step Guide */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-md mt-8 pt-6 border-t border-[#E5DAC4]">
          <div className="flex flex-col items-center">
            <span className="w-6 h-6 rounded-full bg-[#1C1917] text-white text-[11px] font-bold flex items-center justify-center mb-1.5">1</span>
            <span className="text-[10px] font-bold text-[#2C2723]">{isAr ? 'المس أو امسح' : 'Tap or Scan'}</span>
            <span className="text-[9px] text-[#7D705C]">{t.noAppNeeded}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="w-6 h-6 rounded-full bg-[#1C1917] text-white text-[11px] font-bold flex items-center justify-center mb-1.5">2</span>
            <span className="text-[10px] font-bold text-[#2C2723]">{t.getStamped}</span>
            <span className="text-[9px] text-[#7D705C]">{isAr ? 'عند كل طلب' : 'With every order'}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="w-6 h-6 rounded-full bg-[#1C1917] text-white text-[11px] font-bold flex items-center justify-center mb-1.5">3</span>
            <span className="text-[10px] font-bold text-[#2C2723]">{t.freeReward}</span>
            <span className="text-[9px] text-[#7D705C]">{isAr ? 'استمتع بهديتك' : 'Enjoy your drink'}</span>
          </div>
        </div>

        <div className="mt-8 text-[9px] text-[#A89C86] font-mono">
          Powered by Stampee • NFC &amp; QR Digital Loyalty Engine
        </div>
      </div>

      {/* Practical NFC Setup Drawer (Hidden on Print) */}
      {showNfcGuide && (
        <div className="mt-6 p-6 rounded-3xl bg-[#121518] border border-white/10 print:hidden animate-fade-in text-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-emerald-400" />
              <h4 className="font-bold text-sm text-white">
                {isAr ? 'كيف تجهز قرص الـ NFC للكاونتر؟ (بأقل من 30 ثانية)' : 'How to Program Your Counter NFC Puck (30 Seconds)'}
              </h4>
            </div>
            <button
              onClick={handleCopyUrl}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 font-mono text-[11px]"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-zinc-300">
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="font-mono text-emerald-400 font-bold block mb-1">01. القطع المطلوبة</span>
              <p className="text-[11px] text-zinc-400">
                {isAr 
                  ? 'اشتري ستيكر NFC (نوع NTAG213 أو NTAG215) سعره حوالي 5-10 جنيه، أو قرص أكريليك مكتبي.' 
                  : 'Buy NTAG213/215 stickers ($0.20 each) or acrylic counter pucks on Amazon/locally.'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="font-mono text-emerald-400 font-bold block mb-1">02. تطبيق البرمجة المجاني</span>
              <p className="text-[11px] text-zinc-400">
                {isAr 
                  ? 'نزل تطبيق مجاني اسمه "NFC Tools" على موبايلك (موجود على آيفون وأندرويد).' 
                  : 'Download the free "NFC Tools" app on iPhone or Android.'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="font-mono text-emerald-400 font-bold block mb-1">03. الكتابة بلمسة واحدة</span>
              <p className="text-[11px] text-zinc-400">
                {isAr 
                  ? 'اختر Write URL والصق رابط المحل، وقرب الشريحة من الموبايل. الصقها في ستاند الكاونتر.' 
                  : 'Select Write URL, paste your merchant URL, and touch the tag. Stick behind the stand.'}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
