import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/ui/nav-bar";
import Footer from "@/components/ui/footer";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "WellFed",
};

const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={fredoka.className}>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header>
            <Navbar />
          </header>
          <main className="mx-auto w-full max-w-4xl p-6">{children}</main>

          <Footer />
          <Toaster
            toastOptions={{
              style: {
                background: "hsl(var(--muted))",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
