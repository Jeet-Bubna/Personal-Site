import type { Metadata } from "next";
import { Arizonia, Barrio} from "next/font/google";
import "./globals.css";

const greatVibes = Arizonia({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
});

const barrio = Barrio({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-barrio",
});

export const metadata: Metadata = {
  title: "Jeet Bubna",
  description: "Jeet Bubna personal page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${greatVibes.variable} ${barrio.variable}`}>
        {children}
      </body>
    </html>
  );
}