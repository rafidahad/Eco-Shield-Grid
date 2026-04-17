"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Key, Loader2, ArrowRight, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        toast({
          title: "ACCESS GRANTED",
          description: "TACTICAL_ENCLAVE_UNLOCKED. Welcome, Operator.",
        });
        router.push("/");
        router.refresh();
      } else {
        toast({
          title: "ACCESS DENIED",
          description: "INVALID SECURITY CREDENTIALS.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "SYSTEM FAULT",
        description: "COULD NOT VERIFY SECURITY TOKEN.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tactical-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(197,255,201,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(197,255,201,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10"
      >
        <Card className="bg-tactical-surface border-white/5 shadow-2xl border-b-2 border-r-2 border-white/10">
          <CardHeader className="text-center pt-10 pb-6 border-b border-white/5 bg-tactical-high/30">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-tactical-accent/10 flex items-center justify-center text-tactical-accent border border-tactical-accent/20 rounded-none transform rotate-45" />
                <div className="absolute inset-0 flex items-center justify-center text-tactical-accent">
                  <Lock size={24} />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl font-black tracking-tighter headline-font uppercase text-primary">Secure_Enclave_Auth</CardTitle>
            <CardDescription className="text-secondary uppercase text-[9px] tracking-[0.3em] font-bold mt-2">
              Grid Access Protocol v4.0.2
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-6 pt-10 px-10">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-secondary font-black font-mono">Operator_ID</Label>
                <div className="relative group">
                   <Input 
                    placeholder="USERNAME"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-black/40 border-white/10 focus:border-tactical-accent/50 h-12 uppercase font-mono text-sm pl-10"
                    required
                  />
                  <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-tactical-accent transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-secondary font-black font-mono">Security_Token</Label>
                <div className="relative group">
                  <Input 
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/40 border-white/10 focus:border-tactical-accent/50 h-12 text-sm pl-10"
                    required
                  />
                  <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-tactical-accent transition-colors" />
                </div>
              </div>

              <div className="bg-tactical-error/5 border border-tactical-error/10 p-4 text-[9px] text-tactical-error leading-relaxed uppercase tracking-widest flex gap-3">
                 <Shield className="shrink-0" size={14} />
                 <span>Unauthorized access attempts are logged and reported to Sector_7G infrastructure security.</span>
              </div>
            </CardContent>

            <CardFooter className="pb-10 px-10">
              <Button 
                type="submit" 
                className="w-full bg-tactical-accent text-black hover:bg-tactical-accent/90 shadow-lg shadow-tactical-accent/10 h-12 font-black uppercase tracking-widest rounded-none group"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    Authorize Connection
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition" />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>

      {/* Footer HUD */}
      <div className="absolute bottom-8 w-full text-center text-[8px] text-white/10 uppercase tracking-[0.5em] font-black">
        Protocol_Lockdown_Active // AES-256-ENCRYPTED
      </div>
    </div>
  );
}
