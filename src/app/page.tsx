
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

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail } = useStore();
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
    
    // Simulate network delay
    setTimeout(() => {
      loginWithEmail(email);
      const isAdmin = email.includes('admin');
      toast({
        title: "Welcome to WhereTo",
        description: `Logged in as ${isAdmin ? 'Administrator' : 'Student/Faculty'}.`,
      });
      router.push('/dashboard');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="w-16 h-16 bg-primary rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-primary/20">
          <MapPin className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-headline font-bold text-primary tracking-tight">WhereTo</h1>
          <p className="text-muted-foreground mt-2 max-w-xs mx-auto">Campus facility management & intelligent scheduling for Gordon College.</p>
        </div>
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>Enter your Gordon College email to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
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
                Tip: Include "admin" in your email to access administrative tools.
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
              className="w-full h-12 text-base font-semibold group" 
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="bg-accent/30 border-t flex justify-center py-4">
          <p className="text-xs text-muted-foreground">
            Only authorized Gordon College accounts are permitted.
          </p>
        </CardFooter>
      </Card>

      <p className="mt-8 text-sm text-muted-foreground/60">
        &copy; 2024 WhereTo Systems. All rights reserved.
      </p>
    </div>
  );
}
