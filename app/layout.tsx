import type { Metadata } from "next";
import { Cormorant_Garamond, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { MilestoneBlockOverlay } from "@/components/MilestoneBlockOverlay";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TruKode — You came into this world without a manual. Consider this yours.",
  description:
    "TruKode decodes the spiritual, psychological, behavioral, and purposeful dimensions of you into one cohesive Blueprint. Human Decode™ · The Blueprint System™",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${hanken.variable}`}>
      <body>
        {children}
        <MilestoneBlockOverlay />
      </body>
    </html>
  );
}
