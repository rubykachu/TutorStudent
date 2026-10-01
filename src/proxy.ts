import { type NextRequest, NextResponse } from "next/server";
import { readAccessConfig } from "@/access/env";
import { decideAccess } from "@/access/gate";
import { ACCESS_COOKIE_NAME } from "@/lib/config";

// Every page, API call and file of the app needs the cookie that
// `/api/session` sets once a family code is entered; without it a visitor
// is sent to `/unlock`. The rules live in `src/access/gate.ts`.
export async function proxy(request: NextRequest) {
  const config = readAccessConfig();
  const decision = await decideAccess(
    {
      pathname: request.nextUrl.pathname,
      search: request.nextUrl.search,
      token: request.cookies.get(ACCESS_COOKIE_NAME)?.value,
    },
    config,
  );
  switch (decision.kind) {
    case "allow":
      return NextResponse.next();
    case "redirect":
      return NextResponse.redirect(new URL(decision.to, request.url));
    case "deny":
      return new NextResponse(null, { status: 401 });
    case "unavailable":
      // The reason names a setting, so it goes to the log, not to a visitor.
      console.error(`family-code gate is closed: ${decision.reason}`);
      return new NextResponse(
        "Ứng dụng chưa sẵn sàng. Bạn nhờ người quản lý kiểm tra lại nhé.",
        {
          status: 503,
          headers: { "content-type": "text/plain; charset=utf-8" },
        },
      );
  }
}

export const config = {
  // Next's own build output carries no family data and has no cookie to check
  // when a font or script loads before the page.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
