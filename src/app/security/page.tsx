"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, AlertTriangle, Lock, UserCheck, ShieldAlert, Zap, Activity, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function SecurityPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/security/events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
    const interval = setInterval(fetchEvents, 30000);
    return () => clearInterval(interval);
  }, []);

  const criticalBreaches = events.filter(e => e.severity === "CRITICAL");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black headline-font tracking-tighter uppercase text-primary">Security_Ops_Center</h1>
        <p className="text-secondary text-xs uppercase tracking-[0.3em] font-bold">Integrated Threat Vector Analysis & Audit</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: "Protection_Status", value: "LOCKDOWN", icon: Lock, color: "text-tactical-accent" },
           { label: "Active_Threats", value: criticalBreaches.length, icon: ShieldAlert, color: criticalBreaches.length > 0 ? "text-tactical-error" : "text-secondary" },
           { label: "System_Integrity", value: "99.99%", icon: ShieldCheck, color: "text-primary" },
           { label: "Auth_Requests", value: events.filter(e => e.type === "ADMIN_LOGIN").length, icon: UserCheck, color: "text-secondary" },
         ].map((stat) => (
           <Card key={stat.label} className="bg-tactical-surface border-white/5 border-b-2 border-r-2 border-white/10 shadow-none">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                 <stat.icon className={cn("mb-3", stat.color)} size={24} />
                 <span className="text-[9px] font-black uppercase tracking-widest text-secondary mb-1">{stat.label}</span>
                 <span className={cn("text-2xl font-black headline-font tracking-tight", stat.color)}>{stat.value}</span>
              </CardContent>
           </Card>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Threats / Breaches */}
        <Card className="lg:col-span-2 bg-tactical-surface border-white/5 border-b-2 border-r-2 border-white/10 shadow-none">
          <CardHeader className="bg-tactical-high/30 border-b border-white/5 p-6 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle size={14} className="text-tactical-error" />
                Active_Integrity_Breaches
            </CardTitle>
            <Badge variant="outline" className="border-tactical-error/30 text-tactical-error text-[8px] font-black uppercase tracking-widest bg-tactical-error/5">
                {criticalBreaches.length} Urgent_Events
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-white/5">
                {criticalBreaches.length > 0 ? criticalBreaches.map((event) => (
                    <div key={event.id} className="p-6 hover:bg-tactical-error/5 transition-colors flex gap-6 items-start">
                        <div className="p-3 bg-tactical-error/10 border border-tactical-error/20 text-tactical-error">
                            <Zap size={18} />
                        </div>
                        <div className="space-y-1 flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="text-[11px] font-black text-primary uppercase tracking-tight">{event.type} // {event.nodeName}</h4>
                                <span className="text-[9px] font-mono text-secondary">{new Date(event.timestamp).toLocaleString()}</span>
                            </div>
                            <p className="text-[10px] text-secondary/80 leading-relaxed uppercase">{event.details}</p>
                            <div className="pt-2 flex gap-4">
                                <button className="text-[8px] font-black text-tactical-error hover:text-white transition-colors uppercase tracking-[0.2em]">Deploy_Mitigation</button>
                                <button className="text-[8px] font-black text-secondary hover:text-white transition-colors uppercase tracking-[0.2em]">Ignore_Once</button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="p-20 text-center space-y-4">
                        <ShieldCheck className="mx-auto text-tactical-accent/20" size={48} />
                        <p className="text-secondary uppercase text-[10px] font-black tracking-widest">No critical integrity breaches detected in the grid</p>
                    </div>
                )}
             </div>
          </CardContent>
        </Card>

        {/* Audit Trail */}
        <Card className="bg-tactical-surface border-white/5 border-b-2 border-r-2 border-white/10 shadow-none flex flex-col">
           <CardHeader className="bg-tactical-high/30 border-b border-white/5 p-6">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} className="text-secondary" />
                Audit_Trail_Enclave
              </CardTitle>
              <CardDescription className="text-[9px] uppercase tracking-widest font-bold mt-1">Admin Access & Registry Logs</CardDescription>
           </CardHeader>
           <CardContent className="p-6 flex-1 overflow-y-auto max-h-[600px] space-y-6">
              {events.filter(e => e.type !== "THRESHOLD_BREACH").map((event) => (
                  <div key={event.id} className="relative pl-6 border-l border-white/10 pb-6 last:pb-0">
                      <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] bg-secondary rounded-full border-2 border-tactical-bg" />
                      <div className="space-y-1">
                          <p className="text-[10px] font-black text-primary uppercase">{event.type}</p>
                          <p className="text-[9px] text-secondary/60 uppercase italic">{new Date(event.timestamp).toLocaleTimeString()}</p>
                          <p className="text-[9px] text-secondary leading-relaxed uppercase pr-4">{event.details}</p>
                      </div>
                  </div>
              ))}
           </CardContent>
           <div className="p-6 border-t border-white/5 bg-black/20">
              <div className="flex items-center justify-between">
                <span className="text-[8px] text-secondary font-black uppercase tracking-widest">AES-256 Rotation</span>
                <span className="text-[8px] text-primary font-mono">02:24:12 Remaining</span>
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
}
