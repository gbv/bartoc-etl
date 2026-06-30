import {
  clearAllBuckets,
  openGroupsForActiveFilters,
  resetFiltersRequested,
  resetOpenGroups,
  setFiltersFromRepeatable,
} from "../stores/filters.js"
import { normalizeSort } from "../utils/sortDefaults.js"

export function useSearchRouteState({ route, limit, sortBy, pageSize }) {
  // Keep local search UI state aligned with a route query.
  function syncSearchStateFromRoute(query = route.query) {
    clearAllBuckets()
    resetFiltersRequested()
    resetOpenGroups()
    setFiltersFromRepeatable(query.filter)
    openGroupsForActiveFilters()
    limit.value = Number(query.limit) || pageSize
    sortBy.value = normalizeSort(query).sort
  }

  return { syncSearchStateFromRoute }
}
