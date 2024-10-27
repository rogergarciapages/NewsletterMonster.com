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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📦</text></svg>"
        />
      </head>
      <body className="w-full m-auto antialiased selection:bg-torch-700/80 selection:text-space-950 dark:selection:bg-torch-900/10 dark:selection:text-torch-600">
        <Providers>
          <div className="sticky top-0 z-50">
            <AppNavbar />
          </div>
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
