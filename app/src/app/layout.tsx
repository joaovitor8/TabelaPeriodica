import type { Metadata, Viewport } from "next";
import { Inter, Cinzel, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import Stars from "@/src/components/Stars";
import { Providers } from "@/src/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Forja Estelar | Tabela Periódica Cósmica",
    template: "%s · Forja Estelar",
  },
  description:
    "Tabela periódica reescrita como arqueologia do cosmos — de onde vem cada átomo do seu corpo. Uma extensão de Universe.",
  applicationName: "Forja Estelar",
  authors: [{ name: "João Vitor" }],
  keywords: [
    "tabela periódica", "elementos químicos", "origem cósmica",
    "nucleossíntese", "supernova", "Big Bang", "estrelas",
    "abundância", "biologia", "Universe",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Forja Estelar",
    title: "Forja Estelar · Tabela Periódica Cósmica",
    description:
      "De onde vem cada átomo? Big Bang, fusão estelar, supernovas, fusão de estrelas de nêutrons — a arqueologia cósmica dos 118 elementos.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${inter.variable} ${cinzel.variable} ${mono.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground bg-vignette`}
      >
        <Providers>
          <div aria-hidden className="fixed inset-0 -z-10 bg-grid pointer-events-none opacity-60" />
          <Stars className="fixed inset-0 -z-10" quantity={150} />
          <main className="grow">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
