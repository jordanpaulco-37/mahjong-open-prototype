import type { Metadata } from "next";
import { Bodoni_Moda, Quicksand } from "next/font/google";
import "./globals.css";

const bodoniModa = Bodoni_Moda({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display-loaded",
  display: "swap",
});

const quicksand = Quicksand({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body-loaded",
  display: "swap",
});

// Search-engine visibility is OFF by default (pre-launch safe default).
// The site stays noindex until SITE_INDEXABLE is explicitly set to "true"
// in the environment (set it in Vercel at launch, then redeploy).
// The link still works for anyone you share it with — noindex only keeps
// the site out of Google/Bing search results.
const isIndexable = process.env.SITE_INDEXABLE === "true";

export const metadata: Metadata = {
  title: "The Mahjong Open",
  description:
    "A city-based Mahjong Game League for women who love the game. Join your city's series.",
  robots: isIndexable ? undefined : { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bodoniModa.variable} ${quicksand.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
