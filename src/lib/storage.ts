import { MerchantConfig, CustomerLoyaltyCard, StampActivityLog, Language, FeatureFlags, ActiveOrder } from '../types';

export const DEFAULT_FEATURES: FeatureFlags = {
  enableWelcomeBonus: true,
  enableCouponHook: true,
  enableBirthdayPerk: true,
  enableNfcTap: true,
  enableMobileWallet: true,
  enableSecretStaffPin: true,
  enableSoundEffects: true,
  enableDigitalPager: true,
};

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
  features: DEFAULT_FEATURES,
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
    birthday: '1998-11-15',
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
    unredeemedRewards: 1,
    stampsHistory: Array.from({ length: 8 }).map((_, i) => ({
      stampIndex: i + 1,
      timestamp: new Date(Date.now() - 86400000 * (16 - i * 2)).toISOString(),
      cashierName: 'Omar (Branch 1)',
    })),
    lastVisited: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
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
  }
];

export const INITIAL_ACTIVE_ORDERS: ActiveOrder[] = [
  {
    id: 'ord-47',
    orderNumber: '47',
    customerPhone: '+20 100 234 5678',
    cardId: 'card-demo-1',
    status: 'preparing',
    createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
  },
  {
    id: 'ord-48',
    orderNumber: '48',
    customerPhone: '+20 111 876 5432',
    cardId: 'card-demo-2',
    status: 'ready',
    createdAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
    readyAt: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
  }
];

const KEYS = {
  MERCHANT: 'stampee_merchant_v3',
  CARDS: 'stampee_cards_v3',
  LOGS: 'stampee_logs_v3',
  ACTIVE_CARD_ID: 'stampee_active_card_v3',
  LANG: 'stampee_lang_v3',
  ACTIVE_ORDERS: 'stampee_active_orders_v3',
};

export const storage = {
  getMerchant(): MerchantConfig {
    if (typeof window === 'undefined') return DEFAULT_MERCHANT;
    const raw = localStorage.getItem(KEYS.MERCHANT);
    if (raw === null || raw === '') {
      localStorage.setItem(KEYS.MERCHANT, JSON.stringify(DEFAULT_MERCHANT));
      return DEFAULT_MERCHANT;
    }
    try {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_MERCHANT,
        ...parsed,
        features: { ...DEFAULT_FEATURES, ...(parsed.features || {}) }
      };
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
    if (raw === null || raw === '') {
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
    if (raw === null || raw === '') {
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

  getActiveOrders(): ActiveOrder[] {
    if (typeof window === 'undefined') return INITIAL_ACTIVE_ORDERS;
    const raw = localStorage.getItem(KEYS.ACTIVE_ORDERS);
    if (raw === null || raw === '') {
      localStorage.setItem(KEYS.ACTIVE_ORDERS, JSON.stringify(INITIAL_ACTIVE_ORDERS));
      return INITIAL_ACTIVE_ORDERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ACTIVE_ORDERS;
    }
  },

  saveActiveOrders(orders: ActiveOrder[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.ACTIVE_ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new Event('stampee_storage_update'));
  },

  createOrder(orderNumber: string, customerPhone?: string, cardId?: string): ActiveOrder {
    const orders = this.getActiveOrders();
    const newOrder: ActiveOrder = {
      id: 'ord-' + Math.random().toString(36).substring(2, 9),
      orderNumber,
      customerPhone,
      cardId,
      status: 'preparing',
      createdAt: new Date().toISOString(),
    };
    this.saveActiveOrders([newOrder, ...orders]);
    return newOrder;
  },

  updateOrderStatus(orderId: string, status: ActiveOrder['status']) {
    const orders = this.getActiveOrders();
    const updated = orders.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status,
          readyAt: status === 'ready' ? new Date().toISOString() : ord.readyAt,
        };
      }
      return ord;
    });
    this.saveActiveOrders(updated);
  },

  // Reset everything to 0 for a real fresh business launch
  resetToCleanSlate(
    businessName: string, 
    category: MerchantConfig['category'], 
    totalStamps: number,
    rewardTitle: string,
    features: FeatureFlags
  ): MerchantConfig {
    const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'my-store';
    
    const freshMerchant: MerchantConfig = {
      id: 'm-' + Math.random().toString(36).substring(2, 9),
      name: businessName,
      slug: slug,
      tagline: 'Customer Loyalty Pass',
      category: category,
      logoEmoji: category === 'cafe' ? '☕' : category === 'salon' ? '✂️' : category === 'restaurant' ? '🍕' : '🎁',
      totalStamps: totalStamps,
      rewardTitle: rewardTitle,
      rewardTerms: 'Valid with any purchase. Non-transferable.',
      birthdayReward: 'Free Birthday Gift',
      welcomeStampBonus: features.enableWelcomeBonus,
      features: features,
      theme: 'craft-paper',
      stampIcon: category === 'cafe' ? 'coffee' : category === 'salon' ? 'scissors' : category === 'restaurant' ? 'pizza' : 'star',
      cashierPin: '1234',
      primaryColor: '#8C4A2F',
      stampInkColor: '#C23A22',
      createdAt: new Date().toISOString(),
    };

    // Clean initial customer
    const firstCard: CustomerLoyaltyCard = {
      id: 'card-' + Math.random().toString(36).substring(2, 9),
      merchantId: freshMerchant.id,
      customerPhone: '+20 100 000 0000',
      customerName: 'First Test Customer',
      currentStamps: features.enableWelcomeBonus ? 1 : 0,
      totalCompletedCards: 0,
      unredeemedRewards: 0,
      stampsHistory: features.enableWelcomeBonus ? [{
        stampIndex: 1,
        timestamp: new Date().toISOString(),
        cashierName: 'Welcome Stamp',
        branch: 'Branch 01',
      }] : [],
      lastVisited: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    this.saveMerchant(freshMerchant);
    this.saveCards([firstCard]);
    this.setActiveCardId(firstCard.id);
    localStorage.setItem(KEYS.LOGS, JSON.stringify([]));
    localStorage.setItem(KEYS.ACTIVE_ORDERS, JSON.stringify([]));

    return freshMerchant;
  },

  findOrCreateCard(phone: string, merchantId: string, name?: string, birthday?: string): CustomerLoyaltyCard {
    const cards = this.getCards();
    const existing = cards.find(c => c.customerPhone === phone && c.merchantId === merchantId);
    if (existing) return existing;

    const merchant = this.getMerchant();
    const welcomeStamp = merchant.features.enableWelcomeBonus ? 1 : 0;

    const newCard: CustomerLoyaltyCard = {
      id: 'card-' + Math.random().toString(36).substring(2, 9),
      merchantId,
      customerPhone: phone,
      customerName: name,
      birthday: birthday,
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

    this.saveCards([newCard, ...cards]);
    this.setActiveCardId(newCard.id);
    return newCard;
  }
};
