import type { MetadataRoute } from "next";
import {
  APP_DESCRIPTION,
  APP_ICONS,
  APP_NAME,
  APP_SHORT_NAME,
  BACKGROUND_COLOR,
  THEME_COLOR,
} from "@/lib/brand";

// Installable. The manifest names no service worker: `src/offline/register.tsx`
// registers it from the app's screens, so the app also opens from the Home
// Screen with no network.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: APP_NAME,
    short_name: APP_SHORT_NAME,
    description: APP_DESCRIPTION,
    lang: "vi",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: BACKGROUND_COLOR,
    theme_color: THEME_COLOR,
    icons: APP_ICONS.map(({ path, size, purpose }) => ({
      src: path,
      sizes: `${size}x${size}`,
      type: "image/png",
      purpose,
    })),
  };
}
