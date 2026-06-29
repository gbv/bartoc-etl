/**
 * Append a Vue Router query object to URLSearchParams.
 *
 * Vue Router query values can be:
 * - a string
 * - an array of strings
 * - null / undefined
 *
 * Empty values are skipped
 *
 * @param {URLSearchParams} params
 * @param {Record<string, unknown>} query
 * @returns {URLSearchParams}
 */
export function appendQueryToParams(params, query = {}) {
  for (const [key, value] of Object.entries(query || {})) {
    const values = Array.isArray(value) ? value : [value]

    values
      .filter((v) => v !== undefined && v !== null && v !== "")
      .forEach((v) => params.append(key, String(v)))
  }

  return params
}

/**
 * Normalize a Solr field that may arrive as a string or a string array.
 *
 * Solr fields are not always shaped consistently in fixtures and responses:
 * single-valued fields can be plain strings, while multivalued fields are
 * arrays. Components can use this helper before mapping or joining values.
 */
export function asStringArray(value) {
  if (Array.isArray(value)) {
    return value.filter(item => typeof item === "string")
  }

  if (typeof value === "string") {
    return [value]
  }

  return []
}

// Format DDC facet labels to include notation in the label, e.g. "3 - Social Sciences"
export function formatDdcFacetLabels(labels = {}) {
  return Object.fromEntries(
    Object.entries(labels).map(([notation, label]) => [
      notation,
      `${notation} - ${label}`,
    ]),
  )
}
