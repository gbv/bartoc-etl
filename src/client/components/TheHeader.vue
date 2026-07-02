<template>
  <header class="header">
    <div class="app-container header__container noprint">
      <div class="header__logo no-hover">
        <a href="/">
          <img
            :src="logoUrl"
            alt="BARTOC Search"
            class="bartoc-logo__image header__logo-image">
        </a>
      </div>
      <nav class="header__nav">
        <div class="header__nav-left">
          <a
            class="header__nav-link"
            href="/about">About</a>
          <a
            class="header__nav-link"
            href="/vocabularies">Terminologies</a>
          <a
            class="header__nav-link"
            href="/registries">Registries</a>
          <a
            class="header__nav-link"
            href="/software">Software</a>
          <a
            class="header__nav-link"
            href="/stats">Statistics</a>
        </div>
        <div class="header__nav-right">
          <a
            class="header__nav-link"
            href="/contact">Contact & Editors</a>
          <UserStatus redirect />
          <a
            v-if="userCanAdd"
            class="cc-button cc-button-on-primary header__add-button"
            :href="editUrl">
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
const authBase = "https://bartoc.org"
const editUrl = import.meta.env.DEV ? "https://dev.bartoc.org/edit" : "/edit"

watch(token, async currentToken => {
  if (!currentToken) {
    userCanAdd.value = false
    return
  }

  try {
    const response = await fetch(
      `${authBase}/api/checkAuth?type=schemes&action=create`,
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
