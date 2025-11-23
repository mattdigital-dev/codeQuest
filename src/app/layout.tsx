import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Chivo_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const mono = Chivo_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "CodeQuest · Îles Blockly en 3D",
  description:
    "CodeQuest est un mini-jeu 3D inspiré de Monument Valley pour apprendre la logique de programmation via Blockly et des défis progressifs.",
  openGraph: {
    title: "CodeQuest",
    description:
      "Progressez à travers six îlots flottants et maîtrisez les bases du code dans un monde méditatif.",
    type: "website",
    url: "https://codequest.local",
  },
};

export const viewport: Viewport = {
  themeColor: "#f6e7c1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${display.variable} ${mono.variable} bg-cloud antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
