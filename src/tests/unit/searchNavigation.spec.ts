import { describe, expect, it, vi } from "vitest"
// @ts-ignore - JS client composable has no TypeScript declaration
import { NAVIGATION } from "../../client/constants/search"
// @ts-ignore - JS client composable has no TypeScript declaration
import { useSearchNavigation } from "../../client/composables/useSearchNavigation"

function deferred() {
  let resolve = () => {}
  const promise = new Promise((done) => {
    resolve = () => done(undefined)
  })

  return { promise, resolve }
}

describe("useSearchNavigation", () => {
  it("pushes search route updates and marks them as internal while pending", async () => {
    const pending = deferred()
    const router = {
      push: vi.fn(() => pending.promise),
      replace: vi.fn(),
    }
    const route = { name: "search" }
    const navigation = useSearchNavigation({ router, route })

    const update = navigation.updateSearchRoute({ search: "film" }, NAVIGATION.PUSH)

    expect(navigation.isInternalRouteChange()).toBe(true)
    expect(router.push).toHaveBeenCalledWith({
      name: "search",
      query: { search: "film" },
    })
    expect(router.replace).not.toHaveBeenCalled()

    pending.resolve()
    await update

    expect(navigation.isInternalRouteChange()).toBe(false)
  })

  it("replaces by default and skips navigation mode none", async () => {
    const router = {
      push: vi.fn(),
      replace: vi.fn(async () => {}),
    }
    const route = { name: undefined }
    const navigation = useSearchNavigation({ router, route })

    await navigation.updateSearchRoute({ search: "film" })
    await navigation.updateSearchRoute({ search: "thesaurus" }, NAVIGATION.NONE)

    expect(router.replace).toHaveBeenCalledWith({
      name: "search",
      query: { search: "film" },
    })
    expect(router.push).not.toHaveBeenCalled()
    expect(router.replace).toHaveBeenCalledTimes(1)
  })
})
