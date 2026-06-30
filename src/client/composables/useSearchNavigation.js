import { NAVIGATION } from "../constants/search.js"

// Owns the router side effects for search-state changes.
export function useSearchNavigation({ router, route }) {
  // Lets SearchView ignore route updates caused by its own push/replace calls.
  let isInternalNavigation = false

  async function updateSearchRoute(query, navigation = NAVIGATION.REPLACE) {
    // Back/Forward already changed the URL; the caller should only refetch.
    if (navigation === NAVIGATION.NONE) {
      return
    }

    const location = { name: route.name || "search", query }
    isInternalNavigation = true

    try {
      if (navigation === NAVIGATION.PUSH) {
        await router.push(location)
      } else {
        await router.replace(location)
      }
    } finally {
      isInternalNavigation = false
    }
  }

  // Stays true while Vue Router is processing a search route update.
  function isInternalRouteChange() {
    return isInternalNavigation
  }

  return {
    updateSearchRoute,
    isInternalRouteChange,
  }
}
