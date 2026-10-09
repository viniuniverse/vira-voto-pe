import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO + pré-visualização ao compartilhar o link (WhatsApp, Instagram, etc.)
export const metadata: Metadata = {
  title: "VIRA VOTO PE | Painel de Mobilização",
  description:
    "Descubra os locais estratégicos do seu bairro em Pernambuco para panfletar, colar lambes e conversar com a população.",
  openGraph: {
    title: "VIRA VOTO PE | Painel de Mobilização",
    description:
      "Pesquise seu bairro e veja no mapa onde agir primeiro em Pernambuco.",
    locale: "pt_BR",
    type: "website",
  },
};

// Viewport mobile: largura do dispositivo + cor da barra do navegador no celular
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#b91c1c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
