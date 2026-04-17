"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";

interface TelemetryChartProps {
  nodeId: string;
  nodeType: string;
  threshold?: number;
}

export function TelemetryChart({ nodeId, nodeType, threshold }: TelemetryChartProps) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/nodes/${nodeId}/history`, {
          cache: "no-store"
        });
        if (res.ok) {
          const history = await res.json();
          // Flatten payload and format time
          const formatted = history.map((t: any) => {
            const date = t.createdAt ? new Date(t.createdAt) : null;
            const timeStr = date && !isNaN(date.getTime()) 
              ? date.toLocaleTimeString("en-GB", { timeZone: "Asia/Dhaka", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
              : "--:--:--";
            
            return {
              time: timeStr,
              ...t.payload,
            };
          }).reverse();
          setData(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch history", err);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 10000);
    return () => clearInterval(interval);
  }, [nodeId]);

  const isWarehouse = nodeType === "WAREHOUSE";
  const primaryKey = isWarehouse ? "internal_temp_c" : "soil_moisture_percent";
  const primaryColor = isWarehouse ? "#ec7c8a" : "#c5ffc9"; // tactical-error vs tactical-accent

  return (
    <div className="w-full h-full font-mono">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#25252b" 
          />
          <XAxis 
            dataKey="time" 
            stroke="#909fb4" 
            fontSize={8} 
            tickLine={false} 
            axisLine={false}
            dy={10}
            minTickGap={10}
          />
          <YAxis 
            stroke="#909fb4" 
            fontSize={9} 
            tickLine={false} 
            axisLine={false}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "#131316", 
              border: "1px solid #25252b",
              borderRadius: "0px",
              fontSize: "10px",
              color: "#c6c6c7"
            }}
            itemStyle={{ color: primaryColor, fontWeight: "bold" }}
            cursor={{ stroke: "#47474e", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey={primaryKey}
            stroke={primaryColor}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorMetric)"
            name="INTERNAL_CORE"
          />
          {isWarehouse && (
            <>
              <Line
                type="monotone"
                dataKey="external_temp_c"
                stroke="#909fb4"
                strokeWidth={2}
                dot={false}
                name="EXTERNAL_HUB"
              />
              {threshold !== undefined && (
                <ReferenceLine 
                  y={threshold} 
                  stroke="#ef4444" 
                  strokeDasharray="3 3"
                  label={{ 
                    position: 'right', 
                    value: `LIMIT: ${threshold}°C`, 
                    fill: '#ef4444', 
                    fontSize: 8,
                    fontWeight: 'bold'
                  }} 
                />
              )}
            </>
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
