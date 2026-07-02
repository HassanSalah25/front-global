import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { LanguageProvider } from "./components/LanguageContext";
import AppShell from "./components/AppShell";

export const metadata: Metadata = {
  title: "Untold Agency | Premium Advertising & Marketing Agency",
  description: "وكالة دعاية وإعلان متخصصة في تقديم حلول تسويقية مبتكرة. Professional marketing and advertising agency delivering measurable results.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/css/flag-icons.min.css"
        />
      </head>
      <body suppressHydrationWarning>
        <LanguageProvider>
          <AppShell>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </AppShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
