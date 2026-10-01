import type { MetadataRoute } from "next";
import {
  APP_DESCRIPTION,
  APP_ICONS,
  APP_NAME,
  BACKGROUND_COLOR,
  THEME_COLOR,
} from "@/lib/brand";

// Installable, not offline: there is no service worker, so the app opens from
// the Home Screen and loads over the network like a tab does.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: APP_NAME,
    short_name: APP_NAME,
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
