<template>
  <slot />
</template>

<script setup lang="ts">
import { createFaceLivenessDetectorProvider } from '../providers';
import type { LivenessInterpreter } from '../service';
import type { FaceLivenessDetectorCoreProps } from '../service/types/liveness';

const props = defineProps<{
  componentProps: FaceLivenessDetectorCoreProps;
  service: LivenessInterpreter;
}>();

createFaceLivenessDetectorProvider({
  componentProps: props.componentProps,
  service: props.service,
});
</script>
