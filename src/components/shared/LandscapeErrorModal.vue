<template>
  <div
    class="amplify-liveness-landscape-error-modal"
    :style="{ height: isLandscape ? 'auto' : '480px' }"
  >
    <div class="amplify-liveness-landscape-error-modal__header">{{ header }}</div>
    <div>{{ isLandscape ? landscapeMessage : portraitMessage }}</div>
    <div v-if="!isLandscape" class="amplify-liveness-landscape-error-modal__button">
      <button class="amplify-button amplify-button--primary" type="button" @click="onRetry">
        {{ tryAgainText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { getLandscapeMediaQuery } from '../../utils/device';

const props = defineProps<{
  onRetry: () => void;
  header: string;
  portraitMessage: string;
  landscapeMessage: string;
  tryAgainText: string;
}>();

const isLandscape = ref<boolean | undefined>(true);

let landscapeMediaQuery: MediaQueryList | null = null;

const updateOrientation = (e: MediaQueryListEvent | MediaQueryList) => {
  isLandscape.value = e.matches;
};

onMounted(() => {
  landscapeMediaQuery = getLandscapeMediaQuery();
  updateOrientation(landscapeMediaQuery);
  landscapeMediaQuery.addEventListener('change', updateOrientation as (e: MediaQueryListEvent) => void);
});

onUnmounted(() => {
  if (landscapeMediaQuery) {
    landscapeMediaQuery.removeEventListener('change', updateOrientation as (e: MediaQueryListEvent) => void);
  }
});
</script>
