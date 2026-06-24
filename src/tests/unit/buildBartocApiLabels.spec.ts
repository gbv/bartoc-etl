import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { buildBartocApiLabels } from "../../server/utils/buildBartocApiLabels";

const fixturePath = "src/tests/fixtures/api-types-concepts.json";
const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.map(dir => rm(dir, { recursive: true, force: true })));
  tempDirs.length = 0;
});

describe("buildBartocApiLabels", () => {
  it("includes non-top API type concepts in the label map", async () => {
    const outDir = await mkdtemp(path.join(tmpdir(), "bartoc-api-labels-"));
    tempDirs.push(outDir);

    const labels = await buildBartocApiLabels(fixturePath, outDir);

    expect(labels["http://bartoc.org/api-type/sparql"]).toBe("SPARQL endpoint");
    expect(labels["http://bartoc.org/api-type/mesh"]).toBe("MeSH SPARQL");

    const written = JSON.parse(
      await readFile(path.join(outDir, "bartoc-api-types-labels.json"), "utf8"),
    );

    expect(written["http://bartoc.org/api-type/mesh"]).toBe("MeSH SPARQL");
  });
});
