<template>
  <div
    :class="[
      'amplify-liveness-toast',
      `amplify-liveness-toast--${variation}`,
      `amplify-liveness-toast--${size}`,
    ]"
    :style="isInitial ? { backgroundColor: 'var(--amplify-colors-background-primary)' } : {}"
    v-bind="$attrs"
  >
    <div class="amplify-liveness-toast__container">
      <div
        class="amplify-liveness-toast__message"
        :style="isInitial ? { color: 'var(--amplify-colors-font-primary)' } : {}"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variation?: 'default' | 'primary' | 'error';
    size?: 'medium' | 'large';
    isInitial?: boolean;
  }>(),
  {
    variation: 'default',
    size: 'medium',
    isInitial: false,
  }
);
</script>
