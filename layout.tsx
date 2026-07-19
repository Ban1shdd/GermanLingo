import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeutschLingo - Learn German",
  description: "Learn German the fun way with DeutschLingo!",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DeutschLingo",
    startupImage: "/apple-touch-icon.png",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f172a",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-dark-bg text-dark-text antialiased">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
