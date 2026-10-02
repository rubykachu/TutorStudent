// True when the request names its own host in `Origin`. Browsers send `Origin`
// on every non-GET fetch, same-origin ones included, so a missing or foreign
// one is refused.
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}
