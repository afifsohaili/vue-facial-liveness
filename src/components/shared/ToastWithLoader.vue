<template>
  <div class="amplify-liveness-toast amplify-liveness-toast--default amplify-liveness-toast--medium" aria-live="polite">
    <div class="amplify-liveness-toast__container">
      <div class="amplify-liveness-hint__text">
        <div class="amplify-liveness-loader" />
        <div>{{ displayText }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  displayText: string;
}>();
</script>
