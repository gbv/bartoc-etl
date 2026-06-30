export function buildSearchBarQuery(routeQuery = {}, query = {}, filterParams = [], pageSize = 10) {
  const base = { ...(routeQuery || {}) }

  delete base.filter
  delete base.start

  return {
    ...base,
    search: query?.search ?? base.search ?? "",
    field: query?.field ?? "",
    limit: String(pageSize),
    ...(filterParams.length ? { filter: filterParams } : {}),
  }
}

export function buildQueryWithFilters(routeQuery = {}, filterParams = [], limit = 10) {
  const base = { ...(routeQuery || {}) }

  delete base.filter
  delete base.start

  return {
    ...base,
    limit: String(limit),
    ...(filterParams.length ? { filter: filterParams } : {}),
  }
}

export function buildQueryWithoutSearch(routeQuery = {}) {
  const base = { ...(routeQuery || {}) }

  delete base.search
  delete base.field

  return base
}
