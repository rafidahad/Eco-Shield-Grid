"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  Shield, 
  LayoutDashboard, 
  Network, 
  ScrollText, 
  ShieldCheck, 
  Settings, 
  UserCircle, 
  Activity,
  Bell,
  Clock,
  Menu,
  X,
  Lock,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function TacticalStatusBar() {
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-tactical-accent z-[100] animate-pulse" />
  );
}


export function TacticalSidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "Topology", icon: Network, path: "/topology" },
    { label: "Logs", icon: ScrollText, path: "/logs" },
    { label: "Security", icon: ShieldCheck, path: "/security" },
    { label: "Config", icon: Settings, path: "/register" },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 bg-tactical-bg flex flex-col pt-16 z-40 border-r border-white/5 transition-transform duration-300 md:translate-x-0 absolute md:fixed",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="px-6 py-8">
          {/* Operator Info */}
        <div className="flex items-center gap-3 mb-8 bg-tactical-high p-4 border border-white/10 group cursor-pointer hover:bg-tactical-high/80 transition-colors">
          <div className="w-10 h-10 bg-muted flex items-center justify-center border border-white/5 group-hover:border-tactical-accent/30 transition-colors">
            <UserCircle className="text-primary" size={24} />
          </div>
          <div>
            <h3 className="text-[11px] font-black text-primary headline-font uppercase tracking-tight">OPERATOR_01</h3>
            <p className="text-[9px] text-secondary uppercase tracking-[0.2em]">SECTOR_7G</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <div 
                key={item.label}
                onClick={() => {
                  router.push(item.path);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 transition-all duration-200 cursor-pointer group",
                  isActive 
                    ? "bg-tactical-high text-primary border-l-2 border-primary" 
                    : "text-secondary hover:bg-tactical-high/50 hover:text-primary"
                )}
              >
                <item.icon className={cn("text-sm", isActive ? "text-primary" : "text-secondary group-hover:text-primary")} size={16} />
                <span className="text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
              </div>
            );
          })}
          
          <div 
            onClick={async () => {
              const res = await fetch("/api/auth/logout", { method: "POST" });
              if (res.ok) {
                router.push("/login");
                router.refresh();
              }
            }}
            className="flex items-center gap-3 px-4 py-3 text-tactical-error/60 hover:bg-tactical-error/5 hover:text-tactical-error transition-all duration-200 cursor-pointer group mt-4 border-t border-white/5 pt-6"
          >
            <LogOut className="text-sm group-hover:rotate-12 transition-transform" size={16} />
            <span className="text-[11px] font-bold uppercase tracking-widest">Terminate_Session</span>
          </div>
        </nav>
      </div>

      <div className="mt-auto p-6">
        <div className="bg-tactical-high p-4 border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] text-secondary uppercase tracking-widest font-bold">GRID_LOAD</span>
            <span className="text-[9px] text-tactical-accent font-mono font-bold">34%</span>
          </div>
          <div className="w-full h-1 bg-black/40 border border-white/5">
            <div className="w-1/3 h-full bg-tactical-accent shadow-[0_0_8px_rgba(197,255,201,0.5)]"></div>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}

export function TacticalLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-tactical-bg selection:bg-tactical-accent selection:text-black">
      <TacticalStatusBar />
      <header className="fixed top-0 w-full border-t-4 border-tactical-accent bg-tactical-bg flex justify-between items-center px-4 md:px-6 py-3 z-[90] border-b border-white/5">
        <div className="flex items-center gap-4 md:gap-8">
          {!isLoginPage && (
            <button 
              className="md:hidden text-secondary hover:text-primary transition-colors focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          )}
          <span className="text-lg md:text-xl font-bold tracking-tighter text-primary headline-font">ECO_SHIELD_GRID</span>
          {/* Only show nav links if NOT on login page */}
          {!isLoginPage && (
            <nav className="hidden md:flex items-center gap-6">
              <button className="text-secondary hover:text-primary font-label uppercase tracking-widest text-[10px] transition-colors duration-150">SENSORS</button>
              <button className="text-primary border-b-2 border-primary pb-1 font-label uppercase tracking-widest text-[10px]">NODES</button>
              <button className="text-secondary hover:text-primary font-label uppercase tracking-widest text-[10px] transition-colors duration-150">NETWORK</button>
              <button className="text-secondary hover:text-primary font-label uppercase tracking-widest text-[10px] transition-colors duration-150">THREATS</button>
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-6">
          {!isLoginPage && (
            <div className="hidden sm:flex items-center gap-2 bg-tactical-high px-3 py-1.5 border border-white/5">
              <div className="w-2 h-2 rounded-full bg-tactical-accent animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-tactical-accent">LIVE_GRID_ACTIVE</span>
            </div>
          )}
          <div className="flex items-center gap-4 text-primary">
             <TacticalClock />
             {!isLoginPage && <Bell size={18} className="text-secondary cursor-pointer hover:text-primary transition-colors" />}
          </div>
        </div>
      </header>
      
      {!isLoginPage && <TacticalSidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />}

      <main className={cn(
        "transition-all duration-300 pt-20",
        isLoginPage ? "ml-0" : "md:ml-64 ml-0"
      )}>
        <div className={cn(
          "p-8 mx-auto",
          isLoginPage ? "max-w-full" : "max-w-[1600px]"
        )}>
          {children}
        </div>
      </main>
      
      {/* Footer HUD Decor - Only show if not login or adjust layout */}
      <footer className={cn(
        "p-4 md:p-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-secondary font-bold uppercase tracking-widest bg-black/20",
        isLoginPage ? "ml-0" : "md:ml-64 ml-0"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-tactical-accent rounded-full animate-pulse" />
          SYSTEM_PROTOCOL: BRUTALIST_v4.0.2
        </div>
        <div className="flex gap-8">
          <span>ENCRYPTION: AES-256-TACTICAL</span>
          <span className="text-tactical-accent px-2 bg-tactical-accent/10 border border-tactical-accent/20">ENCLAVE_SECURE</span>
        </div>
      </footer>
    </div>
  );
}

function TacticalClock() {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center gap-2">
            <Clock size={16} className="text-secondary" />
            <span className="text-[11px] font-bold tracking-widest font-mono">
                {time ? time.toLocaleTimeString('en-GB', { timeZone: 'Asia/Dhaka', hour12: false }) : "--:--:--"} BDT
            </span>
        </div>
    );
}
