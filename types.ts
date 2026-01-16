export enum AgentVibe {
  SAVVY_SAVER = 'SAVVY_SAVER',
  SPEED_SEEKER = 'SPEED_SEEKER'
}

export type AppTheme = 'dark' | 'midnight' | 'emerald' | 'crimson' | 'light';

export interface Deal {
  id: string;
  itemTitle: string;
  finalPrice: number;
  date: Date;
  type: 'bought' | 'sold';
  partnerName: string;
  paymentMethod: 'UPI' | 'Cash';
}

export interface WishlistItem {
  id: string;
  itemName: string;
  maxPrice: number;
}

export interface PriceAlert {
  id: string;
  itemName: string;
  threshold: number;
}

export interface UserProfile {
  id: string;
  name: string;
  course: string;
  campusId: string;
  email: string;
  phone: string;
  budgetLimit: number;
  vibe: AgentVibe;
  calendar: string[];
  completedDeals: Deal[];
  wishlist: WishlistItem[];
  priceAlerts: PriceAlert[];
  theme: AppTheme;
  upiQR?: string;
}

export type ListingType = 'WTS' | 'WTB' | 'SERVICE';

export interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  source: 'Discord' | 'Slack' | 'WhatsApp' | 'Local';
  sellerId: string;
  sellerRating: number;
  image?: string;
  type: ListingType;
  benchmarkStatus?: 'Good' | 'Average' | 'Overpriced';
  isVerified?: boolean;
  interestedBuyersCount: number;
  interestedSellersCount: number;
  highestBid?: number;
  sellerUpiQR?: string;
  isbn?: string; // For textbooks
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'seller';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  participantName: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
}

export enum MessageType {
  WTS = 'WTS',
  WTB = 'WTB',
  NOISE = 'NOISE'
}