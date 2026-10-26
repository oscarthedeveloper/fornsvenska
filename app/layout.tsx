import type { Metadata } from "next";
import { Newsreader, Martian_Mono } from "next/font/google";
import "./globals.css";
import "./start.css";
import AdminProvider from "@/components/admin/AdminContext";
import AdminBar from "@/components/admin/AdminBar";
import { SpeedInsights } from "@vercel/speed-insights/next";

/* Endast två familjer: hög-kontrast antikva till rubriker och siffror,
   monospace till allt annat. Ingen grotesk. */
const display = Newsreader({
  subsets: ["latin"],
  /* 600 finns bara för **fet** i brödtexten — utan den skulle webbläsaren
     rita en konstgjord fetstil som förstör antikvans former. */
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const mono = Martian_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.fornsvenska.se"),
  title: {
    default: "Fornsvenska – texter, ordbok och grammatik | Fornsvenska.se",
    template: "%s | Fornsvenska.se",
  },
  description:
    "Språkhistorisk studieplattform för fornsvenska. Källkritiska textutgåvor, Söderwalls ordbok och systematisk grammatik med historiska språkprov.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Fornsvenska – texter, ordbok och grammatik | Fornsvenska.se",
    description:
      "Språkhistorisk studieplattform för fornsvenska. Källkritiska textutgåvor, Söderwalls ordbok och systematisk grammatik med historiska språkprov.",
    url: "https://www.fornsvenska.se",
    siteName: "Fornsvenska.se",
    locale: "sv_SE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" className={`${display.variable} ${mono.variable}`}>
      <head>
        {/* Medeltidsrunorna saknas i de flesta systemtypsnitt — utan detta
            renderas glyferna som tofu. Appliceras via klassen .rune. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Runic&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AdminProvider>
          {children}
          <AdminBar />
        </AdminProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
