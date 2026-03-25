import type { Metadata } from "next";
import { ThemeProvider } from "@/frontend/components/ThemeProvider";
import { ThemeToggle } from "@/frontend/components/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skillful — Master Your Game",
  description:
    "Track and improve your skills with an interactive skill tree. Level up your fundamentals across basketball, cooking, music, and more.",
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-bg-primary text-text-primary antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {/* Top navigation bar */}
          <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg-primary/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
              <a href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                    <line x1="12" y1="22" x2="12" y2="15.5" />
                    <polyline points="22 8.5 12 15.5 2 8.5" />
                  </svg>
                </div>
                <h1
                  className="text-xl font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <span className="text-gold">Skill</span>ful
                </h1>
              </a>

              <div className="flex items-center gap-4">
                <a
                  href="/login"
                  className="flex h-9 w-25 items-center justify-center rounded-lg bg-bg-card text-text-secondary transition-colors hover:bg-bg-hover hover:text-text-primary"
                  aria-label="Login"
                >
                  Login
                </a>
                <ThemeToggle />
                <div className="hidden items-center gap-2 rounded-full bg-bg-card px-4 py-2 sm:flex">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm text-text-secondary">Player One</span>
                </div>
              </div>
            </div>
          </nav>

          {/* Main content */}
          <main className="pt-16">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
