"use client";

import { useEffect, useState } from "react";
import { ScrollText, Search, Filter, Monitor, Download, Server, Leaf, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/logs");
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(log => 
    log.node.nodeName.toLowerCase().includes(search.toLowerCase()) ||
    log.node.nodeType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
            <h1 className="text-4xl font-black headline-font tracking-tighter uppercase text-primary">Master_Event_Log</h1>
            <p className="text-secondary text-xs uppercase tracking-[0.3em] font-bold">Comprehensive Protocol Audit Feed</p>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="border-white/10 bg-tactical-high text-primary hover:bg-white/5 font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-none">
                <Download size={14} className="mr-2" /> Export CSV
            </Button>
        </div>
      </div>

      <Card className="bg-tactical-surface border-white/5 border-b-2 border-r-2 border-white/10 shadow-none overflow-hidden">
        <CardHeader className="bg-tactical-high/30 border-b border-white/5 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <ScrollText size={14} className="text-tactical-accent" />
                Live_Telemtry_Stream
            </CardTitle>
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1 border border-white/5 rounded-none">
                <div className="w-1.5 h-1.5 bg-tactical-accent rounded-full animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-tactical-accent">Ingesting</span>
            </div>
          </div>
          
          <div className="relative w-full md:w-80 group">
             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-tactical-accent transition-colors" />
             <Input 
                placeholder="FILTER_BY_NODE_OR_PROTOCOL"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-black/60 border-white/5 focus:border-tactical-accent/40 h-10 pl-10 text-[10px] font-mono tracking-widest uppercase rounded-none"
             />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-black/40 text-secondary uppercase tracking-[0.2em] text-[8px] font-black border-b border-white/5">
                  <th className="px-6 py-4 border-r border-white/5">TIMESTAMP (BDT)</th>
                  <th className="px-6 py-4 border-r border-white/5">ORIGIN_NODE</th>
                  <th className="px-6 py-4 border-r border-white/5">SECTOR</th>
                  <th className="px-6 py-4 border-r border-white/5">PROTOCOL_ID</th>
                  <th className="px-6 py-4 border-r border-white/5">DATA_PAYLOAD</th>
                  <th className="px-6 py-4">STRENGTH</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-tactical-high/40 transition-colors group">
                    <td className="px-6 py-5 font-mono text-[10px] text-primary/80">
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-secondary/40" />
                        {new Date(log.createdAt).toLocaleTimeString('en-GB', { timeZone: 'Asia/Dhaka', hour12: false })}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {log.node.nodeType === "WAREHOUSE" ? <Server size={14} className="text-secondary" /> : <Leaf size={14} className="text-secondary" />}
                        <span className="text-primary font-black text-[10px] tracking-tight uppercase whitespace-nowrap">
                          {log.node.nodeName.replace(/\s+/g, '_')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-[9px] font-bold text-secondary uppercase tracking-widest">
                         {log.node.nodeType === "WAREHOUSE" ? "CENTRAL_CORE" : "FIELD_ALPHA"}
                       </span>
                    </td>
                    <td className="px-6 py-5 font-mono text-[10px] text-secondary">
                      {log.node.nodeType === "WAREHOUSE" ? "THERMAL_SYNC_v2" : "MOISTURE_v1.4"}
                    </td>
                    <td className="px-6 py-5">
                      <div className="bg-black/40 border border-white/5 px-3 py-1 text-[9px] font-mono text-tactical-accent truncate max-w-[200px]">
                        {JSON.stringify(log.payload)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                         <div className="flex-1 w-12 h-1.5 bg-white/5 rounded-none overflow-hidden">
                            <div 
                                className="h-full bg-tactical-accent" 
                                style={{ width: `${60 + Math.random() * 30}%` }}
                            />
                         </div>
                         <span className="text-[9px] font-mono text-secondary">{(85 + Math.random() * 10).toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredLogs.length === 0 && (
                <div className="p-20 text-center space-y-4">
                    <ScrollText className="mx-auto text-white/5" size={48} />
                    <p className="text-secondary uppercase text-[10px] font-black tracking-widest">No matching protocol entries found in the grid</p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
