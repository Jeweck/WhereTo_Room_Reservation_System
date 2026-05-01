
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Shield, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/hooks/use-store';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();
  const [loading, setLoading] = useState<string | null>(null);

  const handleLogin = (role: 'admin' | 'user') => {
    setLoading(role);
    setTimeout(() => {
      login(role);
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="mb-12 text-center space-y-4">
        <div className="w-16 h-16 bg-primary rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-primary/20">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-headline font-bold text-primary tracking-tight">AcademiaReserve</h1>
          <p className="text-muted-foreground mt-2 max-w-xs mx-auto">Smart campus facility management & intelligent scheduling.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <Card className="relative overflow-hidden group border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <User className="w-24 h-24 text-primary" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-secondary" />
              Student & Faculty
            </CardTitle>
            <CardDescription>Access bookings, search facilities, and request reservations.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full group h-12 text-base font-semibold"
              onClick={() => handleLogin('user')}
              disabled={!!loading}
            >
              {loading === 'user' ? 'Signing in...' : 'Sign In as User'}
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Shield className="w-24 h-24 text-primary" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Administrator
            </CardTitle>
            <CardDescription>Manage facilities, oversee all bookings, and configure settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline"
              className="w-full group h-12 text-base font-semibold border-primary text-primary hover:bg-primary hover:text-white"
              onClick={() => handleLogin('admin')}
              disabled={!!loading}
            >
              {loading === 'admin' ? 'Verifying...' : 'Sign In as Admin'}
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <p className="mt-8 text-sm text-muted-foreground/60">
        &copy; 2024 AcademiaReserve Systems. All rights reserved.
      </p>
    </div>
  );
}
