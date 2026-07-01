import { describe, expect, it } from "vitest";
import type { ConceptSchemeDocument } from "../../server/types/jskos";
import type { SolrJobPayload } from "../../server/types/solr";
import {
  bufferVocChangePayload,
  type VocChangePayloadBuffer,
} from "../../server/composables/vocChangeBuffer";
import { OperationType } from "../../server/types/wsNormalized";

const RECEIVED_AT = "2026-01-03T10:00:00Z";

const document: ConceptSchemeDocument = {
  "@context": "https://gbv.github.io/jskos/context.json",
  uri: "http://bartoc.org/en/node/voc-change-buffer",
  prefLabel: { en: "Vocabulary Change Buffer" },
  created: "2026-01-01T10:00:00Z",
  modified: "2026-01-02T10:00:00Z",
  type: ["http://www.w3.org/2004/02/skos/core#ConceptScheme"],
};

describe("bufferVocChangePayload", () => {
  it("keeps only the latest payload for the same id", () => {
    const buffer: VocChangePayloadBuffer = new Map();
    const upsert: SolrJobPayload = {
      operation: OperationType.Update,
      id: document.uri,
      receivedAt: RECEIVED_AT,
      document,
    };
    const deletion: SolrJobPayload = {
      operation: OperationType.Delete,
      id: document.uri,
      receivedAt: RECEIVED_AT,
    };

    bufferVocChangePayload(buffer, upsert);
    bufferVocChangePayload(buffer, deletion);

    expect(Array.from(buffer.values())).toEqual([deletion]);
  });

  it("keeps payloads for different ids", () => {
    const buffer: VocChangePayloadBuffer = new Map();
    const first: SolrJobPayload = {
      operation: OperationType.Delete,
      id: "http://bartoc.org/en/node/voc-change-buffer-first",
      receivedAt: RECEIVED_AT,
    };
    const second: SolrJobPayload = {
      operation: OperationType.Delete,
      id: "http://bartoc.org/en/node/voc-change-buffer-second",
      receivedAt: RECEIVED_AT,
    };

    bufferVocChangePayload(buffer, first);
    bufferVocChangePayload(buffer, second);

    expect(Array.from(buffer.values())).toEqual([first, second]);
  });
});
