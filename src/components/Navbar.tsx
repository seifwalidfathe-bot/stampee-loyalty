import React from 'react';
import { 
  Scan, 
  LayoutDashboard, 
  Printer, 
  Sparkles,
  Smartphone,
  Globe,
  Ticket
} from 'lucide-react';
import { ViewMode, MerchantConfig, Language } from '../types';

interface NavbarProps {
  currentMode: ViewMode;
  onSelectMode: (mode: ViewMode) => void;
  merchant: MerchantConfig;
  onOpenSimulator: () => void;
  lang: Language;
  onToggleLang: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  merchant,
  onOpenSimulator,
  lang,
  onToggleLang,
}) => {
  const isAr = lang === 'ar';

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 py-3 select-none">
      <div 
        dir={isAr ? 'rtl' : 'ltr'} 
        className="max-w-6xl mx-auto flex items-center justify-between gap-2"
      >
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onSelectMode('customer')}>
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white shadow-md shadow-rose-600/30 font-extrabold text-sm tracking-tight">
              S
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white block leading-none">
                Stampee
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">
                {merchant.name}
              </span>
            </div>
          </div>
        </div>

        {/* View Mode Switcher Pills */}
        <nav className="flex items-center gap-1 bg-[#14171A] p-1 rounded-2xl border border-white/5">
          <button
            onClick={() => onSelectMode('customer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentMode === 'customer'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'كارت الزبون' : 'Customer Card'}</span>
          </button>

          <button
            onClick={() => onSelectMode('coupon')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentMode === 'coupon'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-amber-400/90 hover:text-amber-300 hover:bg-white/5'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'كوبون القهوة' : 'Free Coupon'}</span>
          </button>

          <button
            onClick={() => onSelectMode('cashier')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentMode === 'cashier'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'كاشير POS' : 'Cashier POS'}</span>
          </button>

          <button
            onClick={() => onSelectMode('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentMode === 'admin'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'لوحة التحكم' : 'Admin Console'}</span>
          </button>

          <button
            onClick={() => onSelectMode('counter-stand')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentMode === 'counter-stand'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isAr ? 'طباعة الستاند' : 'Print Stand'}</span>
          </button>
        </nav>

        {/* Action Controls: Dual Simulator + Language Switcher */}
        <div className="flex items-center gap-2">
          
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/5 text-xs font-bold font-mono transition-all"
            title="Toggle Arabic / English"
          >
            <Globe className="w-3.5 h-3.5 text-rose-400" />
            <span>{isAr ? 'EN' : 'عربي'}</span>
          </button>

          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-rose-600/30 to-amber-600/30 hover:from-rose-600/40 hover:to-amber-600/40 text-amber-200 border border-amber-500/30 text-xs font-bold transition-all shadow-sm active:scale-95"
            title="Open side-by-side customer + cashier simulator"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{isAr ? 'المحاكي المزدوج' : 'Dual Simulator'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
