import { describe, it, expect } from "vitest"
// @ts-ignore - JS client utility has no TypeScript declaration
import { appendQueryToParams, asStringArray, formatDdcFacetLabels } from "../../client/utils/utils"

describe("appendQueryToParams", () => {
  it("appends scalar values and repeated array values", () => {
    const params = appendQueryToParams(new URLSearchParams(), {
      search: "film",
      sort: "relevance",
      filter: ["language:en", "ddc:7"],
    })

    expect(params.get("search")).toBe("film")
    expect(params.get("sort")).toBe("relevance")
    expect(params.getAll("filter")).toEqual(["language:en", "ddc:7"])
  })

  it("skips empty/null/undefined values", () => {
    const params = appendQueryToParams(new URLSearchParams(), {
      search: "",
      empty: "",
      nil: null,
      nope: undefined,
      filter: ["language:en", ""],
    })

    expect(params.has("search")).toBe(false)
    expect(params.has("empty")).toBe(false)
    expect(params.has("nil")).toBe(false)
    expect(params.has("nope")).toBe(false)
    expect(params.getAll("filter")).toEqual(["language:en"])
  })
})

describe("asStringArray", () => {
  it("normalizes strings and string arrays", () => {
    expect(asStringArray("Thesaurus")).toEqual(["Thesaurus"])
    expect(asStringArray(["Thesaurus", "Ontology"])).toEqual([
      "Thesaurus",
      "Ontology",
    ])
  })

  it("drops non-string values", () => {
    expect(asStringArray(["Thesaurus", null, 3, "Ontology"])).toEqual([
      "Thesaurus",
      "Ontology",
    ])
    expect(asStringArray(null)).toEqual([])
    expect(asStringArray({ label: "Thesaurus" })).toEqual([])
  })
})

describe("formatDdcFacetLabels", () => {
  it("prefixes DDC labels with their notation", () => {
    expect(formatDdcFacetLabels({
      "0": "Computer science, information & general works",
      "3": "Social sciences",
    })).toEqual({
      "0": "0 - Computer science, information & general works",
      "3": "3 - Social sciences",
    })
  })

  it("returns an empty object for empty input", () => {
    expect(formatDdcFacetLabels()).toEqual({})
  })
})
