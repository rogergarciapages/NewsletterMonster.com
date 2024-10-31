import type { Metadata } from "next";
import AppNavbar from "./components/app-navbar";
import Footer from "./components/footer";
import Providers from "./components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js Starter App",
  description: "A basic starter for next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📦</text></svg>"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background font-sans antialiased">
        <Providers>
          <div className="sticky top-0 z-50">
            <AppNavbar />
          </div>
          <div className="flex-grow flex flex-col min-h-[calc(100vh-64px)]">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}