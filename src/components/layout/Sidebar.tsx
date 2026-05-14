
"use client"

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  CalendarCheck, 
  Settings, 
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useStore } from '@/hooks/use-store';

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser, logout } = useStore();
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Facilities', href: '/dashboard/facilities', icon: Building2 },
    { label: 'My Bookings', href: '/dashboard/bookings', icon: CalendarCheck },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  if (currentUser?.role === 'admin') {
    menuItems.push({ label: 'Admin Panel', href: '/dashboard/admin', icon: ShieldCheck });
  }

  const getInitials = (name: string) => {
    if (!name) return 'GC';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    if (parts.length === 1 && parts[0]) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return 'GC';
  };

  return (
    <div 
      className={cn(
        "flex flex-col h-full bg-sidebar text-sidebar-foreground fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out border-r border-sidebar-border overflow-x-hidden shadow-2xl",
        isHovered ? "w-64" : "w-20"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-5 flex items-center gap-3 h-20 flex-shrink-0 overflow-hidden">
        <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="grad-sidebar" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#db2777" />
              </linearGradient>
            </defs>
            <rect
              x="3"
              y="3"
              width="26"
              height="26"
              rx="8"
              stroke="url(#grad-sidebar)"
              strokeWidth="2"
            />
            <path
              d="M20 10C20 10 12 10 12 16C12 22 20 22 20 16C20 16 20 10 12 10"
              stroke="url(#grad-sidebar)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className={cn(
          "font-headline font-bold text-xl tracking-tight text-white whitespace-nowrap transition-all duration-300",
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none absolute"
        )}>
          WhereTo
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center rounded-lg transition-all duration-200 group relative overflow-hidden",
              isHovered ? "px-4 py-3 gap-3" : "p-3 justify-center",
              pathname === item.href 
                ? "bg-white text-primary shadow-lg" 
                : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground"
            )}
          >
            <item.icon className={cn(
              "w-6 h-6 flex-shrink-0 transition-colors",
              pathname === item.href ? "text-primary" : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70"
            )} />
            <span className={cn(
              "font-semibold whitespace-nowrap transition-all duration-300",
              isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute"
            )}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border/50 bg-sidebar-accent/20 overflow-hidden">
        <div className={cn(
          "flex items-center gap-3 p-2 mb-2 rounded-lg bg-sidebar-accent/30 overflow-hidden transition-all duration-300 relative",
          isHovered ? "w-full" : "w-10 h-10 p-0 rounded-full justify-center"
        )}>
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold uppercase text-secondary-foreground flex-shrink-0 shadow-sm border border-white/10">
            {getInitials(currentUser?.name || '')}
          </div>
          <div className={cn(
            "flex flex-col overflow-hidden transition-all duration-300",
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute"
          )}>
            <span className="text-sm font-semibold truncate text-white leading-tight">
              {currentUser?.name || 'User'}
            </span>
            <span className="text-[10px] text-sidebar-foreground/60 truncate leading-tight">
              {currentUser?.email || ''}
            </span>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          className={cn(
            "w-full transition-all duration-200 text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 group h-10 overflow-hidden",
            isHovered ? "justify-start px-3" : "justify-center p-0"
          )}
          onClick={() => {
            logout();
            window.location.href = '/';
          }}
        >
          <LogOut className={cn(
            "h-5 w-5 flex-shrink-0",
            isHovered ? "mr-3" : ""
          )} />
          <span className={cn(
            "transition-all duration-300 whitespace-nowrap",
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 absolute"
          )}>
            Sign Out
          </span>
        </Button>
      </div>
    </div>
  );
}
