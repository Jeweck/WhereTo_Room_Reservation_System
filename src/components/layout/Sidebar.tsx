
"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  CalendarCheck, 
  Sparkles, 
  LogOut,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useStore } from '@/hooks/use-store';

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser, logout } = useStore();

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Facilities', href: '/dashboard/facilities', icon: Building2 },
    { label: 'My Bookings', href: '/dashboard/bookings', icon: CalendarCheck },
    { label: 'AI Assistant', href: '/dashboard/recommend', icon: Sparkles },
  ];

  if (currentUser?.role === 'admin') {
    menuItems.push({ label: 'Admin Panel', href: '/dashboard/admin', icon: ShieldCheck });
  }

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground w-64 fixed left-0 top-0 z-50 transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <MapPin className="text-secondary-foreground w-6 h-6" />
        </div>
        <span className="font-headline font-bold text-xl tracking-tight">WhereTo</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium group",
              pathname === item.href 
                ? "bg-sidebar-accent text-sidebar-primary" 
                : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-colors",
              pathname === item.href ? "text-sidebar-primary" : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70"
            )} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border mt-auto">
        <div className="flex items-center gap-3 p-3 mb-4 rounded-lg bg-sidebar-accent/30">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold uppercase">
            {currentUser?.name?.[0] || 'U'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold truncate">{currentUser?.name || 'Guest User'}</span>
            <span className="text-xs text-sidebar-foreground/50 truncate capitalize">{currentUser?.role || 'User'}</span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground/70 hover:text-white hover:bg-destructive/10 hover:text-destructive group"
          onClick={() => {
            logout();
            window.location.href = '/';
          }}
        >
          <LogOut className="mr-3 h-5 w-5 group-hover:text-destructive" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
