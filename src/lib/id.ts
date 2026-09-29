const ID_BYTES = 16;

// The built-in UUID helper exists only in secure contexts (https/localhost);
// the app is also served over plain http on the LAN, where getRandomValues works.
export function newId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(ID_BYTES));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}
