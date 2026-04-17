"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { TacticalNodeCard, TacticalAlert, TacticalLogFeed } from "./TacticalComponents";
import { TelemetryChart } from "./TelemetryChart";
import { Activity, Loader2, ShieldAlert } from "lucide-react";

export default function Dashboard() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLatest = async () => {
    try {
      const res = await fetch("/api/nodes/latest");
      if (res.ok) {
        const data = await res.json();
        setNodes(data);
      }
    } catch (err) {
      console.error("Failed to fetch nodes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatest();
    const interval = setInterval(fetchLatest, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateThreshold = async (nodeId: string, type: "cooling" | "irrigation", value: number) => {
    try {
      const field = type === "cooling" ? "coolingThreshold" : "irrigationThreshold";
      const res = await fetch(`/api/nodes/${nodeId}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });

      if (res.ok) {
        toast({
          title: "PROTOCOL UPDATED",
          description: `${type.toUpperCase()} THRESHOLD SET TO ${value}${type === "cooling" ? "°C" : "%"}`,
        });
        setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, [field]: value } : n));
      } else {
        throw new Error("Failed to update");
      }
    } catch (err) {
      toast({
        title: "SYNC BREACH",
        description: "COULD NOT UPLOAD NEW PROTOCOL TO CLOUD.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-secondary">
        <Loader2 size={48} className="animate-spin mb-6 text-primary" />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Initializing_Tactical_Grid...</span>
      </div>
    );
  }

  // Check for alerts
  const activeAlerts = nodes.filter(node => {
    const p = node.telemetry?.[0]?.payload;
    if (!p) return false;
    if (node.nodeType === "WAREHOUSE" && p.internal_temp_c > (node.coolingThreshold || 25)) return true;
    if (node.nodeType === "FIELD" && p.soil_moisture_percent < (node.irrigationThreshold || 30)) return true;
    return false;
  });

  return (
    <div className="space-y-10">
      {/* Alert Panel */}
      {activeAlerts.length > 0 && (
        <section>
          {activeAlerts.map(node => (
            <TacticalAlert 
              key={node.id}
              type="error"
              message={`${node.nodeName} EXCEEDING THERMAL REGULATION LIMITS`}
            />
          ))}
        </section>
      )}

      {/* Main Node Grid */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {nodes.map((node) => (
          <div key={node.id} className="space-y-6">
            <TacticalNodeCard node={node} updateThreshold={updateThreshold} />
            <div className="bg-tactical-surface border border-white/5 p-6 border-b-2 border-r-2 border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Analytics // {node.nodeName.replace(/\s+/g, '_')}</span>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-tactical-accent" />
                   <span className="text-[8px] text-secondary font-bold uppercase tracking-widest">Real_Time_Stream</span>
                </div>
              </div>
              <div className="h-64">
                <TelemetryChart 
                  nodeId={node.id} 
                  nodeType={node.nodeType} 
                  threshold={node.nodeType === "WAREHOUSE" ? node.coolingThreshold : node.irrigationThreshold} 
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Infrastructure Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <div className="lg:col-span-2">
           <TacticalLogFeed nodes={nodes} />
        </div>
        
        {/* System Health Summary */}
        <div className="space-y-6">
           <div className="bg-tactical-surface border-l-4 border-tactical-accent p-8">
              <span className="text-[10px] text-secondary uppercase tracking-[0.2em] font-bold block mb-2">Grid_Uptime</span>
              <div className="text-4xl headline-font font-black text-primary">99.98%</div>
              <div className="mt-4 w-full h-1 bg-black/40">
                <div className="w-[99.98%] h-full bg-tactical-accent" />
              </div>
           </div>
           
           <div className="bg-tactical-surface border-l-4 border-secondary p-8">
              <span className="text-[10px] text-secondary uppercase tracking-[0.2em] font-bold block mb-2">Network_Throughput</span>
              <div className="text-4xl headline-font font-black text-primary">42.4 KB/s</div>
              <div className="flex gap-1 mt-4 items-end h-4">
                 {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                   <div key={i} className="flex-1 bg-secondary/20" style={{ height: `${h}%` }}>
                     <div className="w-full bg-secondary/40" style={{ height: `${Math.random() * 100}%` }} />
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-tactical-surface border-l-4 border-tactical-error p-8">
              <span className="text-[10px] text-secondary uppercase tracking-[0.2em] font-bold block mb-2">Anomaly_Probability</span>
              <div className="text-4xl headline-font font-black text-tactical-error">0.02 LOW</div>
              <p className="text-[9px] text-secondary/60 uppercase mt-4 tracking-widest font-bold">Last Scan: 2 min ago</p>
           </div>
        </div>
      </div>
    </div>
  );
}
