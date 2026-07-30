<template>
  <BartocFooter
    site-name="BARTOC.org"
    :internal-links="internalLinks"
    :external-links="externalLinks"
    :search-status-links="searchStatusLinks">
    <template #search-status>
      <span v-if="apiStatus.solr.connected">
        search in <b>{{ apiStatus.solr.indexedRecords }}</b> terminologies
        (as of <b>{{ apiStatus.solr.lastIndexedAt }}</b>,
        live updates
        <b>{{ apiStatus.jskosServer.connected ? "enabled" : "disabled" }}</b>)
      </span>
      <span v-else>
        Search index not available!
      </span>
    </template>
  </BartocFooter>
</template>

<script setup>
import { reactive, onMounted } from "vue"
import axios from "axios"
import { BartocFooter } from "@gbv/bartoc-components"
const baseUrl = import.meta.env.BASE_URL || "/"

const apiStatus = reactive({
  solr: {},
  jskosServer: {},
})

const searchStatusLinks = [
  {
    href: `${baseUrl}api/status`,
    label: "Search API",
  },
  {
    href: "https://github.com/gbv/bartoc-search",
    label: "sources",
  },
]

const externalLinks = [
  { label: "Imprint", href: "https://www.gbv.de/impressum" },
  { label: "Privacy Policy", href: "https://www.gbv.de/datenschutz" },
  { label: "Mastodon", href: "https://code4lib.social/@bartoc", rel: "me" },
  { label: "sources", href: "https://github.com/gbv/bartoc.org" },
  { label: "issues", href: "https://github.com/gbv/bartoc.org/issues" },
]

const internalLinks = [
  { href: "/api/", label: "API" },
  { href: "/download", label: "download" },
  { href: "/sparql", label: "SPARQL" },
]

onMounted(async () => {
  try {
    const res = await axios.get(`${baseUrl}api/status`)
    Object.assign(apiStatus, res.data)
  } catch (error) {
    console.warn(`Failed to fetch API status: ${error}`)
  }
})
</script>