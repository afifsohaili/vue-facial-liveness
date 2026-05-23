<template>
  <div class="amplify-alert amplify-liveness-start-screen-warning" style="z-index: 3;">
    <div style="flex: 1;">
      <div class="amplify-alert__heading">{{ headingText }}</div>
      <div class="amplify-alert__body">{{ bodyText }}</div>
    </div>
    <LivenessIconWithPopover :label-text="labelText" :heading-text="headingText">
      {{ infoText }}
    </LivenessIconWithPopover>
  </div>
</template>

<script setup lang="ts">
import LivenessIconWithPopover from './LivenessIconWithPopover.vue';

defineProps<{
  bodyText: string;
  headingText: string;
  infoText: string;
  labelText: string;
}>();
</script>
