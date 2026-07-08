<template>
  <nav
    aria-label="Search result actions"
    class="search-result-actions">
    <span class="search-result-actions__summary">
      {{ formattedSummary }}
    </span>

    <div class="action-group search-result-actions__buttons noprint">
      <button
        v-if="canLoadMore"
        class="cc-button cc-button-primary search-result-actions__button"
        type="button"
        @click="emit('load-more')">
        More
      </button>
      <button
        v-if="canLoadMore"
        class="cc-button cc-button-primary search-result-actions__button"
        type="button"
        @click="emit('show-all')">
        All
      </button>
      <button
        class="cc-button cc-button-primary search-result-actions__button search-result-actions__print"
        type="button"
        @click="printPage">
        Print
      </button>
      <a
        v-if="downloadUrl"
        class="cc-button cc-button-primary search-result-actions__button"
        :href="downloadUrl"
        download="bartoc-search-results.jskos.json"
        type="application/json">
        Download
      </a>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  summary: {
    type: Object,
    required: true,
    validator(summary) {
      return (
        Number.isInteger(summary.from) &&
        Number.isInteger(summary.to) &&
        Number.isInteger(summary.total)
      )
    },
  },
  canLoadMore: {
    type: Boolean,
    default: false,
  },
  downloadUrl: {
    type: String,
    default: "",
  },
})

const emit = defineEmits([ "load-more", "show-all" ])

const formattedSummary = computed(() => {
  const { from, to, total } = props.summary
  const formatNumber = num => new Intl.NumberFormat().format(num)

  return `Showing ${formatNumber(from)} - ${formatNumber(to)} of ${formatNumber(total)} results`
})

function printPage() {
  if (typeof window === "undefined" || typeof window.print !== "function") {
    return
  }

  const body = window.document?.body
  const cleanupPrintMode = () => {
    body?.classList.remove("print-search-results")
  }
  const unregisterPrintCleanup = () => {
    window.removeEventListener?.("afterprint", cleanupPrintMode)
  }

  body?.classList.add("print-search-results")
  window.addEventListener?.("afterprint", cleanupPrintMode, { once: true })

  try {
    window.print()
  } catch (error) {
    cleanupPrintMode()
    unregisterPrintCleanup()
    throw error
  }
}
</script>

<style scoped>
.search-result-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  max-width: 900px;
  margin: 0.75rem auto;
}

.search-result-actions__summary {
  font-size: 14px;
  font-weight: 500;
  color: var(--cc-color-muted);
}

.search-result-actions__buttons {
  justify-content: flex-end;
}

.search-result-actions__button {
  margin: 0;
}

@media print {
  .search-result-actions {
    display: block;
    max-width: none;
    margin: 0 0 0.35rem;
  }
}
</style>
