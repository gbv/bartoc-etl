<template>
  <nav
    aria-label="Search results summary"
    class="breadcrumb breadcrumb--with-actions">
    <ol class="breadcrumb-list">
      <li class="breadcrumb-item">
        {{ formattedSummary }}
      </li>
    </ol>
    <button
      type="button"
      class="button breadcrumb-print noprint"
      aria-label="Print search results"
      title="Print search results"
      @click="printPage">
      <vue-feather
        type="printer"
        size="16"
        stroke-width="2"
        aria-hidden="true" />
      <span>Print</span>
    </button>
  </nav>
</template>

<script>
export default {
  name: "NavBreadcrumb",
  props: {
    /**
     * Summary object for search result mode.
     * - from: number (start index)
     * - to: number (end index)
     * - total: number (total results)
     */
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
  },
  computed: {
    formattedSummary() {
      const { from, to, total } = this.summary
      const formatNumber = num => new Intl.NumberFormat().format(num)
      if (from == 1 && to == total) {
        return `Showing all ${formatNumber(total)} results`
      } else {
        return `Showing ${formatNumber(from)} - ${formatNumber(to)} of ${formatNumber(total)} results`
      }
    },
  },
  methods: {
    printPage() {
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

      // The body class scopes print CSS to the compact search-results layout.
      body?.classList.add("print-search-results")
      // In the normal print flow, once:true lets the browser remove this listener.
      window.addEventListener?.("afterprint", cleanupPrintMode, { once: true })

      try {
        window.print()
      } catch (error) {
        cleanupPrintMode()
        unregisterPrintCleanup()
        throw error
      }
    },
  },
}
</script>

<style scoped>
.breadcrumb--with-actions {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 1rem;
  width: 100%;
}

.breadcrumb--with-actions .breadcrumb-list {
  grid-column: 2;
  justify-self: center;
}

.breadcrumb-print {
  grid-column: 3;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  justify-self: end;
  margin: 0;
  white-space: nowrap;
}

@media print {
  .breadcrumb--with-actions {
    display: block;
  }
}
</style>
