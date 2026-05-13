
"use client"

import { useState } from 'react';
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
  const [isHovered, setIsHovered] = useState(false);

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
      {/* Branding Area */}
      <div className="p-5 flex items-center gap-3 h-20 flex-shrink-0 overflow-hidden">
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
          <MapPin className="text-secondary-foreground w-6 h-6" />
        </div>
        <span className={cn(
          "font-headline font-bold text-xl tracking-tight text-white whitespace-nowrap transition-all duration-300",
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none absolute"
        )}>
          WhereTo
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center rounded-lg transition-all duration-200 group relative overflow-hidden",
              isHovered ? "px-4 py-3 gap-3" : "p-3 justify-center",
              pathname === item.href 
                ? "bg-secondary text-secondary-foreground" 
                : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground"
            )}
          >
            <item.icon className={cn(
              "w-6 h-6 flex-shrink-0 transition-colors",
              pathname === item.href ? "text-secondary-foreground" : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70"
            )} />
            <span className={cn(
              "font-medium whitespace-nowrap transition-all duration-300",
              isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute"
            )}>
              {item.label}
            </span>
            
            {/* Tooltip for collapsed state */}
            {!isHovered && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-primary text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100] whitespace-nowrap border border-white/10 shadow-lg">
                {item.label}
              </div>
            )}
          </Link>
        ))}
      </nav>

      {/* User & Sign Out Area */}
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
