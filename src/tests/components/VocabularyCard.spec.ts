// @vitest-environment happy-dom

import { mount } from "@vue/test-utils"
import { afterEach, describe, expect, it } from "vitest"
import VocabularyCard from "../../client/components/VocabularyCard.vue"
// @ts-ignore - JS client utility has no TypeScript declaration
import * as kosTypeDefinitions from "../../client/constants/kosTypeDefinitions"

const {
  resetKosTypeDefinitions,
  setKosTypeDefinitions,
} = kosTypeDefinitions

const vueFeatherStub = {
  props: ["type", "size"],
  template: "<span class=\"icon-stub\" />",
}

function mountVocabularyCard(doc = {}) {
  return mount(VocabularyCard, {
    props: {
      doc: {
        id: "http://bartoc.org/en/node/1",
        title_en: "Example vocabulary",
        definition_en: ["A short description."],
        languages_ss: ["en"],
        ...doc,
      },
      lang: "en",
    },
    global: {
      stubs: {
        "vue-feather": vueFeatherStub,
      },
    },
  })
}

afterEach(() => {
  resetKosTypeDefinitions()
})

describe("VocabularyCard", () => {
  it("shows NKOS type tooltips from JSKOS concept data", () => {
    setKosTypeDefinitions({
      "http://w3id.org/nkos/nkostype#thesaurus": {
        prefLabel: {
          en: "Thesaurus",
          de: "Thesaurus",
        },
        definition: {
          en: [
            "A system of terms with hierarchical, associative, and synonymous relationships.",
          ],
          de: [
            "Ein Begriffssystem mit hierarchischen, assoziativen und synonymen Beziehungen.",
          ],
        },
      },
    })

    const wrapper = mountVocabularyCard({
      type_uri: [
        "http://www.w3.org/2004/02/skos/core#ConceptScheme",
        "http://w3id.org/nkos/nkostype#thesaurus",
      ],
    })

    const tooltip = wrapper.get(".kos-type-info")

    expect(wrapper.text()).toContain("Thesaurus")
    expect(wrapper.text()).not.toContain("Concept Scheme")
    expect(tooltip.attributes("title")).toContain(
      "hierarchical, associative, and synonymous relationships",
    )
    expect(tooltip.attributes("aria-label")).toContain("Thesaurus")
  })

  it("keeps rendering legacy type labels when type URIs are absent", () => {
    setKosTypeDefinitions({})

    const wrapper = mountVocabularyCard({
      type_label_en: ["Thesaurus"],
    })

    expect(wrapper.text()).toContain("Thesaurus")
    expect(wrapper.find(".kos-type-info").exists()).toBe(false)
  })
})
