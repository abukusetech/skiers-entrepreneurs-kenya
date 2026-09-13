import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://skiers.co.ke";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SKIERS ENTREPRENEURS KENYA | Find Talent, Work and Businesses",
    template: "%s | SKIERS ENTREPRENEURS KENYA",
  },
  description:
    "Kenya's trusted marketplace connecting employers, freelancers, and local businesses. Find talent, hire workers, or offer your skills, from digital work to physical services.",
  keywords: [
    "Kenya marketplace",
    "hire freelancers Kenya",
    "find jobs Kenya",
    "services Nairobi",
    "M-Pesa payments",
    "local businesses Kenya",
  ],
  authors: [{ name: "SKIERS ENTREPRENEURS KENYA" }],
  creator: "SKIERS ENTREPRENEURS KENYA",
  publisher: "SKIERS ENTREPRENEURS KENYA",
  applicationName: "SKIERS ENTREPRENEURS KENYA",
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: siteUrl,
    siteName: "SKIERS ENTREPRENEURS KENYA",
    title: "SKIERS ENTREPRENEURS KENYA | Find Talent, Work and Businesses",
    description:
      "Find talent, work, and businesses across Kenya. Pay securely with M-Pesa.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SKIERS ENTREPRENEURS KENYA | Find Talent, Work and Businesses",
    description:
      "Find talent, work, and businesses across Kenya. Pay securely with M-Pesa.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b3d91",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
