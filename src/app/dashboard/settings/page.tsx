
"use client"

import { useState } from 'react';
import { useStore } from '@/hooks/use-store';
import { useAuth } from '@/firebase';
import { updatePassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { 
  User, 
  Lock, 
  ShieldCheck, 
  Chrome,
  Loader2
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  const { currentUser, updateProfile, loginWithEmail } = useStore();
  const auth = useAuth();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isSwitchingAccount, setIsSwitchingAccount] = useState(false);

  const handleUpdateName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsUpdatingProfile(true);
    setTimeout(() => {
      updateProfile(name);
      toast({ title: "Profile Updated", description: "Your display name has been changed and saved." });
      setIsUpdatingProfile(false);
    }, 500);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth?.currentUser) return;
    if (newPassword !== confirmPassword) {
      toast({ title: "Mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    
    setIsUpdatingPassword(true);
    try {
      await updatePassword(auth.currentUser, newPassword);
      toast({ title: "Password Changed", description: "Your account is now more secure." });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast({ 
        title: "Security Error", 
        description: error.message || "Please re-authenticate to change your password.", 
        variant: "destructive" 
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSwitchAccount = async () => {
    if (!auth) return;
    setIsSwitchingAccount(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      if (user.email && !user.email.endsWith('gordoncollege.edu.ph')) {
        toast({
          title: "Access Denied",
          description: "Only @gordoncollege.edu.ph accounts are allowed.",
          variant: "destructive"
        });
        return;
      }

      if (user.email) {
        await loginWithEmail(user.email, user.displayName);
        toast({ title: "Account Switched", description: `Signed in as ${user.email}` });
        window.location.reload();
      }
    } catch (error: any) {
      toast({ title: "Switch Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSwitchingAccount(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-headline font-bold text-primary">Settings</h1>
        <p className="text-muted-foreground">Manage your school profile and account security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <User className="w-5 h-5 text-secondary" />
            Profile Details
          </h2>
          <p className="text-sm text-muted-foreground">
            Update how you appear to administrators when booking facilities.
          </p>
        </div>

        <Card className="md:col-span-2 border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Edit Profile</CardTitle>
            <CardDescription>Your custom display name is stored permanently.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateName} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={currentUser?.email} disabled className="bg-muted" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" />
              </div>
              <Button type="submit" disabled={isUpdatingProfile} className="bg-primary shadow-lg hover:shadow-xl transition-all">
                {isUpdatingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-secondary" />
            Security
          </h2>
          <p className="text-sm text-muted-foreground">
            Ensure your school account remains protected.
          </p>
        </div>

        <Card className="md:col-span-2 border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Change Password</CardTitle>
            <CardDescription>We recommend a mix of symbols and letters.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="new-pass">New Password</Label>
                <Input 
                  id="new-pass" 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-pass">Confirm New Password</Label>
                <Input 
                  id="confirm-pass" 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                />
              </div>
              <Button type="submit" disabled={isUpdatingPassword} variant="outline" className="border-primary text-primary hover:bg-primary/5 shadow-sm">
                {isUpdatingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-secondary" />
            Integrations
          </h2>
          <p className="text-sm text-muted-foreground">
            Switch between different school authentication accounts.
          </p>
        </div>

        <Card className="md:col-span-2 border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Google Account</CardTitle>
            <CardDescription>Use your @gordoncollege.edu.ph Google account to sign in.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-accent/30 border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  <Chrome className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Switch Account</p>
                  <p className="text-xs text-muted-foreground">Sign in with a different identity</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSwitchAccount} 
                disabled={isSwitchingAccount}
                className="font-bold shadow-sm"
              >
                {isSwitchingAccount ? <Loader2 className="animate-spin" /> : "Switch Account"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
