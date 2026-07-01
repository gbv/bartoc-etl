import { describe, expect, it } from "vitest";
import type { ConceptSchemeDocument } from "../../server/types/jskos";
import type { SolrJobPayload } from "../../server/types/solr";
import { buildVocChangeQueueJobs } from "../../server/composables/vocChangeQueueJobs";
import { OperationType } from "../../server/types/wsNormalized";

const RECEIVED_AT = "2026-01-03T10:00:00Z";

const document: ConceptSchemeDocument = {
  "@context": "https://gbv.github.io/jskos/context.json",
  uri: "http://bartoc.org/en/node/voc-change-queue-upsert",
  prefLabel: { en: "Vocabulary Change Queue Upsert" },
  created: "2026-01-01T10:00:00Z",
  modified: "2026-01-02T10:00:00Z",
  type: ["http://www.w3.org/2004/02/skos/core#ConceptScheme"],
};

describe("buildVocChangeQueueJobs", () => {
  it("builds addBulk jobs for upsert and delete payloads", () => {
    const upsert: SolrJobPayload = {
      operation: OperationType.Update,
      id: document.uri,
      receivedAt: RECEIVED_AT,
      document,
    };
    const deletion: SolrJobPayload = {
      operation: OperationType.Delete,
      id: "http://bartoc.org/en/node/voc-change-queue-delete",
      receivedAt: RECEIVED_AT,
    };

    const jobs = buildVocChangeQueueJobs([upsert, deletion]);

    expect(jobs).toEqual([
      {
        name: OperationType.Update,
        data: upsert,
        opts: { removeOnComplete: false, removeOnFail: false },
      },
      {
        name: OperationType.Delete,
        data: deletion,
        opts: { removeOnComplete: false, removeOnFail: false },
      },
    ]);
  });
});
