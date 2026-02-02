// ============================================
// Page profil utilisateur
// ============================================

'use client';

import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Edit,
  Camera,
  Save,
  Star,
  BookOpen,
  Users,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth-store';
import { userRoles } from '@/config/theme';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    fullName: 'Jean-Pierre Mbarga',
    email: user?.email || '',
    phone: '+237 699 88 77 66',
    bio: 'Coach en développement personnel avec 15 ans d\'expérience. Passionné par le partage de connaissances.',
  });

  const roleInfo = userRoles[user?.role as keyof typeof userRoles] || userRoles.APPRENANT;

  const handleSave = () => {
    // Sauvegarder via API
    toast.success('Profil mis à jour avec succès');
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mon profil</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} className="gradient-gold text-background">
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="h-32 w-32 border-4 border-primary/30">
                <AvatarImage src={user?.profilePictureUrl} />
                <AvatarFallback 
                  className="text-4xl"
                  style={{ backgroundColor: roleInfo.color + '20', color: roleInfo.color }}
                >
                  {formData.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button 
                  size="icon" 
                  className="absolute bottom-0 right-0 rounded-full h-10 w-10"
                >
                  <Camera className="h-5 w-5" />
                </Button>
              )}
            </div>

            <h2 className="text-xl font-bold">{formData.fullName}</h2>
            <p className="text-muted-foreground">@{formData.username}</p>
            
            <Badge 
              className="mt-3"
              style={{ backgroundColor: roleInfo.color + '20', color: roleInfo.color }}
            >
              {user?.roleDisplayName || 'Apprenant'}
            </Badge>

            <Separator className="my-6" />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  Contenus
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold">2,340</p>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Users className="h-3 w-3" />
                  Abonnés
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold">4.9</p>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Star className="h-3 w-3 text-primary fill-primary" />
                  Note
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold">15K</p>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Eye className="h-3 w-3" />
                  Vues
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="text-left space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{formData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{formData.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Membre depuis Jan 2025</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Nom d&apos;utilisateur</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    disabled={!isEditing}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={!isEditing}
                rows={4}
                placeholder="Parlez-nous de vous..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
