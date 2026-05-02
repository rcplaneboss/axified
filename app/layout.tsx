import type { Metadata } from "next";
import { IBM_Plex_Serif, Mona_Sans, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const ibmPlexSeriff = IBM_Plex_Serif({
  variable: "--font-ibm-plex-serif",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  subsets: ["latin"],
});

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bookified",
  description: "Transform your books into interactive AI conversations. Upload PDFs, and chat with your book using voice.",
};

/**
 * Application root layout that provides global HTML structure, fonts, and top-level providers.
 *
 * Renders the HTML and body elements with configured font CSS variables, wraps page content with
 * the authentication provider, includes the global navigation bar, and mounts the global toast container.
 *
 * @param children - Page content to be rendered inside the layout
 * @returns The root HTML/Body React element containing providers, navigation, and children
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", ibmPlexSeriff.variable, monaSans.variable, "font-sans", geist.variable)}
    >
      <body className="relative">
        <ClerkProvider>
          <Navbar />
          {children}
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}
