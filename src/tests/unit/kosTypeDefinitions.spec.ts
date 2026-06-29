import { afterEach, describe, expect, it } from "vitest"

// @ts-ignore - JS client utility has no TypeScript declaration
import * as kosTypeDefinitions from "../../client/constants/kosTypeDefinitions"

const {
  getKosTypeDescription,
  getKosTypeLabel,
  resetKosTypeDefinitions,
  setKosTypeDefinitions,
} = kosTypeDefinitions

afterEach(() => {
  resetKosTypeDefinitions()
})

describe("KOS type definitions", () => {
  it("reads English labels and descriptions from the NKOS type data", () => {
    const uri = "http://w3id.org/nkos/nkostype#glossary"
    setKosTypeDefinitions({
      [uri]: {
        prefLabel: {
          de: "Glossar",
          en: "Glossary",
        },
        definition: {
          de: [
            "Eine alphabetisch geordnete Liste von Fachbegriffen mit kurzen Definitionen.",
          ],
          en: [
            "An alphabetically ordered list of specialized terms with short definitions.",
          ],
        },
      },
    })

    expect(getKosTypeLabel(uri)).toBe("Glossary")
    expect(getKosTypeDescription(uri)).toContain(
      "specialized terms with short definitions",
    )
  })

  it("returns an empty string for unknown KOS types", () => {
    expect(getKosTypeLabel("https://example.org/type")).toBe("")
    expect(getKosTypeDescription("https://example.org/type")).toBe("")
  })
})
