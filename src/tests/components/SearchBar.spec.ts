// @vitest-environment happy-dom

import { mount } from "@vue/test-utils"
import { createMemoryHistory, createRouter } from "vue-router"
import { describe, expect, it, vi } from "vitest"
import { nextTick } from "vue"
import SearchBar from "../../client/components/SearchBar.vue"

const routes = [
  {
    path: "/",
    name: "search",
    component: { template: "<div />" },
  },
]

async function mountSearchBar(query = {}) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })

  await router.push({ name: "search", query })
  await router.isReady()

  const namespaces = {
    lookup: vi.fn((uri) => `label for ${uri}`),
  }

  const wrapper = mount(SearchBar, {
    global: {
      plugins: [router],
      provide: {
        namespaces,
      },
    },
  })

  return { router, wrapper, namespaces }
}

describe("SearchBar", () => {
  it("initializes input and field select from the current route query", async () => {
    const uri = "http://uri.gbv.de/terminology/bk/42.90"
    const { wrapper } = await mountSearchBar({
      search: uri,
      field: "subject_uri",
      limit: "20",
    })

    expect(wrapper.get("input").element.value).toBe(uri)
    expect(wrapper.get("select").element.value).toBe("subject_uri")
  })

  it("updates input and field select when the route query changes", async () => {
    const uri = "http://uri.gbv.de/terminology/bk/42.90"
    const { router, wrapper } = await mountSearchBar()

    expect(wrapper.get("input").element.value).toBe("")
    expect(wrapper.get("select").element.value).toBe("")

    await router.replace({
      name: "search",
      query: {
        search: uri,
        field: "subject_uri",
        limit: "10",
      },
    })
    await nextTick()

    expect(wrapper.get("input").element.value).toBe(uri)
    expect(wrapper.get("select").element.value).toBe("subject_uri")
  })

  it("emits a search event with the current route-synced values", async () => {
    const uri = "http://uri.gbv.de/terminology/bk/42.90"
    const { wrapper } = await mountSearchBar({
      search: uri,
      field: "subject_uri",
      limit: "10",
    })

    await wrapper.get("form").trigger("submit")

    expect(wrapper.emitted("search")?.at(-1)).toEqual([
      {
        search: uri,
        field: "subject_uri",
        limit: "10",
      },
    ])
  })

  it("emits lookupUri when the search input contains an HTTP URI", async () => {
    const uri = "http://uri.gbv.de/terminology/bk/42.90"
    const { namespaces, wrapper } = await mountSearchBar()

    await wrapper.get("input").setValue(uri)
    await nextTick()

    expect(namespaces.lookup).toHaveBeenCalledWith(uri)
    expect(wrapper.emitted("lookupUri")?.at(-1)).toEqual([
      {
        uri,
        name: `label for ${uri}`,
      },
    ])
  })
})
