import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Mona_Sans } from "next/font/google";

const monaSans = Mona_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-monasans",
});

export const metadata: Metadata = {
  title: "Open League",
  description: "Open League",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${monaSans.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
