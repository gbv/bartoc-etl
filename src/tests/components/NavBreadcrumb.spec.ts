// @vitest-environment happy-dom

import { mount } from "@vue/test-utils"
import { afterEach, describe, expect, it, vi } from "vitest"
import NavBreadcrumb from "../../client/components/NavBreadcrumb.vue"

function mountNavBreadcrumb(summary = { from: 1, to: 10, total: 42 }) {
  return mount(NavBreadcrumb, {
    props: { summary },
    global: {
      stubs: {
        "vue-feather": true,
      },
    },
  })
}

describe("NavBreadcrumb", () => {
  afterEach(() => {
    document.body.className = ""
    vi.restoreAllMocks()
  })

  it("formats the result summary", () => {
    const wrapper = mountNavBreadcrumb({ from: 11, to: 20, total: 999 })

    expect(wrapper.text()).toContain("Showing 11 - 20 of 999 results")
  })

  it("marks the print button as hidden from print output", () => {
    const wrapper = mountNavBreadcrumb()

    expect(wrapper.get(".breadcrumb-print").classes()).toContain("noprint")
  })

  it("enables restricted print mode while printing", async () => {
    const print = vi.spyOn(window, "print").mockImplementation(() => {})
    const wrapper = mountNavBreadcrumb()

    await wrapper.get(".breadcrumb-print").trigger("click")

    expect(print).toHaveBeenCalledTimes(1)
    expect(document.body.classList.contains("print-search-results")).toBe(true)

    window.dispatchEvent(new Event("afterprint"))

    expect(document.body.classList.contains("print-search-results")).toBe(false)
  })
})
