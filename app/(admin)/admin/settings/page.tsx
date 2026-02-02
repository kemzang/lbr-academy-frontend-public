// ============================================
// Admin - Paramètres de l'application
// ============================================

'use client';

import { useState } from 'react';
import { 
  Settings,
  Globe,
  Bell,
  Shield,
  Palette,
  Database,
  Mail,
  CreditCard,
  Save,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'La Bibliothèque des Rois',
    siteDescription: 'Plateforme de partage de connaissances',
    siteUrl: 'https://lbr-academy.com',
    supportEmail: 'support@lbr-academy.com',
    defaultLanguage: 'fr',
  });

  const [contentSettings, setContentSettings] = useState({
    requireApproval: true,
    allowComments: true,
    allowRatings: true,
    maxFileSize: '50',
    allowedFileTypes: 'pdf,epub,mp3,mp4',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNewUser: true,
    emailNewContent: true,
    emailNewPurchase: true,
    emailNewComment: false,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    currency: 'XAF',
    minPrice: '500',
    platformFee: '10',
    paymentMethods: 'momo,om,card',
  });

  const handleSave = async (section: string) => {
    setIsSaving(true);
    
    // Simuler la sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`Paramètres ${section} enregistrés`);
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
        <p className="text-muted-foreground">
          Configurez les paramètres généraux de la plateforme
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="general">
            <Globe className="h-4 w-4 mr-2 hidden sm:inline" />
            Général
          </TabsTrigger>
          <TabsTrigger value="content">
            <Database className="h-4 w-4 mr-2 hidden sm:inline" />
            Contenus
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2 hidden sm:inline" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="h-4 w-4 mr-2 hidden sm:inline" />
            Paiements
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>
                Informations de base de votre plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="siteName">Nom du site</Label>
                <Input
                  id="siteName"
                  value={generalSettings.siteName}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteName: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Description</Label>
                <Textarea
                  id="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteUrl">URL du site</Label>
                <Input
                  id="siteUrl"
                  value={generalSettings.siteUrl}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Email de support</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={generalSettings.supportEmail}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="defaultLanguage">Langue par défaut</Label>
                <Select 
                  value={generalSettings.defaultLanguage}
                  onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, defaultLanguage: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <Button onClick={() => handleSave('généraux')} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Settings */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres des contenus</CardTitle>
              <CardDescription>
                Configuration de la gestion des contenus
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Validation obligatoire</p>
                  <p className="text-sm text-muted-foreground">
                    Les contenus doivent être approuvés avant publication
                  </p>
                </div>
                <Switch
                  checked={contentSettings.requireApproval}
                  onCheckedChange={(checked) => setContentSettings(prev => ({ ...prev, requireApproval: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Autoriser les commentaires</p>
                  <p className="text-sm text-muted-foreground">
                    Les utilisateurs peuvent commenter les contenus
                  </p>
                </div>
                <Switch
                  checked={contentSettings.allowComments}
                  onCheckedChange={(checked) => setContentSettings(prev => ({ ...prev, allowComments: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Autoriser les notes</p>
                  <p className="text-sm text-muted-foreground">
                    Les utilisateurs peuvent noter les contenus
                  </p>
                </div>
                <Switch
                  checked={contentSettings.allowRatings}
                  onCheckedChange={(checked) => setContentSettings(prev => ({ ...prev, allowRatings: checked }))}
                />
              </div>

              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="maxFileSize">Taille max des fichiers (Mo)</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  value={contentSettings.maxFileSize}
                  onChange={(e) => setContentSettings(prev => ({ ...prev, maxFileSize: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allowedFileTypes">Types de fichiers autorisés</Label>
                <Input
                  id="allowedFileTypes"
                  value={contentSettings.allowedFileTypes}
                  onChange={(e) => setContentSettings(prev => ({ ...prev, allowedFileTypes: e.target.value }))}
                  placeholder="pdf,epub,mp3,mp4"
                />
                <p className="text-xs text-muted-foreground">Séparés par des virgules</p>
              </div>

              <Separator />

              <Button onClick={() => handleSave('contenus')} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications par email</CardTitle>
              <CardDescription>
                Configurez les notifications envoyées aux administrateurs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Nouvel utilisateur</p>
                  <p className="text-sm text-muted-foreground">
                    Recevoir un email lors d'une nouvelle inscription
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.emailNewUser}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNewUser: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Nouveau contenu</p>
                  <p className="text-sm text-muted-foreground">
                    Recevoir un email lors d'un nouveau contenu soumis
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.emailNewContent}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNewContent: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Nouvel achat</p>
                  <p className="text-sm text-muted-foreground">
                    Recevoir un email lors d'un nouvel achat
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.emailNewPurchase}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNewPurchase: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Nouveau commentaire</p>
                  <p className="text-sm text-muted-foreground">
                    Recevoir un email lors d'un nouveau commentaire
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.emailNewComment}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNewComment: checked }))}
                />
              </div>

              <Separator />

              <Button onClick={() => handleSave('notifications')} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de paiement</CardTitle>
              <CardDescription>
                Configuration des paiements et commissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currency">Devise par défaut</Label>
                <Select 
                  value={paymentSettings.currency}
                  onValueChange={(value) => setPaymentSettings(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="XAF">XAF (Franc CFA)</SelectItem>
                    <SelectItem value="EUR">EUR (Euro)</SelectItem>
                    <SelectItem value="USD">USD (Dollar)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minPrice">Prix minimum (XAF)</Label>
                <Input
                  id="minPrice"
                  type="number"
                  value={paymentSettings.minPrice}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, minPrice: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="platformFee">Commission plateforme (%)</Label>
                <Input
                  id="platformFee"
                  type="number"
                  min="0"
                  max="100"
                  value={paymentSettings.platformFee}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, platformFee: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  Pourcentage prélevé sur chaque vente
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentMethods">Méthodes de paiement</Label>
                <Input
                  id="paymentMethods"
                  value={paymentSettings.paymentMethods}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, paymentMethods: e.target.value }))}
                  placeholder="momo,om,card"
                />
                <p className="text-xs text-muted-foreground">
                  momo = MTN MoMo, om = Orange Money, card = Carte bancaire
                </p>
              </div>

              <Separator />

              <Button onClick={() => handleSave('paiements')} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
