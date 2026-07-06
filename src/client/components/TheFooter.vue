<template>
  <BartocFooter
    site-name="BARTOC.org"
    api-url="/api/"
    download-url="/download"
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
  {
    href: "https://code4lib.social/@bartoc",
    label: "Mastodon",
    rel: "me",
  },
  {
    href: "https://github.com/gbv/bartoc.org",
    label: "sources",
  },
  {
    href: "https://github.com/gbv/bartoc.org/issues",
    label: "issues",
  },
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