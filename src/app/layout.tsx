import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "TAPAM CARD", description: "Votre carte de visite. Votre identité. Votre contrôle." };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr"><body>{children}</body></html>; }
