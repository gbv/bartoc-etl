<template>
  <div class="search-controls__wrapper">
    <LookupHint
      v-if="lookupUri"
      :uri="lookupUri.uri"
      :name="lookupUri.name" />

    <!-- Active filter badges -->
    <div
      v-if="badges.length > 0"
      class="search-filters">
      <div class="action-group badges__wrapper">
        <FilterBadge
          v-for="badge in badges"
          :key="badge.key"
          :label="badge.label"
          :value="badge.value"
          @remove-badge="onRemoveBadge(badge)" />
        <button
          class="cc-button cc-button-danger noprint"
          :aria-label="`Clear Filters`"
          type="button"
          @click="emit('clear-filters')">
          Clear Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { computed } from "vue"
import LookupHint from "./LookupHint.vue"
import FilterBadge from "./FilterBadge.vue"

import { state } from "../stores/filters.js"
import { FACET_FIELD_LABELS } from "../constants/facetFieldLabels.js"

const props = defineProps({
  lookupUri:{ 
    type: Object, 
    default: null },
})


const emit = defineEmits(["remove-badge", "clear-filters"])

const lookupUri = computed(() => props.lookupUri)

// Build badge items from activeFilters { internal: [v1, v2] }
const badges = computed(() => {
  const items = []

  for (const [internal, values] of Object.entries(state.activeFilters || {})) {
    const facetMeta   = FACET_FIELD_LABELS[internal] || {}
    const facetLabel  = facetMeta.label ?? internal
    const valueLabels = facetMeta.values || {}

    ;(values || []).forEach(v => {
      items.push({
        key: `${internal}|${v}`,
        internal,
        label: facetLabel,
        value: valueLabels[v] ?? (v === "-" ? "no value" : v),
        display: v,
      })
    })
  }

  return items
})

function onRemoveBadge(badge) {
  emit("remove-badge", { field: badge.internal, value: badge.display })
}

</script>
