<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"

const isVisible = ref(false)
const SCROLL_TRIGGER = 250 // px before we show the button

function handleScroll() {
  if (typeof window === "undefined") {
    return
  }
  const y = window.scrollY || window.pageYOffset || 0
  isVisible.value = y > SCROLL_TRIGGER
}

function scrollToTop() {
  if (typeof window === "undefined") {
    return
  }
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

onMounted(() => {
  if (typeof window === "undefined") {
    return
  }
  window.addEventListener("scroll", handleScroll, { passive: true })
  handleScroll()
})

onBeforeUnmount(() => {
  if (typeof window === "undefined") {
    return
  }
  window.removeEventListener("scroll", handleScroll)
})
</script>

<template>
  <button
    v-if="isVisible"
    type="button"
    class="cc-button cc-button-primary cc-button-icon back-to-top noprint"
    aria-label="Back to top"
    @click="scrollToTop">
    <font-awesome-icon
      icon="chevron-up"
      size="xl" />
  </button>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 80;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  box-shadow: var(--cc-shadow-lg);

  /* small appear animation */
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 0.15s ease-out,
    transform 0.15s ease-out;
}

/* optional hover/focus style */
.back-to-top:hover,
.back-to-top:focus-visible {
  outline-offset: 2px;
}     
</style>
