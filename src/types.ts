export type UserRole = 'customer' | 'agent' | 'admin';

export type CustomerTab = 'home' | 'shops' | 'history' | 'notifications' | 'profile';

export type AgentTab = 'home' | 'store' | 'customers' | 'orders' | 'reports' | 'packages' | 'addons' | 'settings';

export type AdminTab = 'overview' | 'agents' | 'shops' | 'members' | 'addons' | 'reports' | 'settings';

// === NEW SPECIFIED ENTITIES ===

export interface User {
  id: string;
  name: string;
  role: 'customer' | 'agent' | 'admin';
}

export interface Customer {
  customerId: string;
  name: string;
  phone: string;
  historyCount: number;
  favoriteShops: string[]; // shopId list
}

export interface Agent {
  agentId: string;
  shopName: string;
  ownerName: string;
  package: 'Basic' | 'Pro' | 'Premium';
  quotaTotal: number;
  quotaRemaining: number;
  todaySales: number;
  totalCustomers: number;
  status: 'Active' | 'Pending' | 'Suspended';
}

export interface Shop {
  // Required new fields
  shopId: string;
  shopName: string;
  rating: number;
  verified: boolean;
  packageBadge: 'Basic' | 'Pro' | 'Premium';
  location: string;
  description: string;

  // Legacy compatibility fields
  id: string;
  name: string;
  address: string;
  phone: string;
  logo: string;
  coverImage: string;
  reviewsCount: number;
  isVerified: boolean;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  level: 'Basic Agent' | 'Pro Agent' | 'Gold Agent' | 'Premium Agent';
  badgeType?: 'nearby' | 'popular' | 'none';
}

export interface Subscription {
  packageName: 'Basic' | 'Pro' | 'Premium';
  pricePerRound: number;
  pricePerMonth: number;
  expireDate: string;
  status: 'Active' | 'Expired' | 'Pending';
}

export interface AddOnService {
  serviceName: string;
  price: number;
  status: 'Active' | 'Inactive';

  // Legacy compatibility
  id: string;
  name: string;
  description: string;
  iconName: string;
}

// === EXISTING LEGACY/HELPER STRUCTURES ===

export interface Order {
  id: string;
  shopName: string;
  shopImage: string;
  date: string;
  amount: number;
  itemsCount: number;
  status: 'pending' | 'success' | 'cancelled';
  itemsSummary: string;
}

export interface CustomerProfile {
  name: string;
  image: string;
  phone: string;
  email: string;
  address: string;
  favoriteShops?: string[];
}

export interface AgentProfile {
  name: string;
  shopName: string;
  image: string;
  phone: string;
  email: string;
  quotaRemaining: number;
  salesToday: number;
  totalCustomers: number;
  pendingOrders: number;
  isPremium: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  date: string;
  isRead: boolean;
}

export interface SubscriptionPackage {
  id: string;
  name: string;
  pricePerPeriod: number;
  pricePerMonth: number;
  periodText: string;
  features: { text: string; included: boolean; isHeader?: boolean }[];
  badge?: string;
  isPopular?: boolean;
}

export interface ApprovalRequest {
  id: string;
  name: string;
  image: string;
  type: 'register' | 'upgrade';
  typeText: string;
  level?: string;
}

