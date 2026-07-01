import type { SolrJobPayload } from "../types/solr";

export type VocChangeQueueJob = {
  name: SolrJobPayload["operation"];
  data: SolrJobPayload;
  opts: {
    removeOnComplete: false;
    removeOnFail: false;
  };
};

/**
 * Builds BullMQ addBulk() jobs from Solr payloads.
 *
 * One payload becomes one queue job. The worker reads the same payload later.
 */
export function buildVocChangeQueueJobs(
  payloads: SolrJobPayload[],
): VocChangeQueueJob[] {
  return payloads.map((payload) => ({
    name: payload.operation,
    data: payload,
    opts: { removeOnComplete: false, removeOnFail: false },
  }));
}
