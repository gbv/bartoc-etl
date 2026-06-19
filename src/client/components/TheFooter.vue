<template>
  <footer>
    <div class="noprint">
      <span v-if="apiStatus.solr.connected">
        search in <b>{{ apiStatus.solr.indexedRecords }}</b> terminologies
        (as of <b>{{ apiStatus.solr.lastIndexedAt }}</b>,
        live updates <b>{{ apiStatus.jskosServer.connected ? 'enabled' : 'disabled' }}</b>)
      </span>
      <span v-else>
        Search index not available!
      </span>
      <a :href="`${baseUrl}api/status`">Search API</a>
      |
      <a href="https://github.com/gbv/bartoc-search">sources</a>
    </div>
    <p class="noprint">
      BARTOC.org vocabulary metadata is <a href="/download">made available</a> under the <a href="http://www.opendatacommons.org/licenses/pddl/1.0/">PDDL 1.0</a>
    </p>
    <div class="noprint">
      <a href="/api/">JSKOS API</a>
      |
      <a
        rel="me"
        href="https://code4lib.social/@bartoc">Mastodon</a>
      |        
      <a href="https://github.com/gbv/bartoc.org">sources</a>
      |
      <a href="https://github.com/gbv/bartoc.org/issues">issues</a>
    </div>
    <p class="print-footer printonly">
      BARTOC.org vocabulary metadata is made available under the PDDL 1.0.
    </p>
  </footer>
</template>

<script setup>
import { reactive, onMounted } from "vue"
import axios from "axios"

const baseUrl = import.meta.env.BASE_URL
const apiStatus = reactive({ solr: {}, jskosServer: {} })

onMounted(async () => {
  axios
    .get(`${baseUrl}api/status`)
    .then((res) => {
      Object.assign(apiStatus, res.data)
    })
    .catch((e) => {
      console.warn("Failed to fetch API status" + e)
    })
})
</script>
