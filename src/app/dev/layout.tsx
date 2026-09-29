import { notFound } from "next/navigation";

// Developer tools only: every page under /dev is a 404 in production builds.
export default function DevLayout({ children }: LayoutProps<"/dev">) {
  if (process.env.NODE_ENV === "production") notFound();
  return children;
}
