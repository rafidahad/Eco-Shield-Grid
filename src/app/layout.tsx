import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { TacticalLayoutWrapper } from "@/components/layout/TacticalLayout";

export const metadata: Metadata = {
  title: "Eco-Shield Grid | Command Center",
  description:
    "Real-time IoT monitoring dashboard for the Smart Green Village prototype. Monitor warehouse climate and field environment sensors.",
  keywords: ["IoT", "dashboard", "ESP32", "smart village", "monitoring"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-tactical-accent selection:text-black">
        <TacticalLayoutWrapper>
          {children}
        </TacticalLayoutWrapper>
        <Toaster />
      </body>
    </html>
  );
}
