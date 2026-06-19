// @vitest-environment happy-dom

import { mount } from "@vue/test-utils"
import { afterEach, describe, expect, it, vi } from "vitest"
import SearchResultActions from "../../client/components/SearchResultActions.vue"

function mountSearchResultActions(props = {}) {
  return mount(SearchResultActions, {
    props: {
      summary: { from: 1, to: 10, total: 42 },
      canLoadMore: true,
      downloadUrl: "/api/search?format=jskos",
      ...props,
    },
  })
}

describe("SearchResultActions", () => {
  afterEach(() => {
    document.body.className = ""
    vi.restoreAllMocks()
  })

  it("formats the result summary", () => {
    const wrapper = mountSearchResultActions({
      summary: { from: 11, to: 20, total: 999 },
    })

    expect(wrapper.text()).toContain("Showing 11 - 20 of 999 results")
  })

  it("emits events for expanding results", async () => {
    const wrapper = mountSearchResultActions()

    await wrapper.get("button:nth-of-type(1)").trigger("click")
    await wrapper.get("button:nth-of-type(2)").trigger("click")

    expect(wrapper.emitted("load-more")).toHaveLength(1)
    expect(wrapper.emitted("show-all")).toHaveLength(1)
  })

  it("hides buttons from print output", () => {
    const wrapper = mountSearchResultActions()

    expect(wrapper.get(".search-result-actions__buttons").classes()).toContain("noprint")
  })

  it("enables restricted print mode while printing", async () => {
    const print = vi.spyOn(window, "print").mockImplementation(() => {})
    const wrapper = mountSearchResultActions()

    await wrapper.get(".search-result-actions__print").trigger("click")

    expect(print).toHaveBeenCalledTimes(1)
    expect(document.body.classList.contains("print-search-results")).toBe(true)

    window.dispatchEvent(new Event("afterprint"))

    expect(document.body.classList.contains("print-search-results")).toBe(false)
  })
})
