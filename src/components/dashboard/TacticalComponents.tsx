"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Activity, 
  Server, 
  Leaf, 
  Zap,
  Waves,
  AlertTriangle,
  Monitor
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TacticalNodeCardProps {
  node: any;
  updateThreshold: (nodeId: string, type: "cooling" | "irrigation", value: number) => void;
}

export function TacticalNodeCard({ node, updateThreshold }: TacticalNodeCardProps) {
  const lastTelemetry = node.telemetry?.[0];
  const payload = lastTelemetry?.payload || {};
  const isWarehouse = node.nodeType === "WAREHOUSE";
  
  // A node is online if it sent data in the last 60 seconds
  const lastSeen = lastTelemetry ? new Date(lastTelemetry.createdAt).getTime() : 0;
  const isOnline = (Date.now() - lastSeen) < 60000;
  
  return (
    <Card className={cn(
      "bg-tactical-surface border-white/5 border-b-2 border-r-2 border-white/10 shadow-none overflow-hidden hover:border-white/10 transition-all group relative",
      !isOnline && "opacity-60 saturate-[0.2]"
    )}>
      {!isOnline && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="bg-tactical-error/10 border border-tactical-error/40 px-4 py-2 flex items-center gap-3">
            <Activity className="text-tactical-error animate-pulse" size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-tactical-error">Signal_Lost // Offline</span>
          </div>
        </div>
      )}
      <CardHeader className="bg-tactical-high/30 px-6 py-3 flex flex-row items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
            {node.nodeType}_NODE // {node.nodeName}
          </span>
          {isWarehouse ? <Server size={14} className="text-secondary" /> : <Leaf size={14} className="text-secondary" />}
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", isOnline ? "bg-tactical-accent animate-pulse" : "bg-tactical-error")} />
          <span className={cn("text-[9px] font-black uppercase tracking-widest", isOnline ? "text-tactical-accent" : "text-tactical-error")}>
            {isOnline ? "Live" : "Fault"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        {isWarehouse ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Primary Metric: Internal Temp */}
            <div className="flex flex-col items-center justify-center p-6 bg-black/20 border border-white/5">
              <span className="text-[10px] text-secondary uppercase mb-3 tracking-[0.3em] font-bold">Internal_Core_Temp</span>
              <div className="flex items-baseline gap-1">
                <span className={cn("text-5xl md:text-6xl headline-font font-black tracking-tighter", 
                  (payload.internal_temp_c || 0) > (node.coolingThreshold || 25) ? "text-tactical-error glow-red" : "text-primary"
                )}>
                  {payload.internal_temp_c ?? "--"}
                </span>
                <span className="text-xl font-light text-secondary">°C</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[10px] text-secondary/60 font-mono">
                <Droplets size={12} />
                <span>HUM: {payload.internal_hum_pct ?? "--"}%</span>
              </div>
            </div>

            {/* Controls & Secondary */}
            <div className="space-y-6">
              {/* Threshold Control */}
              <div className="space-y-3 bg-tactical-high p-4 border border-white/5">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-secondary">Cooling_Trigger</span>
                  <span className="text-primary font-mono">{node.coolingThreshold ?? 25}°C</span>
                </div>
                <Slider 
                  defaultValue={[node.coolingThreshold ?? 25]} 
                  max={45} 
                  step={0.5} 
                  onValueCommit={(val) => updateThreshold(node.id, "cooling", val[0])}
                  className="py-2"
                />
              </div>

              {/* Status HUDs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={cn("p-3 flex items-center justify-between border", 
                  payload.fan_active ? "bg-tactical-accent/10 border-tactical-accent/30" : "bg-black/40 border-white/5"
                )}>
                  <div className="flex items-center gap-2">
                    <Zap size={12} className={cn(payload.fan_active ? "text-tactical-accent" : "text-secondary")} />
                    <span className={cn("text-[9px] font-black uppercase tracking-widest", 
                      payload.fan_active ? "text-tactical-accent" : "text-secondary"
                    )}>FAN: {payload.fan_active ? "ACTIVE" : "IDLE"}</span>
                  </div>
                  {payload.fan_active && <div className="w-1.5 h-1.5 bg-tactical-accent animate-pulse" />}
                </div>
                
                <div className="p-3 flex flex-col justify-center border bg-black/40 border-white/5">
                  <span className="text-[8px] text-secondary uppercase tracking-widest font-bold mb-1">External_Hub</span>
                  <span className="text-primary font-mono text-xs">{payload.external_temp_c ?? "--"}°C / {payload.external_hum_pct ?? "--"}%</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Primary Metric: Soil Moisture */}
            <div className="flex flex-col items-center justify-center p-6 bg-black/20 border border-white/5">
              <span className="text-[10px] text-secondary uppercase mb-3 tracking-[0.3em] font-bold">Soil_Moisture_lvl</span>
              <div className="flex items-baseline gap-1">
                <span className={cn("text-5xl md:text-6xl headline-font font-black tracking-tighter", 
                  (payload.soil_moisture_percent || 0) < (node.irrigationThreshold || 30) ? "text-tactical-warning" : "text-primary"
                )}>
                  {payload.soil_moisture_percent ?? "--"}
                </span>
                <span className="text-xl font-light text-secondary">%</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[10px] text-secondary/60 font-mono">
                <Activity size={12} />
                <span>SIGNAL: 100%</span>
              </div>
            </div>

            {/* Controls & Metrics */}
            <div className="space-y-6">
              {/* Threshold Control */}
              <div className="space-y-3 bg-tactical-high p-4 border border-white/5">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-secondary">Irrigation_Trigger</span>
                  <span className="text-primary font-mono">{node.irrigationThreshold ?? 30}%</span>
                </div>
                <Slider 
                  defaultValue={[node.irrigationThreshold ?? 30]} 
                  max={100} 
                  min={5}
                  step={1} 
                  onValueCommit={(val) => updateThreshold(node.id, "irrigation", val[0])}
                  className="py-2"
                />
              </div>

              {/* Air Quality HUD */}
              <div className="p-4 border bg-tactical-warning/5 border-tactical-warning/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] text-tactical-warning uppercase tracking-widest font-bold">Air_Quality_Index</span>
                  <span className="text-[9px] text-tactical-warning font-black">MODERATE</span>
                </div>
                <div className="flex items-center gap-3">
                  <Wind size={16} className="text-tactical-warning" />
                  <span className="text-xl headline-font font-bold text-tactical-warning">{payload.air_quality_ppm ?? "--"}</span>
                  <span className="text-[10px] text-tactical-warning/60 font-mono">PPM</span>
                </div>
                <div className="mt-3 w-full h-1 bg-tactical-warning/20">
                  <div className="w-2/3 h-full bg-tactical-warning"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function TacticalAlert({ message, type = "error" }: { message: string, type?: "error" | "warning" }) {
  return (
    <div className={cn(
      "border-l-4 p-4 flex items-center justify-between mb-8",
      type === "error" ? "bg-destructive/10 border-tactical-error" : "bg-tactical-warning/10 border-tactical-warning"
    )}>
      <div className="flex items-center gap-4">
        <AlertTriangle className={type === "error" ? "text-tactical-error" : "text-tactical-warning"} size={20} />
        <div className={cn(
          "headline-font font-bold tracking-tight uppercase text-sm",
          type === "error" ? "text-tactical-error" : "text-tactical-warning"
        )}>
          {type.toUpperCase()} LEVEL BREACH: {message}
        </div>
      </div>
      <div className={cn(
        "text-[10px] font-black uppercase tracking-widest px-3 py-1",
        type === "error" ? "bg-tactical-error/10 text-tactical-error" : "bg-tactical-warning/10 text-tactical-warning"
      )}>
        Event_ID: {Math.floor(Math.random() * 9000) + 1000}
      </div>
    </div>
  );
}

export function TacticalLogFeed({ nodes }: { nodes: any[] }) {
  return (
    <section className="mt-8 border border-white/5">
      <div className="bg-tactical-high px-6 py-3 border-b border-white/5 flex justify-between items-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">ACTIVE_LOG_FEED</span>
        <button className="text-[9px] text-primary hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1">
          <Monitor size={10} /> View All Logs
        </button>
      </div>
      <div className="bg-tactical-surface overflow-x-auto">
        <table className="w-full text-left font-body border-collapse">
          <thead>
            <tr className="bg-black/40 text-secondary uppercase tracking-[0.2em] text-[8px] font-black">
              <th className="px-6 py-4 border-r border-white/5">TIMESTAMP</th>
              <th className="px-6 py-4 border-r border-white/5">ORIGIN</th>
              <th className="px-6 py-4 border-r border-white/5">EVENT_TYPE</th>
              <th className="px-6 py-4 border-r border-white/5">STATUS</th>
              <th className="px-6 py-4">STRENGTH</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {nodes.flatMap(node => node.telemetry.slice(0, 2).map((t: any, i: number) => (
              <tr key={`${node.id}-${i}`} className="hover:bg-tactical-high/40 transition-colors group">
                <td className="px-6 py-4 font-mono text-[10px] text-secondary">
                  {t.createdAt ? new Date(t.createdAt).toLocaleTimeString('en-GB', { timeZone: 'Asia/Dhaka', hour12: false }) : "--:--:--"}
                </td>
                <td className="px-6 py-4 text-primary font-bold text-[10px] tracking-tight whitespace-nowrap">
                  {node.nodeName.toUpperCase().replace(/\s+/g, '_')}
                </td>
                <td className="px-6 py-4 font-mono text-[10px] text-secondary/80">
                  {node.nodeType === "WAREHOUSE" ? "THERMAL_SYNC_PROTOCOL" : "MOISTURE_LEVEL_CHECK"}
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border",
                    node.isActive ? "bg-tactical-accent/10 text-tactical-accent border-tactical-accent/20" : "bg-muted text-secondary border-white/5"
                  )}>
                    {node.isActive ? "ACTIVE" : "IDLE"}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-[10px] text-secondary">
                  {(85 + Math.random() * 15).toFixed(1)}%
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
