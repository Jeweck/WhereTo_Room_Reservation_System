
"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { useStoreContext } from '@/components/StoreProvider';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { currentUser } = useStoreContext();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('whereto_user');
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
      <main className="pl-20 min-h-screen transition-all duration-300">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardContent>
      {children}
    </DashboardContent>
  );
}
