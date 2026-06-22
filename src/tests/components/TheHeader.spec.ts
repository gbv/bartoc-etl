// @vitest-environment happy-dom

import { flushPromises, mount } from "@vue/test-utils"
import { ref } from "vue"
import { afterEach, describe, expect, it, vi } from "vitest"
import TheHeader from "../../client/components/TheHeader.vue"

const UserStatusStub = {
  template: "<div class=\"user-status-stub\" />",
}

function mountHeader(initialToken: string | null = null) {
  const token = ref(initialToken)

  const wrapper = mount(TheHeader, {
    global: {
      provide: {
        "login-refs": { token },
      },
      stubs: {
        UserStatus: UserStatusStub,
      },
    },
  })

  return { wrapper, token }
}

describe("TheHeader", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("shows Add Button after authorization succeeds", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal("fetch", fetchMock)

    const { wrapper, token } = mountHeader()

    expect(wrapper.find(".header__add-button").exists()).toBe(false)

    token.value = "test-token"
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledWith(
      "https://bartoc.org/api/checkAuth?type=schemes&action=create",
      {
        headers: {
          Authorization: "Bearer test-token",
        },
      },
    )

    expect(wrapper.get(".header__add-button").attributes("href"))
        .toBe("https://dev.bartoc.org/edit")

    token.value = null
    await flushPromises()

    expect(wrapper.find(".header__add-button").exists()).toBe(false)
  })

  it("keeps Add hidden when authorization fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }))

    const { wrapper } = mountHeader("test-token")
    await flushPromises()

    expect(wrapper.find(".header__add-button").exists()).toBe(false)
  })

  it("keeps Add hidden when authorization request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error")),
    )

    const { wrapper } = mountHeader("test-token")
    await flushPromises()

    expect(wrapper.find(".header__add-button").exists()).toBe(false)
  })
})
