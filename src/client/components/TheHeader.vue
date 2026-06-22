<template>
  <header class="header">
    <div class="header__container noprint">
      <div class="header__logo no-hover">
        <a href="/">
          <img
            :src="logoUrl"
            alt="BARTOC Search"
            class="header__logo-image">
        </a>
      </div>
      <nav class="header__nav">
        <div class="header__nav-left">
          <a href="/about">
            <span class="header__logo-text">About</span>
          </a>
          <a href="/vocabularies">
            <span class="header__logo-text">Terminologies</span>
          </a>
          <a href="/registries">
            <span class="header__logo-text">Registries</span>
          </a>
          <a href="/software">
            <span class="header__logo-text">Software</span>
          </a>
          <a href="/stats">
            <span class="header__logo-text">Statistics</span>
          </a>
        </div>
        <div class="header__nav-right">
          <a href="/contact">
            <span class="header__logo-text">Contact & Editors</span>
          </a>
          <UserStatus redirect />
          <a
            v-if="userCanAdd"
            class="header__add-button"
            :href="`${bartocBase}/edit`">
            Add
          </a>
        </div>
      </nav>
    </div>
    <div
      class="print-header printonly"
      aria-hidden="true">
      <img
        :src="printLogoUrl"
        alt=""
        class="print-header__logo">
      <span class="print-header__text">
        Basic Register of Thesauri, Ontologies & Classifications (BARTOC.org)
      </span>
    </div>
  </header>
</template>

<script setup>
import { inject, ref, watch } from "vue"
import logoUrl from "../assets/bartoc-logo.svg"
import printLogoUrl from "../assets/bartoc-logo_for_print.svg"

const { token } = inject("login-refs")
const userCanAdd = ref(false)
const bartocBase = "https://bartoc.org"

watch(token, async currentToken => {
  if (!currentToken) {
    userCanAdd.value = false
    return
  }

  try {
    const response = await fetch(
      `${bartocBase}/api/checkAuth?type=schemes&action=create`,
      {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      },
    )

    userCanAdd.value = response.ok
  } catch {
    userCanAdd.value = false
  }
}, { immediate: true })


</script>
