import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Francesco Monticone | Computer Science & Engineering",
  description:
    "Portfolio of Francesco Monticone — MSc Computer Science & Engineering student at Politecnico di Milano. AI, cybersecurity, software engineering, systems.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
