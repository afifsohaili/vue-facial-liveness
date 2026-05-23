<template>
  <div
    :class="['amplify-liveness-overlay', className]"
    :style="{
      alignItems: horizontal === 'center' ? 'center' : horizontal === 'start' ? 'flex-start' : 'flex-end',
      justifyContent: vertical === 'center' ? 'center' : vertical === 'start' ? 'flex-start' : vertical === 'end' ? 'flex-end' : 'space-between',
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    horizontal?: 'start' | 'center' | 'end';
    vertical?: 'start' | 'center' | 'end' | 'space-between';
    className?: string;
  }>(),
  {
    horizontal: 'center',
    vertical: 'center',
    className: '',
  }
);
</script>
