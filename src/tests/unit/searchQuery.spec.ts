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
      limit: "10",
      search: "dasdasas",
    })
  })

  it("includes the selected field when composing a new search", () => {
    const query = buildSearchBarQuery(
      { search: "classification" },
      { search: "dasdasas", field: "title_search" },
      [],
      10,
    )

    expect(query).toEqual({
      field: "title_search",
      limit: "10",
      search: "dasdasas",
    })
  })

  it("removes stale field params when all fields are selected", () => {
    const query = buildSearchBarQuery(
      { field: "title_search", search: "classification" },
      { search: "dasdasas" },
      [],
      10,
    )

    expect(query).toEqual({
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
