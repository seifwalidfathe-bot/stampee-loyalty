import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Sparkles, Smartphone, Gift, ArrowLeft } from 'lucide-react';
import { MerchantConfig } from '../types';

interface CounterStandProps {
  merchant: MerchantConfig;
  onBack: () => void;
}

export const CounterStand: React.FC<CounterStandProps> = ({ merchant, onBack }) => {
  const cardUrl = typeof window === 'undefined'
    ? `https://stampee.app/${merchant.slug}`
    : `${window.location.origin}/?merchant=${merchant.slug}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-xl mx-auto pb-12 animate-fade-in">
      
      {/* Top Bar for Action */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/30 active:scale-95"
        >
          <Printer className="w-4 h-4" />
          <span>Print Stand (A5 / Table Tent)</span>
        </button>
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

        {/* High Contrast QR Code Container */}
        <div className="my-2 p-5 bg-white rounded-3xl shadow-xl border border-[#E5DAC4] flex flex-col items-center">
          <QRCodeSVG
            value={cardUrl}
            size={180}
            level="H"
            includeMargin={true}
            bgColor="#FFFFFF"
            fgColor="#1C1917"
          />
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-[#C23A22] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scan with phone camera</span>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="mt-6 max-w-sm">
          <h3 className="text-base md:text-lg font-bold text-[#1C1917]">
            Collect Stamps. Earn Rewards.
          </h3>
          <p className="text-xs text-[#7D705C] mt-1">
            Collect {merchant.totalStamps} stamps to earn:
          </p>
          <div className="mt-2 inline-block px-4 py-2 rounded-2xl bg-[#C23A22]/10 border border-[#C23A22]/20 text-[#C23A22] text-xs font-bold">
            🎁 {merchant.rewardTitle}
          </div>
        </div>

        {/* 3 Step Guide */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-md mt-8 pt-6 border-t border-[#E5DAC4]">
          <div className="flex flex-col items-center">
            <span className="w-6 h-6 rounded-full bg-[#1C1917] text-white text-[11px] font-bold flex items-center justify-center mb-1.5">1</span>
            <span className="text-[10px] font-bold text-[#2C2723]">Scan QR</span>
            <span className="text-[9px] text-[#7D705C]">No app to download</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="w-6 h-6 rounded-full bg-[#1C1917] text-white text-[11px] font-bold flex items-center justify-center mb-1.5">2</span>
            <span className="text-[10px] font-bold text-[#2C2723]">Get Stamped</span>
            <span className="text-[9px] text-[#7D705C]">Show code at counter</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="w-6 h-6 rounded-full bg-[#1C1917] text-white text-[11px] font-bold flex items-center justify-center mb-1.5">3</span>
            <span className="text-[10px] font-bold text-[#2C2723]">Free Reward</span>
            <span className="text-[9px] text-[#7D705C]">Claim your gift</span>
          </div>
        </div>

        <div className="mt-8 text-[9px] text-[#A89C86] font-mono">
          Powered by Stampee • Digital Loyalty
        </div>
      </div>
    </div>
  );
};
