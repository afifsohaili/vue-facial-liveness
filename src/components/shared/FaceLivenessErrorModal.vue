<template>
  <div class="amplify-liveness-overlay-opaque">
    <div
      class="amplify-liveness-toast"
      :aria-labelledby="'amplify-liveness-error-heading'"
      :aria-describedby="'amplify-liveness-error-message'"
      role="alertdialog"
    >
      <slot />
      <div style="display: flex; justify-content: center;">
        <button class="amplify-button amplify-button--primary" type="button" @click="onRetry">
          {{ tryAgainText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ErrorDisplayText } from '../../displayText';
import { defaultErrorDisplayText } from '../../displayText';

const props = defineProps<{
  onRetry: () => void;
  displayText?: Partial<ErrorDisplayText>;
}>();

const displayText = computed(() => ({
  ...defaultErrorDisplayText,
  ...props.displayText,
}));

const tryAgainText = computed(() => displayText.value.tryAgainText);
</script>
