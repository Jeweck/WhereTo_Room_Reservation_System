
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

  const getInitials = (name: string) => {
    if (!name) return 'GC';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      // Get first letter of first name and first letter of last name
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    if (parts.length === 1 && parts[0]) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return 'GC';
  };

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground w-64 fixed left-0 top-0 z-50 transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center p-2">
          <MapPin className="text-white w-6 h-6" />
        </div>
        <span className="font-headline font-bold text-xl tracking-tight text-white">WhereTo</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium group",
              pathname === item.href 
                ? "bg-secondary text-secondary-foreground" 
                : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-colors",
              pathname === item.href ? "text-secondary-foreground" : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70"
            )} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border mt-auto">
        <div className="flex items-center gap-3 p-3 mb-4 rounded-lg bg-sidebar-accent/30">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold uppercase text-secondary-foreground flex-shrink-0 shadow-sm border border-white/10">
            {getInitials(currentUser?.name || '')}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold truncate text-white leading-tight">
              {currentUser?.name || 'Gordon College User'}
            </span>
            <span className="text-[10px] text-sidebar-foreground/60 truncate leading-tight">
              {currentUser?.email || 'No email provided'}
            </span>
            <span className="text-[9px] font-bold text-secondary uppercase mt-0.5 tracking-wider">
              {currentUser?.role || 'User'}
            </span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground/70 hover:text-white hover:bg-destructive/10 hover:text-destructive group h-9"
          onClick={() => {
            logout();
            window.location.href = '/';
          }}
        >
          <LogOut className="mr-3 h-4 w-4 group-hover:text-destructive" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
