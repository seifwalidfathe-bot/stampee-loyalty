import { MerchantConfig, CustomerLoyaltyCard, StampActivityLog, Language } from '../types';

export const DEFAULT_MERCHANT: MerchantConfig = {
  id: 'm-roast-bloom',
  name: 'Roast & Bloom Coffee',
  slug: 'roast-bloom',
  tagline: 'Artisanal Roastery & Slow Brew Bar',
  category: 'cafe',
  logoEmoji: '☕',
  totalStamps: 8,
  rewardTitle: 'Free Signature Cold Brew or Flat White',
  rewardTerms: 'Valid for any 12oz crafted beverage. Non-transferable.',
  birthdayReward: 'Free Signature Birthday Beverage or Bakery Item',
  welcomeStampBonus: true,
  theme: 'craft-paper',
  stampIcon: 'coffee',
  cashierPin: '1234',
  primaryColor: '#8C4A2F',
  stampInkColor: '#C23A22',
  createdAt: new Date().toISOString(),
};

export const INITIAL_CUSTOMER_CARDS: CustomerLoyaltyCard[] = [
  {
    id: 'card-demo-1',
    merchantId: 'm-roast-bloom',
    customerPhone: '+20 100 234 5678',
    customerName: 'Kareem Tarek',
    birthday: '1998-11-15', // Current month! Birthday perk active
    currentStamps: 5,
    totalCompletedCards: 2,
    unredeemedRewards: 0,
    stampsHistory: [
      { stampIndex: 1, timestamp: new Date(Date.now() - 86400000 * 12).toISOString(), cashierName: 'Omar (Branch 1)' },
      { stampIndex: 2, timestamp: new Date(Date.now() - 86400000 * 9).toISOString(), cashierName: 'Omar (Branch 1)' },
      { stampIndex: 3, timestamp: new Date(Date.now() - 86400000 * 6).toISOString(), cashierName: 'Sara (Branch 1)' },
      { stampIndex: 4, timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), cashierName: 'Sara (Branch 1)' },
      { stampIndex: 5, timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), cashierName: 'Omar (Branch 1)' },
    ],
    lastVisited: new Date(Date.now() - 86400000 * 1).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'card-demo-2',
    merchantId: 'm-roast-bloom',
    customerPhone: '+20 111 876 5432',
    customerName: 'Nour El-Din',
    birthday: '1995-04-12',
    currentStamps: 8,
    totalCompletedCards: 1,
    unredeemedRewards: 1, // Ready to redeem reward!
    stampsHistory: Array.from({ length: 8 }).map((_, i) => ({
      stampIndex: i + 1,
      timestamp: new Date(Date.now() - 86400000 * (16 - i * 2)).toISOString(),
      cashierName: 'Omar (Branch 1)',
    })),
    lastVisited: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
  },
  {
    id: 'card-demo-3',
    merchantId: 'm-roast-bloom',
    customerPhone: '+20 102 998 1122',
    customerName: 'Yasmine Adly',
    birthday: '2001-08-23',
    currentStamps: 2,
    totalCompletedCards: 0,
    unredeemedRewards: 0,
    stampsHistory: [
      { stampIndex: 1, timestamp: new Date(Date.now() - 86400000 * 25).toISOString(), cashierName: 'Sara (Branch 1)' },
      { stampIndex: 2, timestamp: new Date(Date.now() - 86400000 * 22).toISOString(), cashierName: 'Sara (Branch 1)' },
    ],
    lastVisited: new Date(Date.now() - 86400000 * 22).toISOString(), // At risk of churn (> 20 days)
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
  }
];

export const INITIAL_LOGS: StampActivityLog[] = [
  {
    id: 'log-1',
    cardId: 'card-demo-1',
    customerPhone: '+20 100 234 5678',
    type: 'stamp_added',
    stampsCount: 1,
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    cashierName: 'Omar',
  },
  {
    id: 'log-2',
    cardId: 'card-demo-2',
    customerPhone: '+20 111 876 5432',
    type: 'reward_unlocked',
    stampsCount: 8,
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    cashierName: 'Omar',
  }
];

const KEYS = {
  MERCHANT: 'stampee_merchant_v2',
  CARDS: 'stampee_cards_v2',
  LOGS: 'stampee_logs_v2',
  ACTIVE_CARD_ID: 'stampee_active_card_v2',
  LANG: 'stampee_lang_v2',
};

export const storage = {
  getMerchant(): MerchantConfig {
    if (typeof window === 'undefined') return DEFAULT_MERCHANT;
    const raw = localStorage.getItem(KEYS.MERCHANT);
    if (!raw) {
      localStorage.setItem(KEYS.MERCHANT, JSON.stringify(DEFAULT_MERCHANT));
      return DEFAULT_MERCHANT;
    }
    try {
      return { ...DEFAULT_MERCHANT, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_MERCHANT;
    }
  },

  saveMerchant(config: MerchantConfig) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.MERCHANT, JSON.stringify(config));
    window.dispatchEvent(new Event('stampee_storage_update'));
  },

  getCards(): CustomerLoyaltyCard[] {
    if (typeof window === 'undefined') return INITIAL_CUSTOMER_CARDS;
    const raw = localStorage.getItem(KEYS.CARDS);
    if (!raw) {
      localStorage.setItem(KEYS.CARDS, JSON.stringify(INITIAL_CUSTOMER_CARDS));
      return INITIAL_CUSTOMER_CARDS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CUSTOMER_CARDS;
    }
  },

  saveCards(cards: CustomerLoyaltyCard[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.CARDS, JSON.stringify(cards));
    window.dispatchEvent(new Event('stampee_storage_update'));
  },

  getLogs(): StampActivityLog[] {
    if (typeof window === 'undefined') return INITIAL_LOGS;
    const raw = localStorage.getItem(KEYS.LOGS);
    if (!raw) {
      localStorage.setItem(KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
      return INITIAL_LOGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_LOGS;
    }
  },

  addLog(log: Omit<StampActivityLog, 'id'>) {
    const logs = this.getLogs();
    const newLog: StampActivityLog = {
      ...log,
      id: 'log-' + Math.random().toString(36).substring(2, 9),
    };
    const updated = [newLog, ...logs].slice(0, 100);
    localStorage.setItem(KEYS.LOGS, JSON.stringify(updated));
    window.dispatchEvent(new Event('stampee_storage_update'));
  },

  getActiveCardId(): string {
    if (typeof window === 'undefined') return 'card-demo-1';
    return localStorage.getItem(KEYS.ACTIVE_CARD_ID) || 'card-demo-1';
  },

  setActiveCardId(id: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.ACTIVE_CARD_ID, id);
    window.dispatchEvent(new Event('stampee_storage_update'));
  },

  getLang(): Language {
    if (typeof window === 'undefined') return 'ar';
    return (localStorage.getItem(KEYS.LANG) as Language) || 'ar';
  },

  saveLang(lang: Language) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.LANG, lang);
    window.dispatchEvent(new Event('stampee_storage_update'));
  },

  findOrCreateCard(phone: string, merchantId: string, name?: string, birthday?: string): CustomerLoyaltyCard {
    const cards = this.getCards();
    const existing = cards.find(c => c.customerPhone === phone && c.merchantId === merchantId);
    if (existing) return existing;

    const newCard: CustomerLoyaltyCard = {
      id: 'card-' + Math.random().toString(36).substring(2, 9),
      merchantId,
      customerPhone: phone,
      customerName: name,
      birthday: birthday,
      currentStamps: 1, // Welcome Stamp bonus
      totalCompletedCards: 0,
      unredeemedRewards: 0,
      stampsHistory: [{
        stampIndex: 1,
        timestamp: new Date().toISOString(),
        cashierName: 'Welcome Gift Stamp',
        branch: 'Auto-Welcome',
      }],
      lastVisited: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    this.saveCards([newCard, ...cards]);
    this.setActiveCardId(newCard.id);
    return newCard;
  }
};
