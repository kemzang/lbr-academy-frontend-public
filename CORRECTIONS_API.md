# Corrections API - Alignement Frontend/Backend

## ✅ Corrections effectuées

### 1. Authentification (Login)
- ✅ Changé `emailOrUsername` → `identifier` dans `LoginRequest`
- ✅ Mis à jour `app/(auth)/login/page.tsx`
- ✅ Mis à jour `stores/auth-store.ts`

### 2. Tokens
- ✅ Changé `accessToken` → `token` dans `AuthResponse`
- ✅ Mis à jour `lib/api/auth.ts` (register, login, refreshToken)
- ✅ Mis à jour `lib/api/client.ts` (refreshAccessToken)

## ⚠️ Corrections à faire

### 3. Inscription (Register)
**Problème:** Le backend attend `firstName` et `lastName` séparés, mais le frontend envoie `fullName`

**Fichiers à modifier:**
- `app/(auth)/register/page.tsx` - Séparer le champ fullName en firstName et lastName
- `stores/auth-store.ts` - Adapter l'appel register

### 4. Vérifications à faire

#### Endpoints à vérifier:
- [ ] `/auth/password/change` - Vérifier si query params ou body
- [ ] `/contents` - Vérifier les paramètres de recherche
- [ ] `/purchases` - Vérifier le payload
- [ ] `/subscriptions/{planId}` - Endpoint simplifié existe?

## 📋 Checklist complète des endpoints

### Authentification ✅
- [x] POST /auth/register - ⚠️ Besoin firstName/lastName
- [x] POST /auth/login - ✅ Corrigé (identifier)
- [x] POST /auth/refresh-token - ✅ Corrigé (token)
- [x] GET /auth/me - ✅ OK
- [x] POST /auth/password/forgot - ✅ OK
- [x] POST /auth/password/reset - ✅ OK
- [ ] POST /auth/password/change - À vérifier (query params?)
- [x] GET /auth/verify-email - ✅ OK

### Utilisateurs
- [ ] GET /users/profile
- [ ] PUT /users/profile
- [ ] POST /users/profile/picture
- [ ] GET /users/{userId}/public
- [ ] GET /users/search
- [ ] GET /users/creators
- [ ] GET /users/settings
- [ ] PUT /users/settings/notifications
- [ ] PUT /users/settings/privacy

### Contenus
- [ ] GET /contents (avec tous les paramètres)
- [ ] GET /contents/{id}
- [ ] GET /contents/slug/{slug}
- [ ] POST /contents
- [ ] PUT /contents/{id}
- [ ] POST /contents/{id}/cover
- [ ] POST /contents/{id}/file
- [ ] POST /contents/{id}/submit
- [ ] DELETE /contents/{id}
- [ ] GET /contents/my
- [ ] POST /contents/{id}/rate
- [ ] POST /contents/{id}/purchase
- [ ] GET /contents/{id}/download
- [ ] GET /contents/{id}/file

### Catégories ✅
- [x] GET /categories
- [x] GET /categories/tree
- [x] GET /categories/{id}
- [x] GET /categories/slug/{slug}

### Commentaires
- [ ] GET /comments/content/{contentId}
- [ ] POST /comments/content/{contentId}
- [ ] PUT /comments/{commentId}
- [ ] DELETE /comments/{commentId}
- [ ] POST /comments/{commentId}/like
- [ ] DELETE /comments/{commentId}/like

### Favoris
- [ ] POST /favorites/{contentId}
- [ ] DELETE /favorites/{contentId}
- [ ] GET /favorites/check/{contentId}
- [ ] GET /favorites
- [ ] GET /favorites/collections

### Follows
- [ ] POST /follows/{userId}
- [ ] DELETE /follows/{userId}
- [ ] GET /follows/check/{userId}
- [ ] GET /follows/followers
- [ ] GET /follows/following

### Notifications
- [ ] GET /notifications
- [ ] GET /notifications/unread
- [ ] GET /notifications/count
- [ ] PATCH /notifications/{id}/read
- [ ] PATCH /notifications/read-all

### Achats
- [ ] POST /purchases
- [ ] POST /purchases/{id}/complete
- [ ] GET /purchases
- [ ] GET /purchases/check/{contentId}

### Abonnements
- [ ] GET /subscriptions/plans
- [ ] POST /subscriptions
- [ ] POST /subscriptions/{planId} - Endpoint simplifié
- [ ] POST /subscriptions/{id}/activate
- [ ] POST /subscriptions/{id}/cancel
- [ ] GET /subscriptions/current
- [ ] GET /subscriptions/history

### Demandes de rôle
- [ ] POST /role-upgrades
- [ ] GET /role-upgrades/my
- [ ] DELETE /role-upgrades/{id}

### Admin
- [ ] GET /admin/dashboard
- [ ] GET /admin/users
- [ ] PATCH /admin/users/{id}/role
- [ ] GET /admin/contents
- [ ] POST /admin/contents/{id}/approve
- [ ] POST /admin/contents/{id}/reject

## 🔧 Actions immédiates

1. Corriger la page d'inscription pour utiliser firstName/lastName
2. Tester la connexion avec les nouvelles corrections
3. Vérifier que le refresh token fonctionne correctement
