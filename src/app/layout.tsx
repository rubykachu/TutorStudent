import type { Metadata, Viewport } from "next";
import { Baloo_2, Be_Vietnam_Pro } from "next/font/google";
import {
  APP_DESCRIPTION,
  APP_NAME,
  APP_SHORT_NAME,
  APPLE_TOUCH_ICON,
  FAVICON_SVG_PATH,
  SHARE_DESCRIPTION,
  SHARE_IMAGE_TAG,
  SHARE_TITLE,
  SITE_URL,
  THEME_COLOR,
  TITLE_TEMPLATE,
} from "@/lib/brand";
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

// Set here, in the root layout, so that every page carries it, `/unlock`
// included: a chat app's crawler has no cookie and is sent to `/unlock`, so
// that page's tags are the ones that make the link preview.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: APP_NAME, template: TITLE_TEMPLATE },
  description: APP_DESCRIPTION,
  // `src/app/favicon.ico` is the tab icon for browsers that ask for it; this
  // is the sharper one for those that take an SVG.
  icons: {
    icon: { url: FAVICON_SVG_PATH, type: "image/svg+xml" },
    // iOS ignores the manifest's icons and takes this one for the Home Screen.
    apple: {
      url: APPLE_TOUCH_ICON.path,
      sizes: `${APPLE_TOUCH_ICON.size}x${APPLE_TOUCH_ICON.size}`,
    },
  },
  // iOS launches it standalone with the light status bar the page needs.
  appleWebApp: {
    capable: true,
    title: APP_SHORT_NAME,
    statusBarStyle: "default",
  },
  // Next writes only the unprefixed `mobile-web-app-capable`; iOS Safari
  // before 17 reads the prefixed tag.
  other: { "apple-mobile-web-app-capable": "yes" },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    locale: "vi_VN",
    url: SITE_URL,
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    images: [SHARE_IMAGE_TAG],
  },
  twitter: {
    card: "summary_large_image",
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    images: [SHARE_IMAGE_TAG],
  },
  // Private family app: keep it out of search engines. A link preview still
  // works with noindex.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: THEME_COLOR,
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
