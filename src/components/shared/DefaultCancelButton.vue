<template>
  <div class="amplify-liveness-cancel-container">
    <CancelButton :aria-label="cancelLivenessCheckText" />
  </div>
</template>

<script setup lang="ts">
import CancelButton from './CancelButton.vue';

defineProps<{
  cancelLivenessCheckText: string;
}>();
</script>
