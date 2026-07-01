import type { SolrJobPayload } from "../types/solr";

export type VocChangePayloadBuffer = Map<string, SolrJobPayload>;

/**
 * Stores the latest payload for one vocabulary id.
 *
 * A later payload with the same id replaces the older one.
 */
export function bufferVocChangePayload(
  buffer: VocChangePayloadBuffer,
  payload: SolrJobPayload,
): void {
  buffer.set(payload.id, payload);
}
