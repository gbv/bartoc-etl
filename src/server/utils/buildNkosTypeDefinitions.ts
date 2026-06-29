import fs from "node:fs/promises";
import path from "node:path";
import { ConceptDocument } from "../types/jskos";

export interface NkosTypeDefinition {
  prefLabel: Record<string, string>
  definition?: Record<string, string[]>
  scopeNote?: Record<string, string[]>
}

export type NkosTypeDefinitionsMap = Record<string, NkosTypeDefinition>;

async function loadNkosTypeConcepts(filePath: string): Promise<ConceptDocument[]> {
  const text = await fs.readFile(filePath, "utf8");
  const data = JSON.parse(text);
  if (!Array.isArray(data)) {
    throw new Error("Invalid NKOS type concepts JSON");
  }
  return data as ConceptDocument[];
}

export async function buildNkosTypeDefinitions(
  snapshotPath: string,
  outDir: string,
): Promise<NkosTypeDefinitionsMap> {
  await fs.mkdir(outDir, { recursive: true });
  const finalPath = path.join(outDir, "nkos-type-definitions.json");
  const tmpPath = finalPath + ".tmp";

  const concepts = await loadNkosTypeConcepts(snapshotPath);
  const map: NkosTypeDefinitionsMap = {};

  concepts.forEach(concept => {
    map[concept.uri] = {
      prefLabel: concept.prefLabel ?? {},
      ...(concept.definition ? { definition: concept.definition } : {}),
      ...(concept.scopeNote ? { scopeNote: concept.scopeNote } : {}),
    };
  });

  await fs.writeFile(tmpPath, JSON.stringify(map, null, 2), "utf8");
  await fs.rename(tmpPath, finalPath);

  return map;
}
