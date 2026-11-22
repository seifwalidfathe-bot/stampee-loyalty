import React, { useState, useEffect } from 'react';
import { storage } from './lib/storage';
import { ViewMode, MerchantConfig, CustomerLoyaltyCard, Language } from './types';
import { Navbar } from './components/Navbar';
import { CustomerCard } from './components/CustomerCard';
import { CashierScanner } from './components/CashierScanner';
import { MerchantAdmin } from './components/MerchantAdmin';
import { CounterStand } from './components/CounterStand';
import { SimulatorModal } from './components/SimulatorModal';
import { JoinModal } from './components/JoinModal';
import { CouponLanding } from './components/CouponLanding';
import { DigitalPagerModal } from './components/DigitalPagerModal';
import { Sparkles, UserPlus, Ticket } from 'lucide-react';
import { getT } from './lib/translations';

export function App() {
  const [merchant, setMerchant] = useState<MerchantConfig>(storage.getMerchant());
  const [cards, setCards] = useState<CustomerLoyaltyCard[]>(storage.getCards());
  const [activeCardId, setActiveCardId] = useState<string>(storage.getActiveCardId());
  const [lang, setLang] = useState<Language>(storage.getLang());
  const [viewMode, setViewMode] = useState<ViewMode>('customer');
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState<boolean>(false);

  // Check URL params for ?coupon= or ?merchant=
  useEffect(() => {
    if (typeof window === 'object' && window) {
      const params = new URLSearchParams(window.location.search);
      if (params.get('coupon')) {
        setViewMode('coupon');
      }
    }
  }, []);

  // Sync state with storage updates
  useEffect(() => {
    const handleUpdate = () => {
      setMerchant(storage.getMerchant());
      setCards(storage.getCards());
      setActiveCardId(storage.getActiveCardId());
      setLang(storage.getLang());
    };

    window.addEventListener('stampee_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('stampee_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleToggleLang = () => {
    const nextLang: Language = lang === 'ar' ? 'en' : 'ar';
    storage.saveLang(nextLang);
    setLang(nextLang);
  };

  const handleUpdateCard = (updated: CustomerLoyaltyCard) => {
    const updatedCards = cards.map(c => (c.id === updated.id ? updated : c));
    storage.saveCards(updatedCards);
    setCards(updatedCards);
  };

  const handleSaveMerchant = (updatedMerchant: MerchantConfig) => {
    storage.saveMerchant(updatedMerchant);
    setMerchant(updatedMerchant);
  };

  const handleCustomerCreated = (phone: string): CustomerLoyaltyCard => {
    const created = storage.findOrCreateCard(phone, merchant.id);
    setCards(storage.getCards());
    return created;
  };

  const handleJoinSuccess = (newCard: CustomerLoyaltyCard) => {
    storage.saveCards([newCard, ...cards]);
    storage.setActiveCardId(newCard.id);
    setCards([newCard, ...cards]);
    setActiveCardId(newCard.id);
  };

  const handleCouponTransformed = (transformedCard: CustomerLoyaltyCard) => {
    handleUpdateCard(transformedCard);
    setViewMode('customer');
  };

  const activeCard = cards.find(c => c.id === activeCardId) || cards[0];
  const isAr = lang === 'ar';
  const t = getT(lang);

  return (
    <div className="min-h-screen bg-[#08090A] text-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar
        currentMode={viewMode}
        onSelectMode={setViewMode}
        merchant={merchant}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        lang={lang}
        onToggleLang={handleToggleLang}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-8">
        
        {/* Banner Quick Tip for testing */}
        {viewMode === 'customer' && (
          <div 
            dir={isAr ? 'rtl' : 'ltr'} 
            className="max-w-sm mx-auto mb-5 p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs text-zinc-400"
          >
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isAr ? 'تسجيل عميل جديد (+ختم هدية)' : 'Register New Member (+Bonus)'}</span>
            </button>

            <button
              onClick={() => setViewMode('coupon')}
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>{isAr ? 'كوبون القهوة' : 'Free Coupon'}</span>
            </button>
          </div>
        )}

        {/* View 1: Customer Card View */}
        {viewMode === 'customer' && activeCard && (
          <CustomerCard
            card={activeCard}
            merchant={merchant}
            lang={lang}
            onToggleLang={handleToggleLang}
            onUpdateCard={handleUpdateCard}
            onOpenCashier={() => setViewMode('cashier')}
            onOpenJoinModal={() => setIsJoinModalOpen(true)}
            onOpenCoupon={() => setViewMode('coupon')}
          />
        )}

        {/* View 1B: TAPPI Hook - 1st Coffee Free Coupon Landing */}
        {viewMode === 'coupon' && activeCard && (
          <CouponLanding
            merchant={merchant}
            card={activeCard}
            lang={lang}
            onCouponTransformed={handleCouponTransformed}
            onOpenCard={() => setViewMode('customer')}
          />
        )}

        {/* View 1C: Tannah Digital Pager & Waiting Mini-Game View */}
        {viewMode === 'pager' && activeCard && (
          <DigitalPagerModal
            isOpen={true}
            onClose={() => setViewMode('customer')}
            order={storage.getActiveOrders().find(o => o.status === 'preparing' || o.status === 'ready') || {
              id: 'ord-demo-47',
              orderNumber: '47',
              customerPhone: activeCard.customerPhone,
              cardId: activeCard.id,
              status: 'preparing',
              createdAt: new Date().toISOString(),
            }}
            merchant={merchant}
            card={activeCard}
            lang={lang}
            onOrderClaimed={(orderId) => {
              storage.updateOrderStatus(orderId, 'picked_up');
              handleUpdateCard({
                ...activeCard,
                currentStamps: Math.min(merchant.totalStamps, activeCard.currentStamps + 1),
                lastVisited: new Date().toISOString(),
              });
              setViewMode('customer');
            }}
            onSimulateReady={(orderId) => {
              storage.updateOrderStatus(orderId, 'ready');
            }}
          />
        )}

        {/* View 2: Cashier POS View */}
        {viewMode === 'cashier' && (
          <CashierScanner
            merchant={merchant}
            cards={cards}
            activeCardId={activeCardId}
            onUpdateCard={handleUpdateCard}
            onSelectCard={(id) => {
              storage.setActiveCardId(id);
              setActiveCardId(id);
            }}
            onCustomerCreated={handleCustomerCreated}
          />
        )}

        {/* View 3: Merchant Admin Console */}
        {viewMode === 'admin' && (
          <MerchantAdmin
            merchant={merchant}
            cards={cards}
            lang={lang}
            onSaveMerchant={handleSaveMerchant}
            onOpenCounterStand={() => setViewMode('counter-stand')}
            onSelectCustomerCard={(cardId) => {
              storage.setActiveCardId(cardId);
              setActiveCardId(cardId);
              setViewMode('customer');
            }}
          />
        )}

        {/* View 4: Counter Stand Table Tent Generator */}
        {viewMode === 'counter-stand' && (
          <CounterStand
            merchant={merchant}
            lang={lang}
            onBack={() => setViewMode('admin')}
          />
        )}

      </main>

      {/* Interactive Dual Simulator Modal */}
      <SimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        merchant={merchant}
        cards={cards}
        activeCardId={activeCardId}
        lang={lang}
        onToggleLang={handleToggleLang}
        onUpdateCard={handleUpdateCard}
        onSelectCard={(id) => {
          storage.setActiveCardId(id);
          setActiveCardId(id);
        }}
        onCustomerCreated={handleCustomerCreated}
      />

      {/* Join & Onboarding Modal */}
      <JoinModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        merchant={merchant}
        onJoinSuccess={handleJoinSuccess}
        lang={lang}
      />

      {/* Footer strictly in English LTR as required by rules */}
      <footer className="w-full border-t border-white/5 py-6 px-4 text-center text-xs text-zinc-500" dir="ltr">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Stampee Open Platform</span>
            <span>•</span>
            <span>Zero App Download Loyalty Engine</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>Client Web PWA</span>
            <span>•</span>
            <span>NFC Counter Puck</span>
            <span>•</span>
            <span>POS Cashier Terminal</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
