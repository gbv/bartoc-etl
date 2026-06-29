import fs from "node:fs/promises";
import path from "path";
import config from "../conf/conf";
import { ConceptZodType, conceptZodSchema } from "../validation/concept";
import { NkosNotInitializedError } from "../errors/errors";

const NKOS_TYPES_ARTIFACT = path.join(
  process.cwd(),
  config.DATA_DIR,
  "artifacts",
  "current",
  "nkos-type-definitions.json",
);

const NKOS_TYPES_META = path.join(
  process.cwd(),
  config.DATA_DIR,
  "artifacts",
  "nkosTypes.last.json",
);

let cache: ConceptZodType[] | null = null;

async function loadJson(filePath: string): Promise<unknown> {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function loadNkosTypesSnapshot(): Promise<unknown> {
  const meta = await loadJson(NKOS_TYPES_META) as { snapshotPath?: string };
  if (!meta.snapshotPath) {
    throw new Error("NKOS type snapshot metadata has no snapshotPath");
  }
  return loadJson(meta.snapshotPath);
}

function asConcepts(data: unknown): ConceptZodType[] {
  const values = Array.isArray(data)
    ? data
    : Object.entries(data as Record<string, unknown>).map(([uri, concept]) => ({
      uri,
      ...(concept as Record<string, unknown>),
    }));

  return values
    .map(concept => conceptZodSchema.safeParse(concept))
    .filter(result => result.success)
    .map(result => result.data);
}

/**
 * Loads and caches NKOS concepts.
 * Subsequent calls return the in‐memory array.
 */
export async function loadNkosConcepts(): Promise<ConceptZodType[]> {
  if (!cache) {
    try {
      cache = asConcepts(await loadJson(NKOS_TYPES_ARTIFACT));
    } catch {
      try {
        cache = asConcepts(await loadNkosTypesSnapshot());
      } catch (error) {
        config.warn?.(
          `Could not load NKOS type concepts: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        cache = [];
      }
    }
  }
  return cache;
}

/**
 * Returns the already‐loaded concepts
 */
export function getNkosConcepts(): ConceptZodType[] {
  if (!cache) {
    throw new NkosNotInitializedError();
  }
  return cache;
}
