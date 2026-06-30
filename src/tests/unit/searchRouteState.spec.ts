import { beforeEach, describe, expect, it } from "vitest"
import { ref } from "vue"

// @ts-ignore - JS client store has no TypeScript declaration
import * as filtersStore from "../../client/stores/filters"
// @ts-ignore - JS client composable has no TypeScript declaration
import { useSearchRouteState } from "../../client/composables/useSearchRouteState"

const {
  clearAllBuckets,
  clearFilters,
  markFilterRequested,
  requestBucketFor,
  resetFiltersRequested,
  resetOpenGroups,
  setGroupOpen,
  state,
} = filtersStore

describe("useSearchRouteState", () => {
  beforeEach(() => {
    clearAllBuckets()
    clearFilters()
    resetFiltersRequested()
    resetOpenGroups()
  })

  it("syncs filters, open groups, limit, and sort from the route", () => {
    requestBucketFor("language")
    markFilterRequested("languages_ss")
    setGroupOpen("api_type_ss", true)

    const route = {
      query: {
        filter: ["language:en", "type:http://example.org/type"],
        limit: "25",
        sort: "title",
      },
    }
    const limit = ref(10)
    const sortBy = ref("relevance")
    const { syncSearchStateFromRoute } = useSearchRouteState({
      route,
      limit,
      sortBy,
      pageSize: 10,
    })

    syncSearchStateFromRoute()

    expect(state.activeFilters).toEqual({
      languages_ss: ["en"],
      type_uri: ["http://example.org/type"],
    })
    expect(state.bucketFacets).toEqual({})
    expect(state.filtersRequested).toEqual({})
    expect(state.openGroups).toEqual({
      languages_ss: true,
      type_uri: true,
    })
    expect(limit.value).toBe(25)
    expect(sortBy.value).toBe("title")
  })
})
