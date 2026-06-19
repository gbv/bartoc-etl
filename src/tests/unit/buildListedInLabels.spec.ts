import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { buildListedInLabels } from "../../server/utils/buildListedInLabels"

describe("buildListedInLabels", () => {
  it("maps registry URIs to their labels", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "listed-in-"))
    const snapshot = path.join(dir, "registries.json")
    const output = path.join(dir, "output")

    await fs.writeFile(snapshot, JSON.stringify([
      {
        uri: "http://bartoc.org/en/node/18972",
        prefLabel: { en: "K-KOS" },
      },
    ]))

    await buildListedInLabels(snapshot, output)

    const labels = JSON.parse(
      await fs.readFile(path.join(output, "listed_in.json"), "utf8"),
    )

    expect(labels).toEqual({
      "http://bartoc.org/en/node/18972": "K-KOS",
    })

    await fs.rm(dir, { recursive: true, force: true })
  })
})
