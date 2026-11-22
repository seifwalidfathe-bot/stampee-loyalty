import React, { useState } from 'react';
import { 
  Palette, 
  Settings, 
  Users, 
  BarChart3, 
  QrCode, 
  Save, 
  Gift, 
  Smartphone, 
  CheckCircle2, 
  MessageSquare,
  ShieldAlert,
  Flame,
  Clock,
  Printer
} from 'lucide-react';
import { MerchantConfig, CustomerLoyaltyCard, CardThemeId, StampIconType } from '../types';
import { StampIcon } from './StampIcon';

interface MerchantAdminProps {
  merchant: MerchantConfig;
  cards: CustomerLoyaltyCard[];
  onSaveMerchant: (config: MerchantConfig) => void;
  onOpenCounterStand: () => void;
  onSelectCustomerCard: (cardId: string) => void;
}

export const MerchantAdmin: React.FC<MerchantAdminProps> = ({
  merchant,
  cards,
  onSaveMerchant,
  onOpenCounterStand,
  onSelectCustomerCard,
}) => {
  const [activeTab, setActiveTab] = useState<'designer' | 'crm' | 'security'>('designer');
  const [formData, setFormData] = useState<MerchantConfig>({ ...merchant });
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveMerchant(formData);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
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
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-16 animate-fade-in text-white">
      
      {/* Top Banner & Quick Actions */}
      <div className="bg-[#121517] border border-[#22272B] rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{formData.logoEmoji}</span>
            <h1 className="text-lg font-bold tracking-tight">{merchant.name} — Merchant Console</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Program settings, card design tokens, and customer retention metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCounterStand}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-200 transition-all"
          >
            <Printer className="w-4 h-4 text-rose-400" />
            <span>Counter Stand Kit</span>
          </button>
        </div>
      </div>

      {/* Analytics Telemetry Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#121517] border border-[#22272B] p-4 rounded-2xl">
          <span className="text-[11px] font-medium text-zinc-400 block">Total Loyalty Members</span>
          <span className="text-xl font-bold font-mono text-white mt-1 block">{totalMembers}</span>
          <span className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            +12% this month
          </span>
        </div>

        <div className="bg-[#121517] border border-[#22272B] p-4 rounded-2xl">
          <span className="text-[11px] font-medium text-zinc-400 block">Total Stamps Issued</span>
          <span className="text-xl font-bold font-mono text-rose-400 mt-1 block">{totalStampsAwarded}</span>
          <span className="text-[10px] text-zinc-500 mt-1">Across all branches</span>
        </div>

        <div className="bg-[#121517] border border-[#22272B] p-4 rounded-2xl">
          <span className="text-[11px] font-medium text-zinc-400 block">Rewards Unlocked</span>
          <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">{totalRewardsClaimed}</span>
          <span className="text-[10px] text-zinc-500 mt-1">Completed cycles</span>
        </div>

        <div className="bg-[#121517] border border-[#22272B] p-4 rounded-2xl">
          <span className="text-[11px] font-medium text-zinc-400 block">Repeat Retention Rate</span>
          <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">{retentionRate}%</span>
          <span className="text-[10px] text-zinc-500 mt-1">Visited in last 14 days</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('designer')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'designer'
              ? 'border-rose-500 text-rose-400 font-bold'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Card Designer & Rules</span>
        </button>

        <button
          onClick={() => setActiveTab('crm')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'crm'
              ? 'border-rose-500 text-rose-400 font-bold'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Customer Retention CRM ({cards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'security'
              ? 'border-rose-500 text-rose-400 font-bold'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Cashier PIN & Security</span>
        </button>
      </div>

      {/* Tab 1: Card Designer & Rules */}
      {activeTab === 'designer' && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-[#121517] border border-[#22272B] rounded-3xl p-6 shadow-2xl space-y-5">
            
            <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-rose-400" />
              <span>Brand Identity & Card Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5">Business Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-medium text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5">Tagline / Location</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-medium text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5">Category Emoji / Icon</label>
                <input
                  type="text"
                  value={formData.logoEmoji}
                  onChange={e => setFormData({ ...formData, logoEmoji: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-2xl bg-white/5 border border-white/10 text-base text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5">Total Stamps Required</label>
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
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5">Reward Description</label>
                <input
                  type="text"
                  value={formData.rewardTitle}
                  onChange={e => setFormData({ ...formData, rewardTitle: e.target.value })}
                  placeholder="e.g. Free Specialty Latte or Signature Dessert"
                  className="w-full h-11 px-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-medium text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Stamp Icon Selector */}
            <div className="pt-2">
              <label className="text-[11px] font-semibold text-zinc-400 block mb-2">Stamp Icon Style</label>
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
              <label className="text-[11px] font-semibold text-zinc-400 block mb-2">Card Aesthetic Theme</label>
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
              <span className="text-xs text-zinc-500">Changes apply to all customer cards in real-time</span>
              <button
                type="submit"
                className="px-6 h-11 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-rose-600/30 active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save Card Settings</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Customer Retention CRM */}
      {activeTab === 'crm' && (
        <div className="bg-[#121517] border border-[#22272B] rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white">Customer Retention & Loyalty Members</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Track customer frequency, visit recency, and churn risks.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 text-[11px]">
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Progress</th>
                  <th className="pb-3 font-semibold">Completed</th>
                  <th className="pb-3 font-semibold">Last Visit</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
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

      {/* Tab 3: Security & Cashier PIN */}
      {activeTab === 'security' && (
        <form onSubmit={handleSave} className="bg-[#121517] border border-[#22272B] rounded-3xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white">Cashier PIN & Fraud Prevention</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Staff enter this 4-digit code when stamping directly on the customer’s phone.
              </p>
            </div>
          </div>

          <div className="max-w-xs">
            <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5">Master Cashier 4-Digit PIN</label>
            <input
              type="text"
              maxLength={4}
              value={formData.cashierPin}
              onChange={e => setFormData({ ...formData, cashierPin: e.target.value.replace(/[^0-9]/g, '') })}
              className="w-full h-12 px-4 rounded-2xl bg-white/5 border border-white/10 text-center font-mono text-lg font-bold tracking-widest text-white focus:outline-none focus:border-rose-500"
            />
            <p className="text-[10px] text-zinc-500 mt-1.5">Share this PIN only with your authorized cashiers.</p>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="px-6 h-11 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-rose-600/30 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Update PIN</span>
            </button>
          </div>
        </form>
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
