"use client";

import { useEffect, useState } from "react";
import { Network, Server, Leaf, Activity, Zap, Radio, Globe, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function TopologyPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [orbitRadius, setOrbitRadius] = useState(180);

  useEffect(() => {
    fetchNodes();
    
    const handleResize = () => {
      setOrbitRadius(window.innerWidth < 768 ? 110 : 180);
    };
    
    // Set initial size safely after hydration or immediately if window exists
    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
    }
    
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  const fetchNodes = async () => {
    try {
      const res = await fetch("/api/nodes/latest");
      const data = await res.json();
      setNodes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecommission = async () => {
    if (!selectedNode) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/nodes/${selectedNode.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSelectedNode(null);
        setConfirmDelete(false);
        fetchNodes();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {/* Decommission Confirmation Overlay */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-tactical-surface border-2 border-tactical-error p-8 space-y-6"
            >
              <div className="flex items-center gap-4 text-tactical-error">
                <ShieldAlert size={32} className="animate-pulse" />
                <div>
                    <h2 className="text-xl font-black headline-font uppercase tracking-tighter">Tactical_Override_Required</h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">Action: Permanent Node Decommissioning</p>
                </div>
              </div>
              
              <div className="p-4 bg-tactical-error/10 border border-tactical-error/20 space-y-3">
                <p className="text-[10px] text-primary uppercase leading-relaxed font-bold">
                    Warning: You are about to purge <span className="text-tactical-error">{selectedNode?.nodeName}</span> from the grid core. All telemetry data and security logs for this sector will be destroyed.
                </p>
                <div className="text-[9px] text-secondary/60 uppercase italic">ID: {selectedNode?.id}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                    onClick={() => setConfirmDelete(false)}
                    className="bg-tactical-high text-primary hover:bg-white/5 font-black uppercase tracking-widest text-[10px] h-12 rounded-none border border-white/10"
                >
                    Abort_Process
                </Button>
                <Button 
                    onClick={handleDecommission}
                    disabled={isDeleting}
                    className="bg-tactical-error text-white hover:bg-tactical-error/80 font-black uppercase tracking-widest text-[10px] h-12 rounded-none shadow-lg shadow-tactical-error/20"
                >
                    {isDeleting ? "Purging..." : "Confirm_Purge"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black headline-font tracking-tighter uppercase text-primary">Grid_Topology_Mapping</h1>
        <p className="text-secondary text-xs uppercase tracking-[0.3em] font-bold">Spatial Distribution // Sector_7G Infrastructure</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sector Map Layout */}
        <Card className="lg:col-span-2 bg-tactical-surface border-white/5 border-b-2 border-r-2 border-white/10 shadow-none overflow-hidden relative min-h-[400px] md:min-h-[500px]">
          <CardHeader className="bg-tactical-high/30 border-b border-white/5 px-6 py-4">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Globe size={14} className="text-tactical-accent" />
              Live_Sector_Map: 01-DHAKA-SOUTH
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 relative h-full flex items-center justify-center bg-[radial-gradient(circle,rgba(197,255,201,0.03)_1px,transparent_1px)] bg-[size:30px_30px]">
             {/* Central Hub Visualization */}
             <div className="relative">
                <div className="w-24 h-24 border-2 border-tactical-accent/20 rounded-full flex items-center justify-center animate-[pulse_4s_infinite]">
                    <div className="w-16 h-16 border border-tactical-accent/40 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-tactical-accent rounded-full glow-green" />
                    </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-black text-tactical-accent uppercase tracking-widest mt-16 whitespace-nowrap">
                    Command_Core
                </div>

                {/* Nodes radiating from center */}
                {nodes.map((node, i) => {
                  const angle = (i * (360 / nodes.length)) * (Math.PI / 180);
                  const x = Math.cos(angle) * orbitRadius;
                  const y = Math.sin(angle) * orbitRadius;
                  const isOnline = node.telemetry?.[0] && (Date.now() - new Date(node.telemetry[0].createdAt).getTime()) < 60000;
                  const isSelected = selectedNode?.id === node.id;

                  return (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.2 }}
                      style={{ position: 'absolute', left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                      className="group"
                    >
                      {/* Connection Line */}
                      <div 
                        style={{ 
                          width: orbitRadius, 
                          height: 1, 
                          position: 'absolute', 
                          top: '50%', 
                          right: '100%', 
                          transformOrigin: 'right center',
                          transform: `rotate(${angle + Math.PI}rad)`
                        }}
                        className={cn(
                            "bg-gradient-to-r from-tactical-accent/20 to-transparent",
                            !isOnline && "from-tactical-error/20",
                            isSelected && "from-tactical-accent opacity-100"
                        )}
                      />
                      
                      <div 
                        onClick={() => setSelectedNode(isSelected ? null : node)}
                        className={cn(
                        "w-12 h-12 bg-tactical-high border flex items-center justify-center relative z-10 hover:scale-110 transition-transform cursor-pointer",
                        isOnline ? "border-tactical-accent/30" : "border-tactical-error/30",
                        isSelected && "border-tactical-accent ring-2 ring-tactical-accent/20"
                      )}>
                        {node.nodeType === "WAREHOUSE" ? <Server size={18} className="text-primary" /> : <Leaf size={18} className="text-primary" />}
                        <div className={cn(
                          "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-tactical-bg",
                          isOnline ? "bg-tactical-accent" : "bg-tactical-error"
                        )} />
                        
                        {/* Status Label */}
                        <div className={cn(
                            "absolute top-14 left-1/2 -translate-x-1/2 bg-tactical-high border border-white/10 px-3 py-1.5 transition-all z-20",
                            isSelected ? "block" : "hidden group-hover:block whitespace-nowrap"
                        )}>
                            <p className="text-[10px] font-black uppercase text-primary">{node.nodeName}</p>
                            <p className="text-[8px] text-secondary uppercase italic mb-2">{isOnline ? "Active_Sync" : "Signal_Lost"}</p>
                            
                            {isSelected && (
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setConfirmDelete(true);
                                    }}
                                    className="w-full mt-2 bg-tactical-error/10 hover:bg-tactical-error/20 text-tactical-error text-[8px] font-black uppercase py-1 border border-tactical-error/30 transition-colors"
                                >
                                    Decommission
                                </button>
                            )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
             </div>
          </CardContent>
          <div className="absolute bottom-6 left-6 text-[8px] text-white/20 uppercase tracking-[0.4em] font-black">
            Coord_Ref: 23.8103° N, 90.4125° E // Dhaka_Enclave
          </div>
        </Card>

        {/* Infrastructure Stats */}
        <div className="space-y-8">
           <Card className="bg-tactical-surface border-white/5 border-b-2 border-r-2 border-white/10 shadow-none">
              <CardHeader className="bg-tactical-high/30 border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-widest">Network_Stats</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                 {[
                   { label: "Active_Nodes", value: nodes.filter(n => n.isActive).length, icon: Radio },
                   { label: "Global_Latency", value: "24ms", icon: Zap },
                   { label: "Sync_Integrity", value: "99.8%", icon: Activity },
                 ].map((stat) => (
                   <div key={stat.label} className="flex items-center justify-between p-4 bg-black/20 border border-white/5">
                      <div className="flex items-center gap-3">
                        <stat.icon size={16} className="text-tactical-accent" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">{stat.label}</span>
                      </div>
                      <span className="text-lg font-black headline-font text-primary">{stat.value}</span>
                   </div>
                 ))}
              </CardContent>
           </Card>

           <Card className="bg-tactical-surface border-white/5 border-b-2 border-r-2 border-white/10 shadow-none">
              <CardHeader className="bg-tactical-high/30 border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-widest">Protocol_Health</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                 <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-secondary">
                        <span>Mesh_Stability</span>
                        <span className="text-tactical-accent">OPTIMAL</span>
                    </div>
                    <div className="w-full h-2 bg-black/40 border border-white/5">
                        <div className="w-[85%] h-full bg-tactical-accent" />
                    </div>
                    <p className="text-[9px] text-secondary/60 leading-relaxed uppercase">
                        Multipath routing established across all sub-sectors. Dynamic rerouting active for signal interference mitigation.
                    </p>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
