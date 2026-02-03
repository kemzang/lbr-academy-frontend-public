# 📋 Liste Complète des Endpoints Backend Requis

Ce document répertorie **TOUS** les endpoints nécessaires pour que le frontend de "La Bibliothèque des Rois" fonctionne entièrement.

---

## 🔐 1. AUTHENTIFICATION (`/api/auth`)

### ✅ Déjà implémentés (à vérifier)
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/refresh-token` - Rafraîchir le token
- `GET /api/auth/me` - Profil utilisateur actuel
- `POST /api/auth/password/forgot` - Mot de passe oublié
- `POST /api/auth/password/reset` - Réinitialiser le mot de passe
- `POST /api/auth/password/change` - Changer le mot de passe
- `GET /api/auth/verify-email?token=xxx` - Vérifier l'email

---

## 👤 2. UTILISATEURS (`/api/users`)

### ✅ Déjà implémentés (à vérifier)
- `GET /api/users/profile` - Mon profil complet
- `PUT /api/users/profile` - Modifier mon profil
- `POST /api/users/profile/picture` - Uploader photo de profil (FormData)
- `GET /api/users/{userId}/public` - Profil public d'un utilisateur
- `GET /api/users/search?query=xxx&page=0&size=20` - Rechercher des utilisateurs
- `GET /api/users/creators?page=0&size=20` - Lister les créateurs

---

## 📚 3. CONTENUS (`/api/contents`)

### ✅ Déjà implémentés (à vérifier)
- `GET /api/contents?page=0&size=20&search=xxx&type=xxx&categoryId=xxx&authorId=xxx&sort=xxx` - Rechercher/lister les contenus
- `GET /api/contents/{id}` - Obtenir un contenu par ID
- `GET /api/contents/slug/{slug}` - Obtenir un contenu par slug
- `GET /api/contents/featured?limit=10` - Contenus en vedette
- `GET /api/contents/popular?limit=10` - Contenus populaires
- `GET /api/contents/bestsellers?limit=10` - Meilleures ventes
- `GET /api/contents/latest?limit=10` - Derniers contenus
- `GET /api/contents/top-rated?limit=10` - Mieux notés
- `GET /api/contents/category/{categoryId}?page=0&size=20` - Par catégorie
- `GET /api/contents/author/{authorId}?page=0&size=20` - Par auteur
- `POST /api/contents` - Créer un contenu
- `PUT /api/contents/{id}` - Modifier un contenu
- `POST /api/contents/{id}/cover` - Uploader la couverture (FormData)
- `POST /api/contents/{id}/file` - Uploader le fichier (FormData)
- `POST /api/contents/{id}/submit` - Soumettre pour validation
- `DELETE /api/contents/{id}` - Supprimer un contenu
- `GET /api/contents/my?page=0&size=20` - Mes contenus
- `POST /api/contents/{id}/rate` - Noter un contenu
- `POST /api/contents/{id}/purchase` - Acheter un contenu

### ⚠️ Endpoint critique manquant
- `GET /api/contents/{id}/download` - Télécharger le fichier du contenu (si acheté ou gratuit)
  
  **Note** : Actuellement, le frontend utilise `content.fileUrl` directement. Il serait préférable d'avoir un endpoint sécurisé qui :
  - Vérifie que l'utilisateur a accès au contenu (gratuit ou acheté)
  - Retourne le fichier avec les headers appropriés
  - Permet le suivi des téléchargements

---

## 📁 4. CATÉGORIES (`/api/categories`)

### ✅ Déjà implémentés (à vérifier)
- `GET /api/categories` - Toutes les catégories
- `GET /api/categories/tree` - Arbre des catégories
- `GET /api/categories/{id}` - Par ID
- `GET /api/categories/slug/{slug}` - Par slug
- `POST /api/categories` - Créer (Admin)
- `PUT /api/categories/{id}` - Modifier (Admin)
- `PATCH /api/categories/{id}/toggle` - Activer/désactiver (Admin)
- `DELETE /api/categories/{id}` - Supprimer (Admin)

---

## 💰 5. ACHATS (`/api/purchases`)

### ✅ Déjà implémentés (à vérifier)
- `POST /api/purchases` - Initier un achat
- `POST /api/purchases/{id}/complete` - Confirmer l'achat
- `GET /api/purchases?page=0&size=20` - Mes achats
- `GET /api/purchases/check/{contentId}` - Vérifier si acheté (retourne `{ purchased: boolean }`)

---

## 👑 6. ABONNEMENTS (`/api/subscriptions`)

### ✅ Déjà implémentés (à vérifier)
- `GET /api/subscriptions/plans` - Plans disponibles
- `POST /api/subscriptions` - S'abonner (avec objet)
- `POST /api/subscriptions/{planId}` - S'abonner (simplifié)
- `POST /api/subscriptions/{id}/activate` - Activer abonnement
- `POST /api/subscriptions/{id}/cancel` - Annuler abonnement (avec id)
- `POST /api/subscriptions/current/cancel` - Annuler abonnement actuel
- `GET /api/subscriptions/current` - Abonnement actuel
- `GET /api/subscriptions/history?page=0&size=20` - Historique
- `GET /api/subscriptions/check` - Vérifier si abonné (retourne `{ subscribed: boolean }`)
- `POST /api/subscriptions/plans` - Créer un plan (Admin)
- `PUT /api/subscriptions/plans/{id}` - Modifier un plan (Admin)
- `PATCH /api/subscriptions/plans/{id}/toggle` - Activer/désactiver plan (Admin)

---

## ❤️ 7. FAVORIS (`/api/favorites`)

### ✅ Déjà implémentés (à vérifier)
- `POST /api/favorites/{contentId}` - Ajouter aux favoris
- `DELETE /api/favorites/{contentId}` - Retirer des favoris
- `GET /api/favorites/check/{contentId}` - Vérifier si favori (retourne `{ isFavorite: boolean }`)
- `PATCH /api/favorites/{contentId}/collection` - Changer de collection
- `GET /api/favorites?page=0&size=20` - Tous mes favoris
- `GET /api/favorites/collection/{name}?page=0&size=20` - Favoris par collection
- `GET /api/favorites/collections` - Mes collections

**Format de réponse attendu pour `GET /api/favorites`:**
```json
{
  "content": [
    {
      "id": 1,
      "contentId": 123,
      "content": {
        "id": 123,
        "title": "Titre du contenu",
        "coverImage": "...",
        ...
      },
      "collection": "default",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "totalElements": 10,
  "totalPages": 1,
  "hasNext": false
}
```

---

## 💬 8. COMMENTAIRES (`/api/comments`)

### ✅ Déjà implémentés (à vérifier)
- `GET /api/comments/content/{contentId}?page=0&size=20` - Commentaires d'un contenu
- `POST /api/comments/content/{contentId}` - Ajouter un commentaire
- `PUT /api/comments/{id}` - Modifier un commentaire
- `DELETE /api/comments/{id}` - Supprimer un commentaire
- `POST /api/comments/{id}/like` - Liker un commentaire
- `DELETE /api/comments/{id}/like` - Unliker un commentaire
- `PATCH /api/comments/{id}/hide` - Masquer (Admin)
- `GET /api/comments/hidden?page=0&size=20` - Commentaires masqués (Admin)

---

## 🔔 9. NOTIFICATIONS (`/api/notifications`)

### ✅ Déjà implémentés (à vérifier)
- `GET /api/notifications?page=0&size=20` - Toutes mes notifications
- `GET /api/notifications/unread?page=0&size=20` - Non lues
- `GET /api/notifications/latest` - 10 dernières
- `GET /api/notifications/count` - Compteur non lues (retourne `{ unreadCount: number }`)
- `PATCH /api/notifications/{id}/read` - Marquer comme lue
- `PATCH /api/notifications/read-all` - Tout marquer comme lu
- `DELETE /api/notifications/read` - Supprimer les lues
- `DELETE /api/notifications/{id}` - Supprimer une notification

**Format de réponse attendu pour `GET /api/notifications`:**
```json
{
  "content": [
    {
      "id": 1,
      "type": "CONTENT_APPROVED",
      "title": "Votre contenu a été approuvé",
      "message": "...",
      "isRead": false,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "totalElements": 10,
  "unreadCount": 5,
  "hasNext": false
}
```

---

## 👥 10. FOLLOWS (`/api/follows`)

### ✅ Déjà implémentés (à vérifier)
- `POST /api/follows/{userId}` - Suivre un utilisateur
- `DELETE /api/follows/{userId}` - Ne plus suivre
- `GET /api/follows/check/{userId}` - Vérifier si suivi (retourne `{ isFollowing: boolean, notificationsEnabled: boolean }`)
- `PATCH /api/follows/{userId}/notifications` - Activer/désactiver notifications
- `GET /api/follows/followers?page=0&size=20` - Mes abonnés
- `GET /api/follows/following?page=0&size=20` - Mes abonnements
- `GET /api/follows/{userId}/followers?page=0&size=20` - Abonnés d'un utilisateur
- `GET /api/follows/{userId}/following?page=0&size=20` - Abonnements d'un utilisateur

---

## 🔄 11. DEMANDES DE RÔLE (`/api/role-upgrades`)

### ✅ Déjà implémentés (à vérifier)
- `POST /api/role-upgrades` - Demander un rôle
- `GET /api/role-upgrades/my` - Mes demandes
- `DELETE /api/role-upgrades/{id}` - Annuler ma demande
- `GET /api/role-upgrades/pending?page=0&size=20` - Demandes en attente (Admin)
- `GET /api/role-upgrades?page=0&size=20&status=xxx` - Toutes les demandes (Admin)
- `POST /api/role-upgrades/{id}/approve` - Approuver (Admin)
- `POST /api/role-upgrades/{id}/reject?reason=xxx` - Rejeter (Admin)
- `PATCH /api/role-upgrades/{id}/review` - Marquer comme en cours de revue (Admin)

---

## 🛠️ 12. ADMINISTRATION (`/api/admin`)

### 📊 Dashboard

#### ✅ Déjà implémentés (à vérifier)
- `GET /api/admin/dashboard` - Stats principales

**Format de réponse attendu:**
```json
{
  "totalUsers": 1000,
  "newUsersThisMonth": 50,
  "activeCreators": 120,
  "certifiedCoaches": 30,
  "totalContents": 500,
  "publishedContents": 450,
  "pendingContents": 10,
  "newContentsThisMonth": 25,
  "totalRevenue": 5000000,
  "revenueThisMonth": 500000,
  "totalPurchases": 2000,
  "activeSubscriptions": 150,
  "newSubscriptionsThisMonth": 20,
  "pendingRoleUpgrades": 5,
  "pendingContentApprovals": 10
}
```

- `GET /api/admin/dashboard/analytics` - Stats analytics avancées

**Format de réponse attendu:**
```json
{
  "totalUsers": 1000,
  "totalContents": 500,
  "totalRevenue": 5000000,
  "totalViews": 50000,
  "newUsersThisMonth": 50,
  "newContentsThisMonth": 25,
  "revenueThisMonth": 500000,
  "viewsThisMonth": 5000,
  "userGrowth": 5.0,
  "contentGrowth": 5.3,
  "revenueGrowth": 10.0,
  "viewsGrowth": 11.1
}
```

- `GET /api/admin/dashboard/top-contents?limit=5&period=month` - Top contenus

**Format de réponse attendu:**
```json
[
  {
    "id": 1,
    "title": "Titre du contenu",
    "coverImage": "...",
    "views": 1000,
    "purchases": 50,
    "revenue": 250000,
    "rating": 4.5
  }
]
```

- `GET /api/admin/dashboard/top-creators?limit=5&period=month` - Top créateurs

**Format de réponse attendu:**
```json
[
  {
    "id": 1,
    "name": "Nom du créateur",
    "username": "username",
    "avatarUrl": "...",
    "contentsCount": 10,
    "followersCount": 500,
    "totalRevenue": 1000000
  }
]
```

- `GET /api/admin/dashboard/recent-activity?limit=10` - Activité récente

**Format de réponse attendu:**
```json
[
  {
    "id": 1,
    "type": "PURCHASE",
    "userName": "Nom utilisateur",
    "userAvatar": "...",
    "action": "a acheté",
    "targetName": "Titre du contenu",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

- `GET /api/admin/dashboard/user-distribution` - Distribution des utilisateurs par rôle

**Format de réponse attendu:**
```json
{
  "distribution": [
    {
      "role": "APPRENANT",
      "count": 800,
      "percentage": 80.0
    },
    {
      "role": "CREATOR",
      "count": 150,
      "percentage": 15.0
    }
  ]
}
```

- `GET /api/admin/dashboard/revenue-chart?period=6months` - Données du graphique des revenus

**Format de réponse attendu:**
```json
{
  "data": [
    {
      "period": "2024-01",
      "revenue": 500000
    },
    {
      "period": "2024-02",
      "revenue": 600000
    }
  ]
}
```

### 👥 Gestion des Utilisateurs

#### ✅ Déjà implémentés (à vérifier)
- `GET /api/admin/users?page=0&size=20&role=xxx&status=xxx&search=xxx` - Lister les utilisateurs avec filtres
- `PATCH /api/admin/users/{id}/role?role=CREATOR` - Changer le rôle d'un utilisateur
- `PATCH /api/admin/users/{id}/suspend` - Suspendre un utilisateur
- `PATCH /api/admin/users/{id}/activate` - Réactiver un utilisateur

### 📚 Gestion des Contenus

#### ✅ Déjà implémentés (à vérifier)
- `GET /api/admin/contents?page=0&size=20&status=xxx&type=xxx&search=xxx` - Lister les contenus avec filtres
- `GET /api/admin/contents/pending?page=0&size=20` - Contenus en attente de validation
- `POST /api/admin/contents/{id}/approve` - Approuver un contenu
- `POST /api/admin/contents/{id}/reject` - Rejeter un contenu (avec `{ reason: string }` dans le body)
- `PATCH /api/admin/contents/{id}/feature?featured=true` - Mettre en avant un contenu (toggle)
- `DELETE /api/admin/contents/{id}` - Supprimer un contenu

### ⚠️ Endpoints manquants pour les catégories (Admin)
Les endpoints de catégories sont déjà dans `/api/categories`, mais doivent être protégés par le rôle ADMIN.

### ⚠️ Endpoints manquants pour les abonnements (Admin)
Les endpoints de plans d'abonnement sont déjà dans `/api/subscriptions/plans`, mais doivent être protégés par le rôle ADMIN.

### ⚙️ Paramètres de l'application

#### ❌ **ENDPOINTS MANQUANTS - CRITIQUE**

La page `/admin/settings` utilise actuellement des données mockées. Il faut créer ces endpoints :

- `GET /api/admin/settings` - Récupérer tous les paramètres

**Format de réponse attendu:**
```json
{
  "general": {
    "siteName": "La Bibliothèque des Rois",
    "siteDescription": "Plateforme de partage de connaissances",
    "siteUrl": "https://lbr-academy.com",
    "supportEmail": "support@lbr-academy.com",
    "defaultLanguage": "fr"
  },
  "content": {
    "requireApproval": true,
    "allowComments": true,
    "allowRatings": true,
    "maxFileSize": 50,
    "allowedFileTypes": ["pdf", "epub", "mp3", "mp4"]
  },
  "notifications": {
    "emailNewUser": true,
    "emailNewContent": true,
    "emailNewPurchase": true,
    "emailNewComment": false
  },
  "payment": {
    "currency": "XAF",
    "minPrice": 500,
    "platformFee": 10,
    "paymentMethods": ["momo", "om", "card"]
  }
}
```

- `PUT /api/admin/settings/general` - Mettre à jour les paramètres généraux

**Body:**
```json
{
  "siteName": "La Bibliothèque des Rois",
  "siteDescription": "...",
  "siteUrl": "https://lbr-academy.com",
  "supportEmail": "support@lbr-academy.com",
  "defaultLanguage": "fr"
}
```

- `PUT /api/admin/settings/content` - Mettre à jour les paramètres des contenus

**Body:**
```json
{
  "requireApproval": true,
  "allowComments": true,
  "allowRatings": true,
  "maxFileSize": 50,
  "allowedFileTypes": ["pdf", "epub", "mp3", "mp4"]
}
```

- `PUT /api/admin/settings/notifications` - Mettre à jour les paramètres de notifications

**Body:**
```json
{
  "emailNewUser": true,
  "emailNewContent": true,
  "emailNewPurchase": true,
  "emailNewComment": false
}
```

- `PUT /api/admin/settings/payment` - Mettre à jour les paramètres de paiement

**Body:**
```json
{
  "currency": "XAF",
  "minPrice": 500,
  "platformFee": 10,
  "paymentMethods": ["momo", "om", "card"]
}
```

---

## 👤 13. PARAMÈTRES UTILISATEUR (`/api/users/settings`)

### ❌ **ENDPOINTS MANQUANTS - CRITIQUE**

La page `/dashboard/settings` utilise actuellement des données mockées pour les préférences utilisateur. Il faut créer ces endpoints :

- `GET /api/users/settings` - Récupérer les paramètres utilisateur

**Format de réponse attendu:**
```json
{
  "notifications": {
    "emailNewContent": true,
    "emailNewFollower": true,
    "emailComments": false,
    "emailNewsletter": true,
    "pushEnabled": false
  },
  "privacy": {
    "profilePublic": true,
    "showEmail": false,
    "showActivity": true
  }
}
```

- `PUT /api/users/settings/notifications` - Mettre à jour les préférences de notifications

**Body:**
```json
{
  "emailNewContent": true,
  "emailNewFollower": true,
  "emailComments": false,
  "emailNewsletter": true,
  "pushEnabled": false
}
```

- `PUT /api/users/settings/privacy` - Mettre à jour les paramètres de confidentialité

**Body:**
```json
{
  "profilePublic": true,
  "showEmail": false,
  "showActivity": true
}
```

- `DELETE /api/users/account` - Supprimer le compte utilisateur (optionnel, actuellement non implémenté côté frontend)

---

## 📝 14. FORMATS DE RÉPONSE STANDARDS

### Pagination
Tous les endpoints qui retournent des listes paginées doivent suivre ce format :

```json
{
  "content": [...],
  "totalElements": 100,
  "totalPages": 5,
  "hasNext": true,
  "hasPrevious": false,
  "page": 0,
  "size": 20
}
```

### Réponses d'erreur
Toutes les erreurs doivent suivre ce format :

```json
{
  "error": "Message d'erreur",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Codes de statut HTTP
- `200 OK` - Succès
- `201 Created` - Ressource créée
- `400 Bad Request` - Requête invalide
- `401 Unauthorized` - Non authentifié
- `403 Forbidden` - Non autorisé (rôle insuffisant)
- `404 Not Found` - Ressource introuvable
- `409 Conflict` - Conflit (ex: déjà acheté)
- `500 Internal Server Error` - Erreur serveur

---

## 🔒 15. SÉCURITÉ ET AUTORISATIONS

### Rôles requis
- **PUBLIC** : Endpoints accessibles sans authentification
- **USER** : Endpoints nécessitant une authentification
- **CREATOR** : Endpoints pour les créateurs
- **ADMIN** : Endpoints pour les administrateurs

### Protection des endpoints
- Tous les endpoints `/api/admin/*` doivent être protégés par le rôle `ADMIN`
- Les endpoints de création/modification de contenu nécessitent le rôle `CREATOR` ou `ADMIN`
- Les endpoints de modification de profil nécessitent que l'utilisateur modifie son propre profil (sauf ADMIN)

---

## ✅ 16. CHECKLIST DE VÉRIFICATION

### Endpoints critiques à vérifier en priorité :

- [ ] `POST /api/contents/{id}/purchase` - Achat de contenu
- [ ] `GET /api/contents/{id}/download` - Téléchargement de fichier
- [ ] `GET /api/admin/settings` - Paramètres de l'application
- [ ] `PUT /api/admin/settings/*` - Mise à jour des paramètres
- [ ] Format de réponse des favoris avec `content` imbriqué
- [ ] Format de réponse des achats avec `content` imbriqué
- [ ] Format de réponse des notifications avec `unreadCount`
- [ ] Gestion des erreurs 409 pour les contenus déjà achetés/gratuits

---

## 📌 NOTES IMPORTANTES

1. **Base URL** : Tous les endpoints sont préfixés par `/api` (ex: `/api/auth/login`)
2. **Authentification** : Utiliser le header `Authorization: Bearer {token}` pour les endpoints protégés
3. **Content-Type** : `application/json` pour la plupart, `multipart/form-data` pour les uploads
4. **Pagination** : Utiliser `page` (0-indexed) et `size` comme paramètres de requête
5. **Filtres** : Passer les filtres comme paramètres de requête (ex: `?status=PENDING&type=BOOK`)

---

## 🚀 PROCHAINES ÉTAPES

Une fois ces endpoints implémentés côté backend, le frontend pourra :
- ✅ Fonctionner entièrement sans données mockées
- ✅ Gérer tous les cas d'usage prévus
- ✅ Afficher les vraies données en temps réel
- ✅ Permettre la gestion complète de la plateforme

---

---

## 📊 17. RÉCAPITULATIF DES ENDPOINTS MANQUANTS

### 🔴 Endpoints critiques (priorité haute)

1. **Paramètres Admin** (`/api/admin/settings`)
   - `GET /api/admin/settings`
   - `PUT /api/admin/settings/general`
   - `PUT /api/admin/settings/content`
   - `PUT /api/admin/settings/notifications`
   - `PUT /api/admin/settings/payment`

2. **Paramètres Utilisateur** (`/api/users/settings`)
   - `GET /api/users/settings`
   - `PUT /api/users/settings/notifications`
   - `PUT /api/users/settings/privacy`

3. **Téléchargement de contenu**
   - `GET /api/contents/{id}/download` (sécurisé avec vérification d'accès)

### 🟡 Endpoints à vérifier (peuvent exister mais format à confirmer)

1. **Format des réponses paginées** - S'assurer que tous suivent le format standard
2. **Format des favoris** - Vérifier que `content` est bien imbriqué dans la réponse
3. **Format des achats** - Vérifier que `content` est bien imbriqué dans la réponse
4. **Format des notifications** - Vérifier que `unreadCount` est inclus dans la réponse paginée

### ✅ Endpoints déjà utilisés (à vérifier qu'ils existent)

Tous les autres endpoints listés dans ce document sont déjà utilisés par le frontend. Il faut s'assurer qu'ils sont tous implémentés côté backend avec les formats de réponse attendus.

---

## 📈 18. STATISTIQUES

- **Total d'endpoints listés** : ~100+
- **Endpoints critiques manquants** : 8
- **Endpoints à vérifier** : Tous les autres
- **Sections couvertes** : 17

---

**Date de création** : 2024
**Dernière mise à jour** : 2024
**Version du frontend** : 1.0.0
