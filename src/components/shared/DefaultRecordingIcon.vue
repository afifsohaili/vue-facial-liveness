<template>
  <div class="amplify-liveness-recording-icon-container">
    <RecordingIcon>{{ recordingIndicatorText }}</RecordingIcon>
  </div>
</template>

<script setup lang="ts">
import RecordingIcon from './RecordingIcon.vue';

defineProps<{
  recordingIndicatorText: string;
}>();
</script>
