// ============================================
// Types TypeScript pour La Bibliothèque des Rois
// ============================================

import { ContentType, UserRole, ContentStatus } from '@/config/theme';

// ==================== API Response ====================
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiError {
  success: false;
  message: string;
  error: {
    code: string;
    details?: string;
    validationErrors?: Record<string, string>;
  };
  timestamp: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ==================== Auth ====================
export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserSummary;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

// ==================== User ====================
export interface UserSummary {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  bio?: string;
  phone?: string;
  address?: string;
  role: UserRole;
  roleDisplayName: string;
  profilePictureUrl?: string;
  followersCount?: number;
  followingCount?: number;
  contentsCount?: number;
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

export interface User extends UserSummary {
  fullName: string;
  bio?: string;
  phone?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  followersCount: number;
  followingCount: number;
  contentsCount: number;
  totalViews: number;
  averageRating: number;
}

export interface UserPublicProfile {
  id: number;
  username: string;
  fullName: string;
  bio?: string;
  profilePictureUrl?: string;
  role: UserRole;
  roleDisplayName: string;
  followersCount: number;
  followingCount: number;
  contentsCount: number;
  averageRating: number;
  isFollowing?: boolean;
}

export interface UpdateProfileRequest {
  username?: string;
  fullName?: string;
  bio?: string;
  phone?: string;
}

// ==================== Content ====================
export interface ContentSummary {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  type: ContentType;
  coverUrl?: string;
  isFree: boolean;
  price?: number;
  currency: string;
  status: ContentStatus;
  viewCount: number;
  viewsCount?: number; // Alias pour compatibilité
  averageRating: number;
  ratingCount: number;
  ratingsCount?: number; // Alias pour compatibilité
  readTime?: number;
  author: ContentAuthor;
  category?: CategorySummary;
  categories?: CategorySummary[];
  createdAt: string;
  isFeatured: boolean;
  isFavorite?: boolean;
  isPurchased?: boolean;
}

export interface ContentAuthor {
  id: number;
  username: string;
  fullName?: string;
  profilePictureUrl?: string;
  role?: string;
}

export interface Content extends ContentSummary {
  description: string;
  body?: string;
  freePreview?: string;
  fileUrl?: string;
  tags?: string;
  language: string;
  pageCount?: number;
  duration?: number;
  publishedAt?: string;
  updatedAt: string;
  userRating?: number;
}

export interface CreateContentRequest {
  title: string;
  description: string;
  summary?: string;
  type: ContentType;
  categoryId: number;
  isFree: boolean;
  price?: number;
  currency?: string;
  tags?: string;
  language?: string;
  pageCount?: number;
  duration?: number;
  freePreview?: string;
}

export interface UpdateContentRequest extends Partial<CreateContentRequest> {}

export interface ContentSearchParams {
  query?: string;
  type?: ContentType;
  categoryId?: number;
  isFree?: boolean;
  page?: number;
  size?: number;
  sortBy?: 'views' | 'rating' | 'date' | 'price';
  sortDir?: 'asc' | 'desc';
}

export interface RateContentRequest {
  rating: number;
  review?: string;
}

// ==================== Category ====================
export interface CategorySummary {
  id: number;
  name: string;
  slug: string;
  iconUrl?: string;
}

export interface Category extends CategorySummary {
  description?: string;
  displayOrder: number;
  isActive: boolean;
  parentId?: number;
  parent?: CategorySummary;
  children?: Category[];
  contentCount: number;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  slug?: string;
  iconUrl?: string;
  parentId?: number;
  displayOrder?: number;
}

// ==================== Purchase ====================
export interface Purchase {
  id: number;
  content: ContentSummary;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod: string;
  paymentReference: string;
  purchaseDate: string;
  purchasedAt: string;
  invoiceUrl?: string;
}

export interface CreatePurchaseRequest {
  contentId: number;
  paymentMethod: string;
  paymentReference: string;
}

// ==================== Subscription ====================
export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  durationDays: number;
  features: string[];
  isActive: boolean;
  isPopular: boolean;
}

export interface Subscription {
  id: number;
  plan: SubscriptionPlan;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentMethod: string;
}

// Alias pour UserSubscription
export type UserSubscription = Subscription;

export interface CreateSubscriptionRequest {
  planId: number;
  paymentMethod: string;
  paymentReference: string;
  autoRenew?: boolean;
}

// ==================== Comment ====================
export interface Comment {
  id: number;
  text: string;
  body: string;
  user: UserSummary;
  contentId: number;
  parentId?: number;
  likesCount: number;
  isLiked?: boolean;
  isHidden: boolean;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentRequest {
  text: string;
  parentId?: number;
}

// ==================== Follow ====================
export interface Follow {
  id: number;
  follower: UserSummary;
  following: UserSummary;
  notificationsEnabled: boolean;
  createdAt: string;
}

export interface FollowStatus {
  isFollowing: boolean;
  notificationsEnabled: boolean;
}

// ==================== Favorite ====================
export interface Favorite {
  id: number;
  content: ContentSummary;
  collection?: string;
  createdAt: string;
}

export interface FavoriteCollection {
  name: string;
  count: number;
}

// ==================== Notification ====================
export interface Notification {
  id: number;
  type: 'NEW_CONTENT' | 'COMMENT' | 'FOLLOW' | 'PURCHASE' | 'ROLE_UPGRADE' | 'SYSTEM';
  title: string;
  message: string;
  imageUrl?: string;
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationCount {
  unread: number;
  total: number;
}

// ==================== Role Upgrade ====================
export interface RoleUpgradeRequest {
  id: number;
  user: UserSummary;
  requestedRole: UserRole;
  currentRole: UserRole;
  motivation: string;
  bio?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  documentUrl?: string;
  specialization?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNote?: string;
  rejectReason?: string;
  createdAt: string;
  processedAt?: string;
}

export interface CreateRoleUpgradeRequest {
  requestedRole: UserRole;
  motivation: string;
  bio?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  specialization?: string;
}

// ==================== Admin ====================
export interface AdminDashboard {
  totalUsers: number;
  newUsersThisMonth: number;
  activeCreators: number;
  certifiedCoaches: number;
  totalContents: number;
  publishedContents: number;
  pendingContents: number;
  totalRevenue: number;
  revenueThisMonth: number;
  activeSubscriptions: number;
  pendingRoleUpgrades: number;
  pendingContentApprovals: number;
}

export interface AdminUserSearchParams {
  query?: string;
  role?: UserRole;
  status?: 'ACTIVE' | 'SUSPENDED';
  page?: number;
  size?: number;
}
