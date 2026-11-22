import React from 'react';
import { X, Smartphone, MonitorCheck, Sparkles } from 'lucide-react';
import { CustomerCard } from './CustomerCard';
import { CashierScanner } from './CashierScanner';
import { MerchantConfig, CustomerLoyaltyCard, Language } from '../types';

interface SimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchant: MerchantConfig;
  cards: CustomerLoyaltyCard[];
  activeCardId: string;
  lang: Language;
  onToggleLang: () => void;
  onUpdateCard: (updated: CustomerLoyaltyCard) => void;
  onSelectCard: (id: string) => void;
  onCustomerCreated: (phone: string) => CustomerLoyaltyCard;
}

export const SimulatorModal: React.FC<SimulatorModalProps> = ({
  isOpen,
  onClose,
  merchant,
  cards,
  activeCardId,
  lang,
  onToggleLang,
  onUpdateCard,
  onSelectCard,
  onCustomerCreated,
}) => {
  if (isOpen === false) return null;

  const activeCard = cards.find(c => c.id === activeCardId) || cards[0];
  const isAr = lang === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-md animate-fade-in text-white overflow-y-auto">
      <div 
        dir={isAr ? 'rtl' : 'ltr'}
        className="relative w-full max-w-5xl bg-[#0C0E10] border border-white/10 rounded-3xl shadow-2xl p-5 md:p-8 flex flex-col max-h-[92vh] overflow-hidden"
      >
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                <span>{isAr ? 'محاكي ستامبي التفاعلي المباشر' : 'Stampee Live Interactive Simulator'}</span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  REAL-TIME SYNC
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                {isAr ? 'تجربة هاتف الزبون ومحطة الكاشير جنباً إلى جنب بشكل فوري.' : 'Experience the customer phone view and cashier terminal stamping side-by-side.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dual Pane Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 overflow-y-auto pr-1">
          
          {/* Left: Customer Mobile Frame */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-zinc-400">
              <Smartphone className="w-4 h-4 text-rose-400" />
              <span>{isAr ? 'شاشة موبايل الزبون (بدون تحميل أي تطبيق)' : 'Customer Mobile Screen (No App Download)'}</span>
            </div>

            {/* Mobile Device Mockup Bezel */}
            <div className="w-full max-w-sm rounded-[40px] p-3.5 bg-[#181B1E] border-4 border-[#282E33] shadow-2xl relative overflow-hidden">
              <div className="w-28 h-4 bg-[#282E33] rounded-full mx-auto mb-2" />
              <div className="max-h-[580px] overflow-y-auto px-1 py-1">
                {activeCard && (
                  <CustomerCard
                    card={activeCard}
                    merchant={merchant}
                    lang={lang}
                    onToggleLang={onToggleLang}
                    onUpdateCard={onUpdateCard}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right: Cashier Terminal */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-zinc-400">
              <MonitorCheck className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'محطة الكاشير عند الكاونتر' : 'Cashier Counter POS Terminal'}</span>
            </div>

            <div className="bg-[#121517] border border-[#22272B] rounded-3xl p-5 shadow-xl flex-1 flex flex-col justify-start">
              <CashierScanner
                merchant={merchant}
                cards={cards}
                activeCardId={activeCardId}
                onUpdateCard={onUpdateCard}
                onSelectCard={onSelectCard}
                onCustomerCreated={onCustomerCreated}
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
