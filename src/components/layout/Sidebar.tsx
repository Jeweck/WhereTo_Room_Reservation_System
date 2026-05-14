
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
            <rect x="0" y="0" width="32" height="32" rx="9" fill="white" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16 6C12.6863 6 10 8.68629 10 12C10 16.5 16 26 16 26C16 26 22 16.5 22 12C22 8.68629 19.3137 6 16 6ZM16 14.5C14.6193 14.5 13.5 13.3807 13.5 12C13.5 10.6193 14.6193 9.5 16 9.5C17.3807 9.5 18.5 10.6193 18.5 12C18.5 13.3807 17.3807 14.5 16 14.5Z"
              fill="black"
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
        
        <button 
          className={cn(
            "flex w-full items-center transition-all duration-200 text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 group h-10 overflow-hidden rounded-md",
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
            "transition-all duration-300 whitespace-nowrap text-sm font-medium",
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 absolute"
          )}>
            Sign Out
          </span>
        </button>
      </div>
    </div>
  );
}
