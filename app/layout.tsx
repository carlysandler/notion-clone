import { Provider } from "react-redux";
import { Toaster } from "sonner"
import StoreProvider from "./StoreProvider"
import { ConvexClientProvider } from "@/components/providers/convex-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Inter } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "New Notion",
  description: "The connected workspace--work smarter, not harder.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo.svg",
        href: "/logo.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo-dark.svg",
        href: "/logo-dark.svg",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexClientProvider>
          <StoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              storageKey="notion-theme"
            >
              <Toaster position="bottom-center" />
              {children}
            </ThemeProvider>
          </StoreProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
