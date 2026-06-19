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
          <a href="/vocabularies">
            <span class="header__logo-text">Terminologies</span>
          </a>
          <a href="/registries">
            <span class="header__logo-text">Registries</span>
          </a>
          <a href="/software">
            <span class="header__logo-text">Software</span>
          </a>
          <a href="/about">
            <span class="header__logo-text">About</span>
          </a>
          <a href="/contact">
            <span class="header__logo-text">Contact</span>
          </a>
        </div>
        <div class="header__nav-right">
          <a href="/stats">
            <span class="header__logo-text">Statistics</span>
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
import logoUrl from "../assets/bartoc-logo.svg"
import printLogoUrl from "../assets/bartoc-logo_for_print.svg"
</script>
