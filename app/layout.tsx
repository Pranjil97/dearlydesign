import type { Metadata } from "next";
import localFont from "next/font/local";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { AppProviders } from "@/components/providers";
import { SITE } from "@/lib/constants/site";
import "./globals.css";

/** Premium invitation script — local Allura-Regular.ttf */
const allura = localFont({
  src: "../public/fonts/Allura-Regular.ttf",
  variable: "--font-allura",
  weight: "400",
  style: "normal",
  display: "swap",
});

/** Elegant serif for longer readable invitation copy */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/** Clean sans for labels, forms, and UI */
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE.name,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${allura.variable} ${cormorant.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-body">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
