
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore } from '@/hooks/use-store';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useAuth } from '@/firebase';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail } = useStore();
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.endsWith('gordoncollege.edu.ph')) {
      toast({
        title: "Invalid Domain",
        description: "Please use your @gordoncollege.edu.ph email address.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Role determination logic is handled inside useStore's loginWithEmail
    setTimeout(() => {
      loginWithEmail(email);
      router.push('/dashboard');
      setLoading(false);
    }, 1000);
  };

  const handleGoogleLogin = async () => {
    if (!auth) {
      toast({
        title: "Auth Error",
        description: "Firebase Authentication is not initialized.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // School domain validation
      if (user.email && !user.email.endsWith('gordoncollege.edu.ph')) {
        toast({
          title: "Access Denied",
          description: "Only @gordoncollege.edu.ph accounts are allowed.",
          variant: "destructive"
        });
        await auth.signOut();
        setLoading(false);
        return;
      }

      if (user.email) {
        // Log in the user in our local store for dashboard access
        loginWithEmail(user.email, user.displayName);
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to sign in with Google.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="w-20 h-20 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-2xl border-4 border-white">
          <MapPin className="w-12 h-12 text-primary" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight">WhereTo</h1>
          <p className="text-white/80 mt-2 max-w-xs mx-auto">Campus facility management & intelligent scheduling for Gordon College.</p>
        </div>
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>Enter your Gordon College email to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">School Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="*********@gordoncollege.edu.ph" 
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                Tip: Use an email with "ADMIN" in the prefix for administrative access.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold group bg-primary text-white hover:opacity-90" 
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-12 border-muted-foreground/20 hover:bg-accent" 
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
        </CardContent>
        <CardFooter className="bg-accent/30 border-t flex justify-center py-4">
          <p className="text-xs text-muted-foreground">
            Only authorized Gordon College accounts are permitted.
          </p>
        </CardFooter>
      </Card>

      <p className="mt-8 text-sm text-white/40">
        &copy; 2024 WhereTo Systems. All rights reserved.
      </p>
    </div>
  );
}
