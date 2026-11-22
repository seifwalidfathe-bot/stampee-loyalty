import React, { useState } from 'react';
import { 
  Palette, 
  Settings, 
  Users, 
  Save, 
  CheckCircle2, 
  MessageSquare, 
  Flame, 
  Clock, 
  Printer, 
  Sparkles, 
  Ticket, 
  Radio, 
  Copy, 
  Check, 
  Send,
  Zap,
  Sliders,
  RotateCcw,
  Store,
  X,
  Smartphone,
  ShieldCheck,
  Volume2,
  Cake,
  Gift
} from 'lucide-react';
import { MerchantConfig, CustomerLoyaltyCard, CardThemeId, StampIconType, Language, FeatureFlags } from '../types';
import { StampIcon } from './StampIcon';
import { storage } from '../lib/storage';
import { getT } from '../lib/translations';

interface MerchantAdminProps {
  merchant: MerchantConfig;
  cards: CustomerLoyaltyCard[];
  lang: Language;
  onSaveMerchant: (config: MerchantConfig) => void;
  onOpenCounterStand: () => void;
  onSelectCustomerCard: (cardId: string) => void;
}

export const MerchantAdmin: React.FC<MerchantAdminProps> = ({
  merchant,
  cards,
  lang,
  onSaveMerchant,
  onOpenCounterStand,
  onSelectCustomerCard,
}) => {
  const [activeTab, setActiveTab] = useState<'designer' | 'features' | 'growth' | 'crm' | 'security'>('features');
  const [formData, setFormData] = useState<MerchantConfig>({ ...merchant });
  const [saveToast, setSaveToast] = useState(false);
  const [copiedCouponLink, setCopiedCouponLink] = useState(false);
  const [copiedDmScript, setCopiedDmScript] = useState(false);

  // Clean Slate Modal
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [freshName, setFreshName] = useState('');
  const [freshCategory, setFreshCategory] = useState<MerchantConfig['category']>('cafe');
  const [freshStamps, setFreshStamps] = useState(8);
  const [freshReward, setFreshReward] = useState('Free Signature Drink');

  const isAr = lang === 'ar';
  const t = getT(lang);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSaveMerchant(formData);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleToggleFeature = (key: keyof FeatureFlags) => {
    const nextFeatures: FeatureFlags = {
      ...formData.features,
      [key]: Boolean(formData.features[key]) === false,
    };
    const updated = {
      ...formData,
      features: nextFeatures,
    };
    setFormData(updated);
    onSaveMerchant(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleExecuteResetToZero = (e: React.FormEvent) => {
    e.preventDefault();
    if (freshName.trim().length === 0) return;

    const fresh = storage.resetToCleanSlate(
      freshName.trim(),
      freshCategory,
      freshStamps,
      freshReward.trim() || 'Free Reward',
      formData.features
    );

    setFormData(fresh);
    setIsResetModalOpen(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const couponUrl = typeof window === 'undefined'
    ? `https://stampee.app/?coupon=welcome-free`
    : `${window.location.origin}/?coupon=welcome-free`;

  const handleCopyCouponUrl = () => {
    navigator.clipboard.writeText(couponUrl);
    setCopiedCouponLink(true);
    setTimeout(() => setCopiedCouponLink(false), 2000);
  };

  const dmAutomationScript = isAr
    ? `أهلاً بيك في ${merchant.name}. عشان تاخد قهوتك الأولى مجاناً وتحصل على كارت أختام الولاء الرقمي في موبايلك بدون تحميل أي تطبيق، اضغط على الرابط ده واستلمها فوراً من الكاشير: ${couponUrl}`
    : `Hey there. Here is your free coffee voucher at ${merchant.name}. Claim your free cup and your member stamp card in 1 tap without any app downloads: ${couponUrl}`;

  const handleCopyDmScript = () => {
    navigator.clipboard.writeText(dmAutomationScript);
    setCopiedDmScript(true);
    setTimeout(() => setCopiedDmScript(false), 2000);
  };

  // Metrics Calculation
  const totalMembers = cards.length;
  const totalStampsAwarded = cards.reduce((acc, c) => acc + c.stampsHistory.length, 0);
  const totalRewardsClaimed = cards.reduce((acc, c) => acc + c.totalCompletedCards, 0);
  const activeMembers = cards.filter(c => {
    const daysSince = (Date.now() - new Date(c.lastVisited).getTime()) / (1000 * 3600 * 24);
    return daysSince <= 14;
  }).length;
  const retentionRate = totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0;

  const themes: { id: CardThemeId; label: string; desc: string; previewBg: string }[] = [
    { id: 'craft-paper', label: 'Craft Paper & Ink', desc: 'Warm tactile coffee-shop & bakery card', previewBg: 'bg-[#FAF7EE] text-[#2C2723]' },
    { id: 'obsidian-gold', label: 'Obsidian & Gold', desc: 'Linear dark precision with bronze foil', previewBg: 'bg-[#0E1113] text-amber-400' },
    { id: 'matcha-minimal', label: 'Matcha & Sage', desc: 'Japanese organic bakery & tea bar', previewBg: 'bg-[#F4F7F2] text-[#2E5A33]' },
    { id: 'midnight-rose', label: 'Midnight Rose', desc: 'Luxury aesthetic salon & spa', previewBg: 'bg-[#120F16] text-rose-400' },
    { id: 'tokyo-punch', label: 'Tokyo Punch', desc: 'Streetwear, burger & ramen spot', previewBg: 'bg-[#18181B] text-orange-400' },
  ];

  const icons: StampIconType[] = ['coffee', 'star', 'scissors', 'pizza', 'heart', 'gift', 'burger', 'car'];

  return (
    <div 
      dir={isAr ? 'rtl' : 'ltr'} 
      className="w-full max-w-4xl mx-auto space-y-6 pb-16 animate-fade-in text-white"
    >
      
      {/* Top Banner & Quick Actions */}
      <div className="bg-[#121517] border border-[#22272B] rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{formData.logoEmoji}</span>
            <h1 className="text-lg font-bold tracking-tight">{merchant.name} — {t.adminConsole}</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {isAr ? 'إدارة برنامج الولاء، تفعيل وتعطيل المميزات الاختيارية، وتخصيص الكارت.' : 'Program settings, modular feature flags, and customer retention metrics.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsResetModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 text-xs font-semibold text-zinc-300 hover:text-rose-300 transition-all"
            title="Start from zero with a fresh store"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>{isAr ? 'ابدأ من الصفر (متجر جديد)' : 'Start from Scratch'}</span>
          </button>

          <button
            onClick={onOpenCounterStand}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-200 transition-all"
          >
            <Printer className="w-4 h-4 text-rose-400" />
            <span>{t.counterStandKit}</span>
          </button>
        </div>
      </div>

      {/* Analytics Telemetry Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#121517] border border-[#22272B] p-4 rounded-2xl">
          <span className="text-[11px] font-medium text-zinc-400 block">{t.totalMembers}</span>
          <span className="text-xl font-bold font-mono text-white mt-1 block">{totalMembers}</span>
          <span className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            +12% {isAr ? 'هذا الشهر' : 'this month'}
          </span>
        </div>

        <div className="bg-[#121517] border border-[#22272B] p-4 rounded-2xl">
          <span className="text-[11px] font-medium text-zinc-400 block">{t.totalStampsIssued}</span>
          <span className="text-xl font-bold font-mono text-rose-400 mt-1 block">{totalStampsAwarded}</span>
          <span className="text-[10px] text-zinc-500 mt-1">{isAr ? 'عبر جميع الفروع' : 'Across all branches'}</span>
        </div>

        <div className="bg-[#121517] border border-[#22272B] p-4 rounded-2xl">
          <span className="text-[11px] font-medium text-zinc-400 block">{t.rewardsClaimed}</span>
          <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">{totalRewardsClaimed}</span>
          <span className="text-[10px] text-zinc-500 mt-1">{isAr ? 'دورات مكتملة' : 'Completed cycles'}</span>
        </div>

        <div className="bg-[#121517] border border-[#22272B] p-4 rounded-2xl">
          <span className="text-[11px] font-medium text-zinc-400 block">{t.retentionRate}</span>
          <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">{retentionRate}%</span>
          <span className="text-[10px] text-zinc-500 mt-1">{isAr ? 'زيارة خلال آخر 14 يوم' : 'Visited in last 14 days'}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 gap-6 text-xs font-semibold overflow-x-auto pb-1 scrollbar-none">
        
        {/* Tab 1: Feature Modules Switcher */}
        <button
          onClick={() => setActiveTab('features')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'features'
              ? 'border-rose-500 text-rose-400 font-bold'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>{isAr ? 'المميزات الاختيارية (Feature Toggles)' : 'Modular Features'}</span>
        </button>

        <button
          onClick={() => setActiveTab('designer')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'designer'
              ? 'border-rose-500 text-rose-400 font-bold'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>{isAr ? 'تصميم الكارت والقواعد' : 'Card Designer & Rules'}</span>
        </button>

        <button
          onClick={() => setActiveTab('growth')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'growth'
              ? 'border-rose-500 text-rose-400 font-bold'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{t.campaignTab}</span>
        </button>

        <button
          onClick={() => setActiveTab('crm')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'crm'
              ? 'border-rose-500 text-rose-400 font-bold'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{isAr ? `إدارة ولاء العملاء (${cards.length})` : `Customer Retention CRM (${cards.length})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'security'
              ? 'border-rose-500 text-rose-400 font-bold'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{isAr ? 'أمان الكاشير والـ PIN' : 'Cashier PIN & Security'}</span>
        </button>
      </div>

      {/* Tab 0: Modular Feature Toggles - Every feature is optional. */}
      {activeTab === 'features' && (
        <div className="bg-[#121517] border border-[#22272B] rounded-3xl p-6 shadow-2xl space-y-6 animate-fade-in">
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'تخصيص وتفعيل مميزات النظام حسب رغبتك' : 'Modular Feature Controls'}</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              {isAr 
                ? 'كل ميزة تقدر تشغلها أو تقفلها بزرار واحد؛ والتعديل ينعكس فوراً على الكارت والشاشات.' 
                : 'Turn specific loyalty modules on or off dynamically. Changes update client passes in real-time.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Feature 1: Welcome Bonus Stamp */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {isAr ? 'أول ختم مجاني عند التسجيل' : 'Welcome First Stamp Bonus'}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {isAr ? 'إعطاء العميل أول ختم كهدية ترحيبية فور مسح الكود.' : 'Awards 1 free stamp upon initial registration.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggleFeature('enableWelcomeBonus')}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                  formData.features.enableWelcomeBonus ? 'bg-emerald-600' : 'bg-zinc-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  formData.features.enableWelcomeBonus ? (isAr ? 'left-1' : 'right-1') : (isAr ? 'right-1' : 'left-1')
                }`} />
              </button>
            </div>

            {/* Feature 2: TAPPI Coupon-to-Card Hook */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {isAr ? 'كوبون القهوة الأولى (TAPPI Hook)' : '1st Coffee Coupon-to-Card Hook'}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {isAr ? 'تحويل تذكرة القهوة المجانية لكارت ولاء دائم عند الصرف.' : 'Voucher that morphs into a loyalty pass upon redemption.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggleFeature('enableCouponHook')}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                  formData.features.enableCouponHook ? 'bg-emerald-600' : 'bg-zinc-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  formData.features.enableCouponHook ? (isAr ? 'left-1' : 'right-1') : (isAr ? 'right-1' : 'left-1')
                }`} />
              </button>
            </div>

            {/* Feature 3: Birthday Perk */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Cake className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {isAr ? 'هدية عيد الميلاد السنوية' : 'Annual Birthday Perk'}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {isAr ? 'تنبيه العميل بهدية عيد ميلاده في أسبوع ميلاده.' : 'Automatic perk indicator during customer birth month.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggleFeature('enableBirthdayPerk')}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                  formData.features.enableBirthdayPerk ? 'bg-emerald-600' : 'bg-zinc-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  formData.features.enableBirthdayPerk ? (isAr ? 'left-1' : 'right-1') : (isAr ? 'right-1' : 'left-1')
                }`} />
              </button>
            </div>

            {/* Feature 4: NFC Counter Tap */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {isAr ? 'دعم قرص الـ NFC المكتبي' : 'NFC Counter Tap Support'}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {isAr ? 'إظهار خيار اللمس السريع وشعار الـ NFC على الستاند.' : 'Enables NFC counter puck tap simulation & stand badge.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggleFeature('enableNfcTap')}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                  formData.features.enableNfcTap ? 'bg-emerald-600' : 'bg-zinc-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  formData.features.enableNfcTap ? (isAr ? 'left-1' : 'right-1') : (isAr ? 'right-1' : 'left-1')
                }`} />
              </button>
            </div>

            {/* Feature 5: Apple Wallet & Google Wallet */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {isAr ? 'كروت Apple Wallet و Google Wallet' : 'Apple & Google Wallet Integration'}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {isAr ? 'زر حفظ الكارت في محفظة الهاتف الرسمية.' : 'Allows customers to export pass to native mobile wallets.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggleFeature('enableMobileWallet')}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                  formData.features.enableMobileWallet ? 'bg-emerald-600' : 'bg-zinc-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  formData.features.enableMobileWallet ? (isAr ? 'left-1' : 'right-1') : (isAr ? 'right-1' : 'left-1')
                }`} />
              </button>
            </div>

            {/* Feature 6: Staff Quick PIN */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {isAr ? 'ختم الـ PIN السري على هاتف الزبون' : 'Direct Staff Phone PIN Stamping'}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {isAr ? 'إتاحة الختم السري المباشر بإدخال الكود المكون من 4 أرقام.' : 'Cashier stamps directly on customer screen with secret code.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggleFeature('enableSecretStaffPin')}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                  formData.features.enableSecretStaffPin ? 'bg-emerald-600' : 'bg-zinc-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  formData.features.enableSecretStaffPin ? (isAr ? 'left-1' : 'right-1') : (isAr ? 'right-1' : 'left-1')
                }`} />
              </button>
            </div>

            {/* Feature 7: Web Audio Sound & Haptics */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3 md:col-span-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {isAr ? 'المؤثرات الصوتية والاهتزاز الحركي' : 'Tactile Sound & Haptic Feedback'}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {isAr ? 'صوت خبطة الختم الميكانيكي واهتزاز الموبايل عبر Web Audio API.' : 'Simulated mechanical rubber stamp audio and mobile vibration.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggleFeature('enableSoundEffects')}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                  formData.features.enableSoundEffects ? 'bg-emerald-600' : 'bg-zinc-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  formData.features.enableSoundEffects ? (isAr ? 'left-1' : 'right-1') : (isAr ? 'right-1' : 'left-1')
                }`} />
              </button>
            </div>

          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-zinc-400 border-t border-white/5">
            <span>{isAr ? 'حفظ فوري تلقائي لكل تعديل' : 'Auto-saves immediately upon toggling'}</span>
            <button
              onClick={() => handleSave()}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all"
            >
              {isAr ? 'تأكيد الحفظ' : 'Confirm Settings'}
            </button>
          </div>
        </div>
      )}

      {/* Tab 1: Card Designer & Rules */}
      {activeTab === 'designer' && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-[#121517] border border-[#22272B] rounded-3xl p-6 shadow-2xl space-y-5">
            
            <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-rose-400" />
              <span>{isAr ? 'تفاصيل الهوية وقواعد الكارت' : 'Brand Identity & Card Details'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5">{isAr ? 'اسم المحل' : 'Business Name'}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-medium text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5">{isAr ? 'الوصف المختصر / الفرع' : 'Tagline / Location'}</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-medium text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5">{isAr ? 'أيقونة اللوجو (Emoji)' : 'Category Emoji / Icon'}</label>
                <input
                  type="text"
                  value={formData.logoEmoji}
                  onChange={e => setFormData({ ...formData, logoEmoji: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-2xl bg-white/5 border border-white/10 text-base text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5">{isAr ? 'عدد الأختام المطلوبة' : 'Total Stamps Required'}</label>
                <select
                  value={formData.totalStamps}
                  onChange={e => setFormData({ ...formData, totalStamps: Number(e.target.value) })}
                  className="w-full h-11 px-3.5 rounded-2xl bg-[#1A1D20] border border-white/10 text-xs font-medium text-white focus:outline-none focus:border-rose-500"
                >
                  <option value={5}>5 Stamps (High Frequency / Fast Reward)</option>
                  <option value={6}>6 Stamps (Popular for Salons / Retail)</option>
                  <option value={8}>8 Stamps (Coffee Shop Classic)</option>
                  <option value={10}>10 Stamps (Standard Buy 9 Get 1 Free)</option>
                  <option value={12}>12 Stamps (High Ticket / Restaurants)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5">{isAr ? 'وصف المكافأة المستحقة' : 'Reward Description'}</label>
                <input
                  type="text"
                  value={formData.rewardTitle}
                  onChange={e => setFormData({ ...formData, rewardTitle: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-medium text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5">{isAr ? 'هدية عيد الميلاد السنوية' : 'Annual Birthday Perk'}</label>
                <input
                  type="text"
                  value={formData.birthdayReward}
                  onChange={e => setFormData({ ...formData, birthdayReward: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-medium text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Stamp Icon Selector */}
            <div className="pt-2">
              <label className="text-[11px] font-semibold text-zinc-400 block mb-2">{isAr ? 'شكل الختم' : 'Stamp Icon Style'}</label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {icons.map(iconType => (
                  <button
                    key={iconType}
                    type="button"
                    onClick={() => setFormData({ ...formData, stampIcon: iconType })}
                    className={`h-12 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      formData.stampIcon === iconType
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-sm'
                        : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <StampIcon type={iconType} className="w-4 h-4" />
                    <span className="text-[9px] capitalize">{iconType}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Card Aesthetic Theme Selection */}
            <div className="pt-2">
              <label className="text-[11px] font-semibold text-zinc-400 block mb-2">{isAr ? 'مظهر وطابع الكارت' : 'Card Aesthetic Theme'}</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {themes.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, theme: t.id })}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      formData.theme === t.id
                        ? 'bg-rose-500/10 border-rose-500/60 shadow-sm'
                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{t.label}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">{t.desc}</div>
                    </div>
                    <div className={`w-8 h-8 rounded-xl border border-black/10 flex items-center justify-center text-xs font-bold ${t.previewBg}`}>
                      #1
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 flex items-center justify-between border-t border-white/5">
              <span className="text-xs text-zinc-500">{isAr ? 'التعديلات تنعكس فوراً على كروت كل الزبائن' : 'Changes apply to all customer cards in real-time'}</span>
              <button
                type="submit"
                className="px-6 h-11 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-rose-600/30 active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>{isAr ? 'حفظ إعدادات الكارت' : 'Save Card Settings'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Growth & Instagram Campaigns */}
      {activeTab === 'growth' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Section A: TAPPI Hook */}
          <div className="bg-[#121517] border border-[#22272B] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-white">{t.couponBuilder}</h3>
                  <p className="text-xs text-zinc-400">
                    {isAr 
                      ? 'تحويل الزبون العابر لزبون دائم عبر تقديم أول قهوة ككوبون يتحول تلقائياً لكارت ولاء دائم.' 
                      : 'Convert strangers into repeat regulars by offering 1st coffee as a voucher that morphs into a loyalty pass.'}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                TAPPI HOOK
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-300">
                  {isAr ? 'رابط الكوبون الترحيبي الخاص بحملتك' : 'Campaign Coupon Voucher Link'}
                </span>
                <button
                  onClick={handleCopyCouponUrl}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-xs font-mono font-medium transition-all"
                >
                  {copiedCouponLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCouponLink ? 'Copied' : 'Copy Voucher Link'}</span>
                </button>
              </div>

              <div className="p-3 bg-black/40 rounded-xl font-mono text-xs text-amber-300/90 break-all border border-white/5">
                {couponUrl}
              </div>

              <p className="text-[11px] text-zinc-400">
                {isAr 
                  ? 'ضع هذا الرابط في بايو الإنستجرام أو في رسائل الرد الآلي للزبائن الجدد.' 
                  : 'Place this link in your Instagram bio, story stickers, or ManyChat DM automation.'}
              </p>
            </div>
          </div>

          {/* Section B: INTMAA Hook */}
          <div className="bg-[#121517] border border-[#22272B] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-white">{t.leadGenScript}</h3>
                  <p className="text-xs text-zinc-400">
                    {isAr ? 'سكريبت جاهز لربطه بـ ManyChat عند تعليق الزبون بكلمة "كارت" أو "قهوة".' : 'Copy-paste script for ManyChat automation when users comment on your Reels.'}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/20 font-mono">
                MANYCHAT READY
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-300">
                  {isAr ? 'نص الرسالة التلقائية للزبائن في الـ DM' : 'Automated DM Script Content'}
                </span>
                <button
                  onClick={handleCopyDmScript}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-mono font-medium transition-all"
                >
                  {copiedDmScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDmScript ? 'Copied' : 'Copy DM Text'}</span>
                </button>
              </div>

              <div className="p-3.5 bg-black/40 rounded-xl text-xs text-zinc-300 leading-relaxed border border-white/5">
                {dmAutomationScript}
              </div>
            </div>
          </div>

          {/* Section C: B2B Pilot Pitch for Café Owners */}
          <div className="bg-[#121517] border border-[#22272B] rounded-3xl p-6 shadow-2xl space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                {isAr ? 'عرض التجربة المجانية لأول 30 زبون (للإغلاق مع الكافيهات)' : '30-Customer Free Pilot Script'}
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {isAr 
                ? 'لما تعرض الخدمة على كافيه جديد، اعرض عليه تجربة مجانية بالكامل لأول 30 زبون. ركبله ستاند الأكريليك وسيبه يشوف عودة الزبائن بنفسه. بعد الـ 30 زبون بيتحول تلقائياً لاشتراك شهري (مثلاً 600-1000 جنيه شهرياً).' 
                : 'Offer local café owners a 100% free pilot for their first 30 customers. Place the acrylic stand and let them witness repeat visits before moving to a monthly retainer ($25-$40/mo).'}
            </p>
          </div>

        </div>
      )}

      {/* Tab 3: Customer Retention CRM */}
      {activeTab === 'crm' && (
        <div className="bg-[#121517] border border-[#22272B] rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white">{isAr ? 'قائمة أعضاء برنامج الولاء' : 'Customer Retention & Loyalty Members'}</h3>
              <p className="text-xs text-zinc-400 mt-0.5">{isAr ? 'متابعة وتيرة زيارات الزبائن والمنقطعين.' : 'Track customer frequency, visit recency, and churn risks.'}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 text-[11px]">
                  <th className="pb-3 font-semibold">{isAr ? 'العميل' : 'Customer'}</th>
                  <th className="pb-3 font-semibold">{isAr ? 'التقدم' : 'Progress'}</th>
                  <th className="pb-3 font-semibold">{isAr ? 'الدورات' : 'Completed'}</th>
                  <th className="pb-3 font-semibold">{isAr ? 'آخر زيارة' : 'Last Visit'}</th>
                  <th className="pb-3 font-semibold">{isAr ? 'الحالة' : 'Status'}</th>
                  <th className="pb-3 font-semibold text-right">{isAr ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {cards.map(c => {
                  const daysSince = Math.round((Date.now() - new Date(c.lastVisited).getTime()) / (1000 * 3600 * 24));
                  const isAtRisk = daysSince > 14;

                  const promoMessage = encodeURIComponent(
                    `Hello ${c.customerName || 'there'}. You have ${c.currentStamps}/${merchant.totalStamps} stamps on your card at ${merchant.name}. Visit this week to collect your next stamp.`
                  );

                  return (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3">
                        <div className="font-bold text-white">{c.customerName || 'Loyal Member'}</div>
                        <div className="font-mono text-[10px] text-zinc-500">{c.customerPhone}</div>
                      </td>
                      <td className="py-3 font-mono font-bold text-rose-400">
                        {c.currentStamps} / {merchant.totalStamps}
                      </td>
                      <td className="py-3 font-mono text-zinc-300">
                        {c.totalCompletedCards} Cards
                      </td>
                      <td className="py-3 text-zinc-400 text-[11px]">
                        {daysSince === 0 ? 'Today' : `${daysSince}d ago`}
                      </td>
                      <td className="py-3">
                        {isAtRisk ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Clock className="w-3 h-3" />
                            At Risk ({daysSince}d)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Flame className="w-3 h-3" />
                            Active Member
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onSelectCustomerCard(c.id)}
                            className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-[11px] font-semibold border border-white/5"
                            title="Inspect Card"
                          >
                            View Card
                          </button>
                          <a
                            href={`https://wa.me/${c.customerPhone.replace(/[^0-9]/g, '')}?text=${promoMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                            title="Send WhatsApp Re-engagement"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Security & Cashier PIN */}
      {activeTab === 'security' && (
        <form onSubmit={handleSave} className="bg-[#121517] border border-[#22272B] rounded-3xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white">{isAr ? 'رمز الكاشير والحماية' : 'Cashier PIN & Fraud Prevention'}</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {isAr ? 'الكاشير يدخل هذا الرمز السري عند الختم مباشرة على موبايل الزبون.' : 'Staff enter this 4-digit code when stamping directly on the customer’s phone.'}
              </p>
            </div>
          </div>

          <div className="max-w-xs">
            <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5">{isAr ? 'رمز الكاشير المكون من 4 أرقام' : 'Master Cashier 4-Digit PIN'}</label>
            <input
              type="text"
              maxLength={4}
              value={formData.cashierPin}
              onChange={e => setFormData({ ...formData, cashierPin: e.target.value.replace(/[^0-9]/g, '') })}
              className="w-full h-12 px-4 rounded-2xl bg-white/5 border border-white/10 text-center font-mono text-lg font-bold tracking-widest text-white focus:outline-none focus:border-rose-500"
            />
            <p className="text-[10px] text-zinc-500 mt-1.5">{isAr ? 'شارك هذا الرمز مع الكاشيرية المعتمدين فقط.' : 'Share this PIN only with authorized cashiers.'}</p>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="px-6 h-11 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-rose-600/30 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{isAr ? 'تحديث الرمز' : 'Update PIN'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Reset to Clean Slate Modal (Start From Zero Wizard) */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-white">
          <div className="relative w-full max-w-md bg-[#121518] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setIsResetModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'إطلاق متجر جديد من الصفر' : 'Launch New Store from Zero'}
                </h3>
                <p className="text-xs text-zinc-400">
                  {isAr ? 'تصفير بيانات الديمو وبدء متجر حقيقي لعميلك.' : 'Cleans demo data and starts fresh for your real client.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleExecuteResetToZero} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                  {isAr ? 'اسم البيزنس الحقيقي' : 'Business Name'}
                </label>
                <input
                  type="text"
                  required
                  value={freshName}
                  onChange={e => setFreshName(e.target.value)}
                  placeholder={isAr ? 'مثال: بن العميد، صالون الباشا، كافيه إيطاليا' : 'e.g. Blue Bottle Coffee'}
                  className="w-full h-11 px-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                    {isAr ? 'النشاط' : 'Category'}
                  </label>
                  <select
                    value={freshCategory}
                    onChange={e => setFreshCategory(e.target.value as MerchantConfig['category'])}
                    className="w-full h-11 px-3 rounded-2xl bg-[#1A1E22] border border-white/10 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="cafe">{isAr ? 'كافيه ومشروبات ☕' : 'Café ☕'}</option>
                    <option value="salon">{isAr ? 'صالون وسبا ✂️' : 'Salon ✂️'}</option>
                    <option value="restaurant">{isAr ? 'مطعم وبرجر 🍕' : 'Restaurant 🍕'}</option>
                    <option value="retail">{isAr ? 'محل تجاري / ريتيل 🎁' : 'Retail 🎁'}</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                    {isAr ? 'عدد الأختام' : 'Stamps'}
                  </label>
                  <select
                    value={freshStamps}
                    onChange={e => setFreshStamps(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-2xl bg-[#1A1E22] border border-white/10 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value={5}>5 Stamps</option>
                    <option value={6}>6 Stamps</option>
                    <option value={8}>8 Stamps</option>
                    <option value={10}>10 Stamps</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                  {isAr ? 'اسم الهدية عند اكتمال الكارت' : 'Reward Title'}
                </label>
                <input
                  type="text"
                  value={freshReward}
                  onChange={e => setFreshReward(e.target.value)}
                  placeholder={isAr ? 'مثال: مشروب أو حلوى مجانية' : 'e.g. Free Specialty Beverage'}
                  className="w-full h-11 px-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30"
                >
                  {isAr ? 'تأكيد والبدء من الصفر' : 'Reset & Start Fresh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Save Success Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Card & business settings saved successfully.</span>
        </div>
      )}

    </div>
  );
};
