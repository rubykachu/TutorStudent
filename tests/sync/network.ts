import { type Harness, request } from "../api/sync-helpers";

// A fake `fetch` for the sync client, answered by the real sync service over
// the memory store, so a device talks to the same code the app serves. Tests
// switch the network off, run code between a request and its answer, or drop
// an answer after the server has stored the write.

export type Call = { method: "GET" | "PUT"; query: string };

export type Network = {
  fetch: (input: string, init?: RequestInit) => Promise<Response>;
  calls: Call[];
  online: boolean;
  // Cookie sent with every request; null sends none.
  cookie: string | undefined | null;
  // Answers a request itself instead of the server (a doc a newer server
  // wrote, say); return undefined to let the server answer.
  respond?: (call: Call) => Response | undefined;
  // Runs before the server handles a request.
  beforeRequest?: (call: Call) => Promise<void> | void;
  // Runs after the server handled a request, before the client sees the
  // answer; return "lose" to drop the answer (the write stays stored).
  afterRequest?: (call: Call) => "lose" | undefined;
  puts: (kind?: "profile" | "child" | "history") => number;
};

export function network(h: Harness): Network {
  const net: Network = {
    calls: [],
    online: true,
    cookie: undefined,
    puts(kind) {
      return net.calls.filter(
        (c) =>
          c.method === "PUT" &&
          (kind === undefined ||
            (kind === "profile"
              ? c.query.startsWith("?doc=profile")
              : kind === "history"
                ? c.query.includes("month=")
                : c.query.startsWith("?child=") &&
                  !c.query.includes("month="))),
      ).length;
    },
    async fetch(input, init) {
      if (!net.online) throw new TypeError("Failed to fetch");
      const query = input.slice(input.indexOf("?"));
      const method = (init?.method ?? "GET") as "GET" | "PUT";
      const call: Call = { method, query };
      net.calls.push(call);
      const canned = net.respond?.(call);
      if (canned) return canned;
      await net.beforeRequest?.(call);
      const req = await request(method, query, {
        cookie: net.cookie,
        ...(init?.body === undefined ? {} : { body: init.body as string }),
      });
      const response =
        method === "GET" ? await h.service.get(req) : await h.service.put(req);
      if (net.afterRequest?.(call) === "lose") {
        throw new TypeError("Failed to fetch");
      }
      return response;
    },
  };
  return net;
}
