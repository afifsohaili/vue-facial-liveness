<template>
  <FaceLivenessDetectorCore v-bind="coreProps" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { fetchAuthSession } from 'aws-amplify/auth';
import FaceLivenessDetectorCore from './FaceLivenessDetectorCore.vue';

// Props inlined to avoid Vue SFC compiler issue with imported types
interface FaceLivenessDetectorProps {
  region: string;
  sessionId: string;
  onAnalysisComplete: (result: any) => void;
  onUserCancel?: () => void;
  onError?: (error: any) => void;
  disableStartScreen?: boolean;
  config?: {
    deviceId?: string;
    binaryPath?: string;
    faceModelUrl?: string;
    credentialProvider?: () => Promise<any>;
  };
  components?: any;
  displayText?: any;
}

const props = defineProps<FaceLivenessDetectorProps>();

const credentialProvider = async () => {
  const { credentials } = await fetchAuthSession();
  if (!credentials) {
    throw new Error('No credentials provided');
  }
  return credentials;
};

const coreProps = computed(() => {
  const { config, ...rest } = props as any;
  return {
    ...rest,
    config: { credentialProvider, ...config },
  };
});
</script>
