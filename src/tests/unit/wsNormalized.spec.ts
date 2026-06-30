import { describe, expect, it } from "vitest";
import {
  OperationType,
  normalizeWsMessage,
  shouldProcess,
} from "../../server/types/wsNormalized";

describe("normalizeWsMessage", () => {
  it("normalizes a typed ConceptScheme event", () => {
    const document = {
      uri: "http://bartoc.org/en/node/ws-normalized-typed-doc",
      modified: "2026-01-01T10:00:00Z",
    };

    const event = normalizeWsMessage({
      objectType: "ConceptScheme",
      id: "http://bartoc.org/en/node/ws-normalized-typed",
      type: OperationType.Update,
      document,
    });

    expect(event).toEqual({
      id: "http://bartoc.org/en/node/ws-normalized-typed",
      op: OperationType.Update,
      doc: document,
      modified: "2026-01-01T10:00:00Z",
      legacy: false,
    });
  });

  it("uses raw id before document uri", () => {
    const event = normalizeWsMessage({
      objectType: "ConceptScheme",
      id: "http://bartoc.org/en/node/ws-normalized-raw-id",
      type: OperationType.Replace,
      document: {
        uri: "http://bartoc.org/en/node/ws-normalized-document-uri",
      },
    });

    expect(event?.id).toBe("http://bartoc.org/en/node/ws-normalized-raw-id");
  });

  it("falls back to document uri when raw id is missing", () => {
    const event = normalizeWsMessage({
      objectType: "ConceptScheme",
      type: OperationType.Create,
      document: {
        uri: "http://bartoc.org/en/node/ws-normalized-fallback-uri",
      },
    });

    expect(event?.id).toBe("http://bartoc.org/en/node/ws-normalized-fallback-uri");
  });

  it("ignores non ConceptScheme events", () => {
    expect(
      normalizeWsMessage({
        objectType: "Concept",
        id: "http://bartoc.org/en/node/ws-normalized-concept",
        type: OperationType.Update,
      }),
    ).toBeNull();
  });
});

describe("shouldProcess", () => {
  it("accepts a fresh typed event", () => {
    const event = normalizeWsMessage({
      objectType: "ConceptScheme",
      id: "http://bartoc.org/en/node/ws-process-typed",
      type: OperationType.Update,
      modified: "2026-01-01T10:00:00Z",
    });

    expect(event).not.toBeNull();
    expect(shouldProcess(event!)).toBe(true);
  });

  it("skips stale legacy events", () => {
    const first = normalizeWsMessage({
      objectType: "ConceptScheme",
      id: "http://bartoc.org/en/node/ws-process-legacy-stale",
      modified: "2026-01-02T10:00:00Z",
    });
    const stale = normalizeWsMessage({
      objectType: "ConceptScheme",
      id: "http://bartoc.org/en/node/ws-process-legacy-stale",
      modified: "2026-01-01T10:00:00Z",
    });

    expect(first).not.toBeNull();
    expect(stale).not.toBeNull();
    expect(first?.legacy).toBe(true);
    expect(stale?.legacy).toBe(true);
    expect(shouldProcess(first!)).toBe(true);
    expect(shouldProcess(stale!)).toBe(false);
  });

  it("skips legacy events after a typed event for the same id", () => {
    const typed = normalizeWsMessage({
      objectType: "ConceptScheme",
      id: "http://bartoc.org/en/node/ws-process-typed-before-legacy",
      type: OperationType.Update,
      modified: "2026-01-01T10:00:00Z",
    });
    const legacy = normalizeWsMessage({
      objectType: "ConceptScheme",
      id: "http://bartoc.org/en/node/ws-process-typed-before-legacy",
      modified: "2026-01-02T10:00:00Z",
    });

    expect(typed).not.toBeNull();
    expect(legacy).not.toBeNull();
    expect(shouldProcess(typed!)).toBe(true);
    expect(shouldProcess(legacy!)).toBe(false);
  });
});
