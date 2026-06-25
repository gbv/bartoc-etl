// @vitest-environment happy-dom

import { mount } from "@vue/test-utils"
import { describe, expect, it } from "vitest"
import NoResults from "../../client/components/NoResults.vue"

function mountNoResults(props = {}) {
  return mount(NoResults, {
    props: {
      search: "documentary",
      activeFilters: { languages_ss: ["en"] },
      ...props,
    },
  })
}

describe("NoResults", () => {
  it("can clear the search term without clearing active filters", async () => {
    const wrapper = mountNoResults()
    const links = wrapper.findAll("a")

    expect(wrapper.text()).toContain("Clear search term")
    expect(wrapper.text()).toContain("Clear active filters")

    await links.find(link => link.text() === "Clear search term")?.trigger("click")
    await links.find(link => link.text() === "Clear active filters")?.trigger("click")

    expect(wrapper.emitted("clear-search")).toHaveLength(1)
    expect(wrapper.emitted("clear-filters")).toHaveLength(1)
  })

  it("hides the clear search action when there is no search term", () => {
    const wrapper = mountNoResults({ search: "" })

    expect(wrapper.text()).not.toContain("Clear search term")
    expect(wrapper.text()).toContain("Clear active filters")
  })
})
