import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Olly – Find det billigere",
  description: "Sammenlign produktpriser og find gode tilbud med Olly.",
  applicationName: "Olly",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Olly" }
};
export const viewport: Viewport = {
  themeColor: "#ffad24",
  width: "device-width",
  initialScale: 1
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="da"><body>{children}</body></html>;
}
