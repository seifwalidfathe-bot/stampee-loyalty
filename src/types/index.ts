export type StampIconType = 'coffee' | 'star' | 'scissors' | 'pizza' | 'heart' | 'gift' | 'burger' | 'car';

export type CardThemeId = 
  | 'craft-paper'     // Tactile warm café paper with ink stamps
  | 'obsidian-gold'   // Linear dark theme with bronze/gold foil stamps
  | 'matcha-minimal'  // Sage & organic cream bakery vibe
  | 'midnight-rose'   // Sleek luxury salon vibe
  | 'tokyo-punch';    // Streetwear & modern ramen vibe

export type Language = 'en' | 'ar';

export interface FeatureFlags {
  enableWelcomeBonus: boolean;      // 1st stamp free upon registration
  enableCouponHook: boolean;        // TAPPI "First coffee free" transforming coupon
  enableBirthdayPerk: boolean;      // Annual birthday beverage/gift perk
  enableNfcTap: boolean;            // Counter NFC puck tap simulation & stand badge
  enableMobileWallet: boolean;      // Apple Wallet & Google Wallet pass modal
  enableSecretStaffPin: boolean;    // Direct cashier 4-digit PIN stamping on phone
  enableSoundEffects: boolean;      // Web Audio API rubber-stamp thump & chime
}

export interface PromoCoupon {
  id: string;
  merchantId: string;
  headline: string;
  subheadline: string;
  voucherCode: string;
  discountType: 'free_item' | 'percent_off' | 'first_stamp';
  isClaimed: boolean;
  claimedAt?: string;
}

export interface MerchantConfig {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  category: 'cafe' | 'salon' | 'restaurant' | 'retail' | 'bakery' | 'carwash';
  logoEmoji: string;
  coverImage?: string;
  totalStamps: number; // e.g. 5, 6, 8, 10
  rewardTitle: string; // e.g. "Free Specialty Latte or Signature Dessert"
  rewardTerms: string;
  birthdayReward: string; // e.g. "Free Birthday Beverage"
  welcomeStampBonus: boolean;
  activeCoupon?: PromoCoupon;
  features: FeatureFlags; // Modular feature toggles
  theme: CardThemeId;
  stampIcon: StampIconType;
  cashierPin: string; // 4 digits
  primaryColor: string;
  stampInkColor: string;
  createdAt: string;
}

export interface CustomerLoyaltyCard {
  id: string;
  merchantId: string;
  customerPhone: string;
  customerName?: string;
  birthday?: string; // YYYY-MM-DD
  currentStamps: number;
  totalCompletedCards: number;
  unredeemedRewards: number;
  claimedCouponId?: string;
  stampsHistory: {
    stampIndex: number;
    timestamp: string;
    cashierName?: string;
    branch?: string;
  }[];
  lastVisited: string;
  createdAt: string;
}

export interface StampActivityLog {
  id: string;
  cardId: string;
  customerPhone: string;
  type: 'stamp_added' | 'reward_unlocked' | 'reward_redeemed' | 'birthday_claimed' | 'coupon_claimed';
  stampsCount: number;
  timestamp: string;
  cashierName: string;
}

export type ViewMode = 'customer' | 'cashier' | 'admin' | 'counter-stand' | 'simulator' | 'coupon';
