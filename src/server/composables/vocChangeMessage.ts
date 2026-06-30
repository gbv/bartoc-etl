import type { SolrUpsertPayload } from "../types/solr";
import {
  OperationType,
  normalizeWsMessage,
  shouldProcess,
  toOperationType,
} from "../types/wsNormalized";
import { coerceConceptSchemeDocument } from "../utils/coerceConceptScheme";

export type VocChangeEventInfo = {
  type: string;
  id: string;
  receivedAt: string;
  modified?: string;
  legacy: boolean;
};

export type VocChangeMessageResult =
  | { kind: "invalid-json"; error: string; rawPayload: string }
  | { kind: "ignored" }
  | { kind: "legacy" }
  | { kind: "delete"; event: VocChangeEventInfo }
  | { kind: "invalid-document"; event: VocChangeEventInfo }
  | {
      kind: "upsert";
      event: VocChangeEventInfo;
      payload: SolrUpsertPayload;
    };

function formatUnknownError(err: unknown) {
  if (err instanceof Error) return err.stack ?? err.message;
  if (typeof err === "string") return err;
  return JSON.stringify(err);
}

export function buildVocChangeMessageResult(
  text: string,
  receivedAt: string,
): VocChangeMessageResult {
  let raw: unknown;

  try {
    raw = JSON.parse(text);
  } catch (err: unknown) {
    return {
      kind: "invalid-json",
      error: formatUnknownError(err),
      rawPayload: text,
    };
  }

  const ev = normalizeWsMessage(raw);
  if (!ev) return { kind: "ignored" };

  if (!ev.op) return { kind: "legacy" };

  if (!shouldProcess(ev)) return { kind: "ignored" };

  const op = toOperationType(ev.op);
  const event: VocChangeEventInfo = {
    type: op,
    id: ev.id,
    receivedAt,
    modified: ev.modified,
    legacy: ev.legacy,
  };

  if (op === OperationType.Delete) {
    return { kind: "delete", event };
  }

  const document = coerceConceptSchemeDocument(ev.doc);
  if (!document) {
    return { kind: "invalid-document", event };
  }

  return {
    kind: "upsert",
    event,
    payload: {
      operation: op,
      document,
      id: ev.id,
      receivedAt,
    },
  };
}
