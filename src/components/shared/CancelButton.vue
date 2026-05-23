<template>
  <button
    v-if="!isFinalState"
    autofocus
    class="amplify-liveness-cancel-button"
    :aria-label="ariaLabel"
    @click="handleClick"
  >
    <svg aria-hidden="true" data-testid="close-icon" width="24" height="24" viewBox="0 0 24 24">
      <path
        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
        fill="currentColor"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLivenessActor } from '../../composables';

defineProps<{
  ariaLabel: string;
}>();

const [state, send] = useLivenessActor();
const isFinalState = computed(() => state.value.done);

const handleClick = () => {
  send({ type: 'CANCEL' });
};
</script>
