"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Shield, Server, Leaf, FileDown, CheckCircle2, Copy, ArrowRight, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";
import { Separator } from "@/components/ui/separator";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    ownerName: "",
    nodeName: "",
    nodeType: "WAREHOUSE",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/nodes/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
        toast({
          title: "Registration Successful",
          description: `Node ${formData.nodeName} has been recorded in the grid.`,
        });
      } else {
        throw new Error("Registration failed");
      }
    } catch (err) {
      toast({
        title: "Registration Error",
        description: "Failed to connect to the central shield API.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if (!result) return;

    const doc = new jsPDF();
    const { deviceId, apiKey } = result;
    const { nodeName, nodeType, ownerName } = formData;
    const timestamp = new Date().toLocaleString();

    // --- Page 1: Credentials & Diagrams ---
    // Header Banner
    doc.setFillColor(5, 10, 20); // Deep Space
    doc.rect(0, 0, 210, 45, "F");
    
    doc.setTextColor(197, 255, 201); // Tactical Accent (Green)
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text("ECO-SHIELD GRID", 20, 25);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("TACTICAL INFRASTRUCTURE ENROLLMENT // CONFIGURATION BLUEPRINT", 20, 34);
    doc.text(`GENERATED: ${timestamp}`, 190, 34, { align: "right" });

    // Section 1: Identity
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("I. SYSTEM IDENTITY", 20, 60);
    doc.setDrawColor(197, 255, 201);
    doc.line(20, 62, 190, 62);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Node Name:    ${nodeName.toUpperCase()}`, 25, 72);
    doc.text(`Operator:     ${ownerName}`, 25, 79);
    doc.text(`Environment:  ${nodeType === 'WAREHOUSE' ? 'WAREHOUSE_LOGISTICS' : 'AGRICULTURAL_FIELD'}`, 25, 86);

    // Section 2: Security Credentials
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("II. SECURITY CREDENTIALS", 20, 105);
    doc.line(20, 107, 190, 107);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(15, 23, 42);
    doc.roundedRect(20, 115, 170, 35, 2, 2, "FD");

    doc.setFont("courier", "bold");
    doc.setFontSize(13);
    doc.text(`DEVICE_ID: ${deviceId}`, 30, 128);
    doc.text(`API_KEY:   ${apiKey}`, 30, 138);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("WARNING: These keys authorize data transmission. Keep them secure.", 105, 145, { align: "center" });

    // Section 3: Hardware Pinout
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("III. HARDWARE INTERFACE GUIDE", 20, 165);
    doc.line(20, 167, 190, 167);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    if (nodeType === "WAREHOUSE") {
      doc.text("Hardware Required: ESP32-WROOM, 2x DHT11 Sensors, 5V Relay", 20, 175);
      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(248, 250, 252);
      doc.rect(20, 180, 170, 35, "FD");
      doc.setFont("courier", "normal");
      doc.setFontSize(10);
      doc.text("PIN 04 -> Internal DHT11 (Data)", 30, 190);
      doc.text("PIN 14 -> External DHT11 (Data)", 30, 197);
      doc.text("PIN 05 -> Cooling Fan Relay (Active LOW)", 30, 204);
      doc.text("PIN VIN-> 5V Power | GND -> Common Ground", 30, 211);
    } else {
      doc.text("Hardware Required: ESP32-WROOM, MQ135 Air Sensor, Soil Moisture, 5V Pump", 20, 175);
      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(248, 250, 252);
      doc.rect(20, 180, 170, 35, "FD");
      doc.setFont("courier", "normal");
      doc.setFontSize(10);
      doc.text("PIN 35 -> Soil Moisture Sensor (Analog)", 30, 190);
      doc.text("PIN 34 -> MQ135 Air Quality (Analog)", 30, 197);
      doc.text("PIN 05 -> Irrigation Pump Relay (Active LOW)", 30, 204);
      doc.text("PIN VIN-> 5V Power | GND -> Common Ground", 30, 211);
    }

    // --- Page 2: Implementation Instructions ---
    doc.addPage();
    doc.setFillColor(5, 10, 20);
    doc.rect(0, 0, 210, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("CORE_IMPLEMENTATION_PROTOCOL", 20, 13);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("IV. FLASHING INSTRUCTIONS", 20, 35);
    doc.line(20, 37, 190, 37);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const steps = [
      "1. Open the Arduino IDE (ensure ESP32 board support is installed).",
      "2. Install the 'ArduinoJson' library by Benoit Blanchon (required for telemetry).",
      "3. Open the corresponding .cpp/.ino firmware from your repository folder.",
      "4. Update the NETWORK section with your local SSID and Password.",
      "5. Replace the DEVICE_ID and API_KEY constants with the credentials from Page 1.",
      "6. Verify the code and flash to the target hardware via USB-C/Micro-USB."
    ];
    let y = 47;
    steps.forEach(step => {
      doc.text(step, 25, y);
      y += 8;
    });

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("V. C++ IMPLEMENTATION SNIPPET", 20, 110);
    doc.line(20, 112, 190, 112);

    doc.setFillColor(30, 41, 59); // slate-800
    doc.rect(20, 120, 170, 50, "F");
    doc.setTextColor(197, 255, 201);
    doc.setFont("courier", "bold");
    doc.setFontSize(9);
    doc.text("// Update these lines in your firmware code:", 25, 130);
    doc.text(`const char* DEVICE_ID = "${deviceId}";`, 25, 140);
    doc.text(`const char* API_KEY   = "${apiKey}";`, 25, 150);
    doc.text(`const char* SERVER    = "https://eco-shield.vercel.app/api/telemetry";`, 25, 160);

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("VI. DATA SYNC VERIFICATION", 20, 190);
    doc.line(20, 192, 190, 192);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Once flashed, open the Serial Monitor (115200 baud). Look for:", 20, 202);
    doc.setFont("courier", "normal");
    doc.text("> WiFi Connected!", 25, 210);
    doc.text("> Telemetry Sent: [HTTP 201]", 25, 218);
    doc.text("> Pulse Confirmed by Central Command.", 25, 226);

    // Footer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text("SJS ECO-SHIELD GRID // AUTOMATED PROVISIONING BOT v1.0.4", 105, 285, { align: "center" });

    doc.save(`${nodeName.toLowerCase().replace(/\s+/g, "_")}_blueprint.pdf`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Credential copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-tactical-bg text-slate-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,255,201,0.05),transparent_50%)]" />
      
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-lg z-10"
          >
            <Card className="bg-tactical-surface border-white/5 backdrop-blur-xl shadow-2xl overflow-hidden relative border-b-2 border-r-2 border-white/10">
              <div className="absolute top-0 right-0 p-8 text-tactical-accent/5 pointer-events-none">
                <Shield size={120} />
              </div>

              <CardHeader className="pb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-tactical-accent/10 text-tactical-accent">
                    <Shield size={20} />
                  </div>
                  <span className="text-xs font-bold tracking-[0.2em] text-tactical-accent uppercase">System Enrollment</span>
                </div>
                <CardTitle className="text-3xl font-bold tracking-tight text-white mb-2 headline-font uppercase">Secure Registration</CardTitle>
                <CardDescription className="text-secondary">
                  Provision new hardware nodes and generate secure credentials for the Eco-Shield grid.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleRegister}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="node_name" className="text-secondary font-bold uppercase text-[10px] tracking-widest">Target Node Name</Label>
                    <Input 
                      id="node_name"
                      placeholder="e.g. Warehouse Zone A"
                      value={formData.nodeName}
                      onChange={(e) => setFormData({...formData, nodeName: e.target.value})}
                      className="bg-black/40 border-white/10 focus:border-tactical-accent/50 transition"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ownerName" className="text-secondary font-bold uppercase text-[10px] tracking-widest">Operator/Owner Name</Label>
                    <Input 
                      id="ownerName"
                      placeholder="e.g. Admin User"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                      className="bg-black/40 border-white/10 focus:border-tactical-accent/50 transition"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nodeType" className="text-secondary font-bold uppercase text-[10px] tracking-widest">Operational Environment</Label>
                    <Select 
                      value={formData.nodeType} 
                      onValueChange={(val) => setFormData({...formData, nodeType: val})}
                    >
                      <SelectTrigger className="bg-black/40 border-white/10 focus:border-tactical-accent/50">
                        <SelectValue placeholder="Select Environment" />
                      </SelectTrigger>
                      <SelectContent className="bg-tactical-high border-white/10 text-primary">
                        <SelectItem value="WAREHOUSE" className="focus:bg-tactical-accent/10 focus:text-tactical-accent">
                          <div className="flex items-center gap-2">
                            <Server size={14} /> Warehouse Controller
                          </div>
                        </SelectItem>
                        <SelectItem value="FIELD" className="focus:bg-tactical-accent/10 focus:text-tactical-accent">
                          <div className="flex items-center gap-2">
                            <Leaf size={14} /> Agricultural Field Monitor
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>

                <CardFooter className="pt-4 pb-8">
                  <Button 
                    type="submit" 
                    className="w-full bg-tactical-accent text-black hover:bg-tactical-accent/90 shadow-lg shadow-tactical-accent/5 group font-black uppercase tracking-widest"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin mr-2" />
                    ) : (
                      <ArrowRight size={18} className="mr-2 group-hover:translate-x-1 transition" />
                    )}
                    Generate Security Key
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl z-10"
          >
            <Card className="bg-tactical-surface border-tactical-accent/30 backdrop-blur-xl shadow-2xl overflow-hidden border-b-2 border-r-2 border-tactical-accent/20">
              <CardHeader className="text-center pb-2 pt-10">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-tactical-accent/10 flex items-center justify-center text-tactical-accent border border-tactical-accent/20">
                    <CheckCircle2 size={32} />
                  </div>
                </div>
                <CardTitle className="text-3xl font-black tracking-tight text-white uppercase headline-font">Secure Provisioning Complete</CardTitle>
                <CardDescription className="text-secondary mt-2 uppercase tracking-wide text-[10px] font-bold">
                  Infrastructure records updated. Flash the credentials below to your hardware.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 py-10 px-10">
                <div className="space-y-4">
                  <div className="bg-black/40 p-6 rounded-2xl border border-white/5 group hover:border-tactical-accent/30 transition relative">
                    <Label className="text-[9px] uppercase tracking-widest text-secondary font-black mb-2 block font-mono">Hardware Device ID</Label>
                    <div className="flex items-center justify-between">
                      <code className="text-tactical-accent font-mono text-lg">{result.deviceId}</code>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.deviceId)} className="text-secondary hover:text-tactical-accent">
                        <Copy size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="bg-black/40 p-6 rounded-2xl border border-white/5 group hover:border-tactical-accent/30 transition">
                    <Label className="text-[9px] uppercase tracking-widest text-secondary font-black mb-2 block font-mono">Encrypted API Key</Label>
                    <div className="flex items-center justify-between">
                      <code className="text-tactical-accent font-mono text-lg">{result.apiKey}</code>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.apiKey)} className="text-secondary hover:text-tactical-accent">
                        <Copy size={16} />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-tactical-accent/5 p-4 rounded-xl border border-tactical-accent/20 flex gap-4 items-center">
                  <div className="text-tactical-accent"><FileDown size={24} /></div>
                  <div className="text-[10px] text-secondary leading-relaxed font-bold uppercase tracking-wide">
                    Download the <strong className="text-tactical-accent">Registration Blueprint PDF</strong> for official wiring diagrams, sensor pinouts, and cloud sync instructions.
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-black/40 border-t border-white/5 flex gap-3 p-8">
                <Button 
                  onClick={() => router.push("/")} 
                  variant="outline" 
                  className="flex-1 border-white/10 text-secondary hover:bg-tactical-high hover:text-primary uppercase font-black tracking-widest text-[10px]"
                >
                  Return to Grid
                </Button>
                <Button 
                  onClick={generatePDF} 
                  className="flex-1 bg-white text-black hover:bg-slate-100 font-black uppercase tracking-widest text-[10px]"
                >
                  <FileDown size={18} className="mr-2" />
                  Get Blueprint (PDF)
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
