// solr.ts - Handles Solr initialization and connection state
import config from "../conf/conf";
import { SolrClient } from "./SolrClient";
import { PingResponse } from "../types/solr";
import { SolrPingError } from "../errors/errors";

let initialized = false;
const solr = new SolrClient(config.solr.version);

export async function connectToSolr(): Promise<void> {
  try {
    const pingOk = await solr.collectionOperation
      .preparePing("bartoc")
      .execute<PingResponse>();

    if (!pingOk) {
      config.warn?.(
        "⚠️ Solr server is reachable but not healthy (ping failed). Skipping initialization.",
      );
      throw new Error() as SolrPingError;
    }

    config.log?.("✅ Connected to Solr and ping successful.");

    //TODO List available cores?

    //TODO Optional: Check configsets (advanced)

    //TODO When index data?

    initialized = true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    config.error?.("❌ Failed to initialize Solr:", message);
  }
}

export function isSolrReady(): boolean {
  return initialized;
}
