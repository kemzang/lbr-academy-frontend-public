// ============================================
// Configuration de l'API Backend
// ============================================

export const API_CONFIG = {
  // URL de base de l'API - Modifier selon l'environnement
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  
  // Timeout des requêtes (en ms)
  TIMEOUT: 30000,
  
  // Clés de stockage local
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'lbr_access_token',
    REFRESH_TOKEN: 'lbr_refresh_token',
    USER: 'lbr_user',
  },
  
  // Endpoints
  ENDPOINTS: {
    // Auth
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      REFRESH: '/auth/refresh-token',
      ME: '/auth/me',
      FORGOT_PASSWORD: '/auth/password/forgot',
      RESET_PASSWORD: '/auth/password/reset',
      CHANGE_PASSWORD: '/auth/password/change',
      VERIFY_EMAIL: '/auth/verify-email',
    },
    
    // Users
    USERS: {
      PROFILE: '/users/profile',
      PROFILE_PICTURE: '/users/profile/picture',
      PUBLIC_PROFILE: (userId: number) => `/users/${userId}/public`,
      SEARCH: '/users/search',
      CREATORS: '/users/creators',
    },
    
    // Contents
    CONTENTS: {
      BASE: '/contents',
      BY_ID: (id: number) => `/contents/${id}`,
      BY_SLUG: (slug: string) => `/contents/slug/${slug}`,
      FEATURED: '/contents/featured',
      POPULAR: '/contents/popular',
      BESTSELLERS: '/contents/bestsellers',
      LATEST: '/contents/latest',
      TOP_RATED: '/contents/top-rated',
      BY_CATEGORY: (categoryId: number) => `/contents/category/${categoryId}`,
      BY_AUTHOR: (authorId: number) => `/contents/author/${authorId}`,
      COVER: (id: number) => `/contents/${id}/cover`,
      FILE: (id: number) => `/contents/${id}/file`,
      SUBMIT: (id: number) => `/contents/${id}/submit`,
      MY_CONTENTS: '/contents/my',
      RATE: (id: number) => `/contents/${id}/rate`,
    },
    
    // Categories
    CATEGORIES: {
      BASE: '/categories',
      TREE: '/categories/tree',
      BY_ID: (id: number) => `/categories/${id}`,
      BY_SLUG: (slug: string) => `/categories/slug/${slug}`,
      TOGGLE: (id: number) => `/categories/${id}/toggle`,
    },
    
    // Purchases
    PURCHASES: {
      BASE: '/purchases',
      COMPLETE: (id: number) => `/purchases/${id}/complete`,
      CHECK: (contentId: number) => `/purchases/check/${contentId}`,
    },
    
    // Subscriptions
    SUBSCRIPTIONS: {
      PLANS: '/subscriptions/plans',
      BASE: '/subscriptions',
      ACTIVATE: (id: number) => `/subscriptions/${id}/activate`,
      CANCEL: (id: number) => `/subscriptions/${id}/cancel`,
      CURRENT: '/subscriptions/current',
      HISTORY: '/subscriptions/history',
      CHECK: '/subscriptions/check',
    },
    
    // Comments
    COMMENTS: {
      BY_CONTENT: (contentId: number) => `/comments/content/${contentId}`,
      BY_ID: (id: number) => `/comments/${id}`,
      LIKE: (id: number) => `/comments/${id}/like`,
      HIDE: (id: number) => `/comments/${id}/hide`,
      HIDDEN: '/comments/hidden',
    },
    
    // Follows
    FOLLOWS: {
      BASE: (userId: number) => `/follows/${userId}`,
      CHECK: (userId: number) => `/follows/check/${userId}`,
      NOTIFICATIONS: (userId: number) => `/follows/${userId}/notifications`,
      MY_FOLLOWERS: '/follows/followers',
      MY_FOLLOWING: '/follows/following',
      USER_FOLLOWERS: (userId: number) => `/follows/${userId}/followers`,
      USER_FOLLOWING: (userId: number) => `/follows/${userId}/following`,
    },
    
    // Favorites
    FAVORITES: {
      BASE: '/favorites',
      BY_CONTENT: (contentId: number) => `/favorites/${contentId}`,
      CHECK: (contentId: number) => `/favorites/check/${contentId}`,
      COLLECTION: (contentId: number) => `/favorites/${contentId}/collection`,
      BY_COLLECTION: (name: string) => `/favorites/collection/${name}`,
      COLLECTIONS: '/favorites/collections',
    },
    
    // Notifications
    NOTIFICATIONS: {
      BASE: '/notifications',
      UNREAD: '/notifications/unread',
      LATEST: '/notifications/latest',
      COUNT: '/notifications/count',
      READ: (id: number) => `/notifications/${id}/read`,
      READ_ALL: '/notifications/read-all',
      DELETE_READ: '/notifications/read',
    },
    
    // Role Upgrades
    ROLE_UPGRADES: {
      BASE: '/role-upgrades',
      MY: '/role-upgrades/my',
      PENDING: '/role-upgrades/pending',
      APPROVE: (id: number) => `/role-upgrades/${id}/approve`,
      REJECT: (id: number) => `/role-upgrades/${id}/reject`,
    },
    
    // Admin
    ADMIN: {
      // Dashboard
      DASHBOARD: '/admin/dashboard',
      ANALYTICS: '/admin/dashboard/analytics',
      TOP_CONTENTS: '/admin/dashboard/top-contents',
      TOP_CREATORS: '/admin/dashboard/top-creators',
      RECENT_ACTIVITY: '/admin/dashboard/recent-activity',
      USER_DISTRIBUTION: '/admin/dashboard/user-distribution',
      REVENUE_CHART: '/admin/dashboard/revenue-chart',
      
      // Users
      USERS: '/admin/users',
      CHANGE_ROLE: (id: number) => `/admin/users/${id}/role`,
      SUSPEND_USER: (id: number) => `/admin/users/${id}/suspend`,
      ACTIVATE_USER: (id: number) => `/admin/users/${id}/activate`,
      
      // Contents
      CONTENTS: '/admin/contents',
      PENDING_CONTENTS: '/admin/contents/pending',
      APPROVE_CONTENT: (id: number) => `/admin/contents/${id}/approve`,
      REJECT_CONTENT: (id: number) => `/admin/contents/${id}/reject`,
      FEATURE_CONTENT: (id: number) => `/admin/contents/${id}/feature`,
      DELETE_CONTENT: (id: number) => `/admin/contents/${id}`,
    },
  },
} as const;
