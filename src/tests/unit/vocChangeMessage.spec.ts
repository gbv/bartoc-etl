import { describe, expect, it } from "vitest";
import { buildVocChangeMessageResult } from "../../server/composables/vocChangeMessage";
import { OperationType } from "../../server/types/wsNormalized";

const RECEIVED_AT = "2026-01-03T10:00:00Z";

describe("buildVocChangeMessageResult", () => {
  it("returns invalid-json for broken JSON", () => {
    const result = buildVocChangeMessageResult("{", RECEIVED_AT);

    expect(result.kind).toBe("invalid-json");
    if (result.kind !== "invalid-json") return;
    expect(result.rawPayload).toBe("{");
    expect(result.error).toContain("SyntaxError");
  });

  it("ignores non ConceptScheme events", () => {
    const result = buildVocChangeMessageResult(
      JSON.stringify({
        objectType: "Concept",
        id: "http://bartoc.org/en/node/voc-change-concept",
        type: OperationType.Update,
      }),
      RECEIVED_AT,
    );

    expect(result).toEqual({ kind: "ignored" });
  });

  it("marks legacy events without enqueueing a payload", () => {
    const result = buildVocChangeMessageResult(
      JSON.stringify({
        objectType: "ConceptScheme",
        id: "http://bartoc.org/en/node/voc-change-legacy",
        modified: "2026-01-03T09:00:00Z",
      }),
      RECEIVED_AT,
    );

    expect(result).toEqual({ kind: "legacy" });
  });

  it("returns a delete payload for delete events", () => {
    const result = buildVocChangeMessageResult(
      JSON.stringify({
        objectType: "ConceptScheme",
        id: "http://bartoc.org/en/node/voc-change-delete",
        type: OperationType.Delete,
        modified: "2026-01-03T09:00:00Z",
      }),
      RECEIVED_AT,
    );

    expect(result.kind).toBe("delete");
    if (result.kind !== "delete") return;
    expect(result.event).toEqual({
      type: OperationType.Delete,
      id: "http://bartoc.org/en/node/voc-change-delete",
      receivedAt: RECEIVED_AT,
      modified: "2026-01-03T09:00:00Z",
      legacy: false,
    });
    expect(result.payload).toEqual({
      operation: OperationType.Delete,
      id: "http://bartoc.org/en/node/voc-change-delete",
      receivedAt: RECEIVED_AT,
    });
  });

  it("returns invalid-document when an upsert event has no usable document", () => {
    const result = buildVocChangeMessageResult(
      JSON.stringify({
        objectType: "ConceptScheme",
        id: "http://bartoc.org/en/node/voc-change-invalid-document",
        type: OperationType.Update,
        modified: "2026-01-03T09:00:00Z",
        document: { prefLabel: { en: "Missing URI" } },
      }),
      RECEIVED_AT,
    );

    expect(result.kind).toBe("invalid-document");
    if (result.kind !== "invalid-document") return;
    expect(result.event.id).toBe("http://bartoc.org/en/node/voc-change-invalid-document");
  });

  it("returns an upsert payload for a valid update event", () => {
    const result = buildVocChangeMessageResult(
      JSON.stringify({
        objectType: "ConceptScheme",
        id: "http://bartoc.org/en/node/voc-change-upsert",
        type: OperationType.Update,
        modified: "2026-01-03T09:00:00Z",
        document: {
          uri: "http://bartoc.org/en/node/voc-change-upsert",
          prefLabel: { en: "Vocabulary Change Upsert" },
        },
      }),
      RECEIVED_AT,
    );

    expect(result.kind).toBe("upsert");
    if (result.kind !== "upsert") return;
    expect(result.event.type).toBe(OperationType.Update);
    expect(result.payload).toMatchObject({
      operation: OperationType.Update,
      id: "http://bartoc.org/en/node/voc-change-upsert",
      receivedAt: RECEIVED_AT,
    });
    expect(result.payload.document).toMatchObject({
      uri: "http://bartoc.org/en/node/voc-change-upsert",
      prefLabel: { en: "Vocabulary Change Upsert" },
    });
  });

  it("ignores stale events for the same id", () => {
    const id = "http://bartoc.org/en/node/voc-change-stale";
    const fresh = buildVocChangeMessageResult(
      JSON.stringify({
        objectType: "ConceptScheme",
        id,
        type: OperationType.Update,
        modified: "2026-01-03T09:00:00Z",
        document: { uri: id },
      }),
      RECEIVED_AT,
    );
    const stale = buildVocChangeMessageResult(
      JSON.stringify({
        objectType: "ConceptScheme",
        id,
        type: OperationType.Update,
        modified: "2026-01-02T09:00:00Z",
        document: { uri: id },
      }),
      RECEIVED_AT,
    );

    expect(fresh.kind).toBe("upsert");
    expect(stale).toEqual({ kind: "ignored" });
  });
});
