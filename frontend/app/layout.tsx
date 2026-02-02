import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { ToastProvider } from "../context/ToastContext";
import { QueryProvider } from "../context/QueryProvider";
import LayoutWrapper from "../components/common/LayoutWrapper";
import { MotionConfig } from "framer-motion";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "NeuroLeaf | AI Mental Health Companion",
  description: "Your safe space for emotional tracking, journaling, and AI-powered self-reflection.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NeuroLeaf",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.className} antialiased selection:bg-emerald-500 selection:text-white`}>
        <QueryProvider>
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
        </QueryProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('[App] Service Worker registered'))
                    .catch(err => console.error('[App] SW registration failed:', err));
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

