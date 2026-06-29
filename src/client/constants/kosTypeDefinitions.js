import { reactive } from "vue"
import { ensureLabels } from "./facetLabels"

const KOS_TYPE_DEFINITIONS_FILE = "nkos-type-definitions.json"
const KOS_TYPE_DEFINITIONS_KEY = "nkos-type-definitions"

// The generated update-data artifact is keyed by NKOS concept URI.
// Keep the map reactive so components update after the async fetch completes.
const concepts = reactive({})

// Reuse the same in-flight/completed request for every component on the page.
let loadPromise = null

/**
 * Read the English display text from a JSKOS language map.
 *
 * JSKOS fields such as `prefLabel`, `definition`, and `scopeNote` are keyed by
 * language. For now the client intentionally uses only `en`; missing English
 * text returns an empty string instead of falling back to another language.
 */
function asEnglishText(langMap) {
  if (!langMap || typeof langMap !== "object") {
    return ""
  }

  const value = langMap.en

  if (typeof value === "string" && value.trim()) {
    return value.trim()
  }

  if (Array.isArray(value)) {
    const text = value.find(item => typeof item === "string" && item.trim())
    return text ? text.trim() : ""
  }

  return ""
}

/**
 * Replace the generated concept map without replacing the reactive object.
 *
 * Vue consumers keep their existing reference to `concepts`; clearing and
 * reassigning properties is what makes late-loaded labels and tooltips appear
 * in already-rendered vocabulary cards.
 */
function replaceDefinitions(definitions = {}) {
  for (const key of Object.keys(concepts)) {
    delete concepts[key]
  }

  Object.assign(concepts, definitions || {})
  return concepts
}

/**
 * Seed definitions directly.
 *
 * This is used by tests and by any caller that already has the generated
 * artifact in memory. It also marks the definitions as loaded for subsequent
 * `ensureKosTypeDefinitions` calls.
 */
export function setKosTypeDefinitions(definitions = {}) {
  loadPromise = Promise.resolve(replaceDefinitions(definitions))
}

/**
 * Restore the module to its initial unloaded state.
 *
 * Tests call this between cases so cached labels from one scenario cannot leak
 * into another.
 */
export function resetKosTypeDefinitions() {
  replaceDefinitions()
  loadPromise = null
}

/**
 * Load NKOS type labels and descriptions from the static data artifact.
 *
 * The file is produced by the server-side update-data workflow and then served
 * from `/data`, like the other client-side label artifacts. The optional `url`
 * keeps tests independent from Vite's public path handling.
 */
export function ensureKosTypeDefinitions(url) {
  if (typeof window === "undefined") {
    return Promise.resolve(concepts)
  }

  const baseUrl = import.meta.env.BASE_URL || "/"
  const href = url || `${baseUrl}data/${KOS_TYPE_DEFINITIONS_FILE}`

  loadPromise ??= ensureLabels(KOS_TYPE_DEFINITIONS_KEY, href)
    .then(replaceDefinitions)

  return loadPromise
}

/**
 * Return the English NKOS type label for a concept URI.
 *
 * Unknown URIs deliberately resolve to an empty string so callers can skip
 * labels that cannot be tied back to the NKOS type vocabulary.
 */
export function getKosTypeLabel(uri) {
  const concept = concepts[uri]
  return asEnglishText(concept?.prefLabel)
}

/**
 * Return the English tooltip text for a concept URI.
 *
 * `definition` is preferred. `scopeNote` remains a fallback for older data.
 */
export function getKosTypeDescription(uri) {
  const concept = concepts[uri]
  if (!concept) {
    return ""
  }

  return (
    asEnglishText(concept.definition) ||
    asEnglishText(concept.scopeNote)
  )
}
