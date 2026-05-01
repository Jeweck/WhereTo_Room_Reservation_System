
"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { useStore } from '@/hooks/use-store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { currentUser } = useStore();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Basic auth check
    const checkAuth = async () => {
      const savedUser = localStorage.getItem('academia_user');
      if (!savedUser) {
        router.push('/');
      } else {
        setIsLoaded(true);
      }
    };
    checkAuth();
  }, [router]);

  if (!isLoaded) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64 min-h-screen transition-all duration-300">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
