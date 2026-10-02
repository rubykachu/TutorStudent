import { createMemoryStore } from "@/sync/store/memory";
import { runStoreContract } from "./contract";

runStoreContract("memory", (options) => createMemoryStore(options));
