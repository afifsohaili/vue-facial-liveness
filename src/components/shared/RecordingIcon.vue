<template>
  <div class="amplify-liveness-recording-icon">
    <div data-testid="rec-icon" style="display: flex; justify-content: center;">
      <svg viewBox="0 0 20 20" width="20" height="20">
        <circle cx="10" cy="10" r="8" fill="red" />
      </svg>
    </div>
    <span style="font-weight: bold;"><slot /></span>
  </div>
</template>

<script setup lang="ts">
</script>
