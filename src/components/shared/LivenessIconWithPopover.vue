<template>
  <div ref="wrapperRef" class="amplify-liveness-popover">
    <button
      id="popover-button"
      :aria-controls="'photosensitivity-description'"
      :aria-expanded="shouldShowPopover"
      role="alertdialog"
      :aria-label="labelText"
      aria-describedby="photosensitivity-description"
      class="amplify-liveness-popover__button"
      data-testid="popover-icon"
      @click="togglePopover"
    >
      <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
    </button>
    <div v-if="shouldShowPopover">
      <div class="amplify-liveness-popover__anchor" />
      <div class="amplify-liveness-popover__anchor-secondary" />
      <div
        :aria-hidden="!shouldShowPopover"
        :aria-label="headingText"
        class="amplify-liveness-popover__container"
        data-testid="popover-text"
        id="photosensitivity-description"
        role="alertdialog"
        :style="{ left: '-108px' }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  headingText: string;
  labelText: string;
}>();

const shouldShowPopover = ref(false);
const wrapperRef = ref<HTMLDivElement | null>(null);

const togglePopover = () => {
  shouldShowPopover.value = !shouldShowPopover.value;
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    shouldShowPopover.value &&
    wrapperRef.value &&
    !wrapperRef.value.contains(event.target as Node)
  ) {
    shouldShowPopover.value = false;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<style scoped>
.amplify-liveness-popover__button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: var(--amplify-colors-font-primary);
  display: flex;
  align-items: center;
}
</style>
