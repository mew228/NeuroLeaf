import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { ToastProvider } from "../context/ToastContext";
import LayoutWrapper from "../components/common/LayoutWrapper";
import { MotionConfig } from "framer-motion";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "NeuroLeaf | AI Mental Health Companion",
  description: "Your safe space for emotional tracking, journaling, and AI-powered self-reflection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased selection:bg-emerald-500 selection:text-white`}>
        <AuthProvider>
          <ToastProvider>
            <ThemeProvider>
              <MotionConfig reducedMotion="user">
                <LayoutWrapper>
                  {children}
                </LayoutWrapper>
              </MotionConfig>
            </ThemeProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
