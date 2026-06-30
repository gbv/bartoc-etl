import { describe, expect, it } from "vitest"

// @ts-ignore - JS client utility has no TypeScript declaration
import { buildQueryWithFilters, buildQueryWithoutSearch, buildSearchBarQuery } from "../../client/utils/searchQuery"

describe("buildSearchBarQuery", () => {
  it("keeps active filters when composing a new search", () => {
    const query = buildSearchBarQuery(
      {
        filter: "language:en",
        limit: "50",
        search: "classification",
        sort: "relevance",
        start: "40",
      },
      { search: "dasdasas", field: "" },
      ["language:en"],
      10,
    )

    expect(query).toEqual({
      filter: ["language:en"],
      field: "",
      limit: "10",
      search: "dasdasas",
      sort: "relevance",
    })
  })

  it("does not keep stale filter params when active filters are empty", () => {
    const query = buildSearchBarQuery(
      { filter: "language:en", search: "classification" },
      { search: "dasdasas" },
      [],
      10,
    )

    expect(query).toEqual({
      field: "",
      limit: "10",
      search: "dasdasas",
    })
  })
})

describe("buildQueryWithFilters", () => {
  it("replaces URL filters with active filters and resets pagination", () => {
    const query = buildQueryWithFilters(
      {
        filter: "language:de",
        limit: "50",
        search: "film",
        sort: "relevance",
        start: "40",
      },
      ["language:en"],
      10,
    )

    expect(query).toEqual({
      filter: ["language:en"],
      limit: "10",
      search: "film",
      sort: "relevance",
    })
  })
})

describe("buildQueryWithoutSearch", () => {
  it("removes search params and preserves the rest of the query", () => {
    const query = buildQueryWithoutSearch({
      field: "prefLabel",
      filter: "language:en",
      limit: "10",
      search: "film",
      sort: "relevance",
    })

    expect(query).toEqual({
      filter: "language:en",
      limit: "10",
      sort: "relevance",
    })
  })
})
