<template>
  <div class="amplify-liveness-match-indicator" :data-testid="testId">
    <div
      class="amplify-liveness-match-indicator__bar"
      :style="{ '--percentage': `${matchPercentage}%` }"
      role="progressbar"
      aria-label="MatchIndicator"
      :aria-valuenow="percentage"
      :aria-valuetext="`${percentage}% face fit`"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    percentage: number;
    initialPercentage?: number;
    testId?: string;
  }>(),
  {
    initialPercentage: 25,
  }
);

const matchPercentage = ref(props.initialPercentage);

watch(
  () => props.percentage,
  (newVal) => {
    if (newVal < 0) {
      matchPercentage.value = 0;
    } else if (newVal > 100) {
      matchPercentage.value = 100;
    } else {
      matchPercentage.value = newVal;
    }
  },
  { immediate: true }
);
</script>
