<template>
  <span
    class="filter-badge"
    :title="`${label}: ${value}`">
    <span class="filter-badge__text">
      <span class="filter-badge__label">{{ label }}:</span>
      <span class="filter-badge__value">{{ displayValue }}</span>
    </span>
    <button
      class="cc-button cc-button-ghost cc-button-sm cc-button-icon filter-badge__close noprint"
      :aria-label="`Remove Badge ${label}: ${displayValue}`"
      type="button"
      @click="emit('remove-badge')" />
  </span>
</template>

<script setup>
import {computed } from "vue"

const emit = defineEmits(["remove-badge"])


const props = defineProps({
  label: { type: String, required: true },   // public key label (e.g. "language")
  value: { type: String, required: true },   // raw value (e.g. "en" or "-")
})

const displayValue = computed(() => (props.value === "-" ? "No value" : props.value))
</script>

<style scoped>
.filter-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--cc-space-xs) 0;
  color: var(--cc-color-text);
  font-size: var(--cc-font-size-sm);
  margin-right: 0;
  text-transform: capitalize;
}
.filter-badge__label { 
    margin-right: 8px;
}
.filter-badge__value { 
    font-weight: var(--cc-font-weight-regular);
    margin-right: 8px;
}
.filter-badge__close {
  text-align: center;
}
.filter-badge__close:hover {
    background: var(--cc-color-accent);
}

.filter-badge__close::before {
  content: "x";
}

</style>
