// The visitor's address as the host (Vercel) reports it: the first entry of
// `x-forwarded-for`, else `x-real-ip`, else "unknown". Used as a rate-limit
// key only, held in memory, never stored or logged.
export function clientKey(request: Request): string {
  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}
