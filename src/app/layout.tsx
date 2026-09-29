import type { Metadata, Viewport } from "next";
import { Baloo_2, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const headingFont = Baloo_2({
  variable: "--font-baloo-2",
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700"],
  display: "swap",
});

const bodyFont = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tutor",
  // Private family app: keep it out of search engines.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
