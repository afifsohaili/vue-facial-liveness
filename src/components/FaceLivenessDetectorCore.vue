<template>
  <div class="liveness-detector" data-testid="liveness-detector">
    <FaceLivenessDetectorProvider :component-props="props" :service="service">
      <div ref="currElementRef" style="display: flex; flex-direction: column;">
        <LivenessCheck
          :instruction-display-text="instructionDisplayText"
          :hint-display-text="hintDisplayText"
          :camera-display-text="cameraDisplayText"
          :stream-display-text="streamDisplayText"
          :error-display-text="errorDisplayText"
          :components="props.components"
        />
      </div>
    </FaceLivenessDetectorProvider>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useInterpret } from '@xstate/vue';
import { livenessMachine } from '../service';
import FaceLivenessDetectorProvider from './FaceLivenessDetectorProvider.vue';
import LivenessCheck from './LivenessCheck.vue';
import { getDisplayText } from '../displayText';

// Props inlined to avoid Vue SFC compiler issue with imported types
interface FaceLivenessDetectorCoreProps {
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
    endpointOverride?: string;
    systemClockOffset?: number;
  };
  components?: any;
  displayText?: any;
}

const props = defineProps<FaceLivenessDetectorCoreProps>();

const currElementRef = ref<HTMLDivElement | null>(null);

const {
  hintDisplayText,
  cameraDisplayText,
  instructionDisplayText,
  streamDisplayText,
  errorDisplayText,
} = getDisplayText(props.displayText);

const service = useInterpret(livenessMachine, {
  devTools: process.env.NODE_ENV === 'development',
  context: {
    componentProps: {
      ...props,
      config: props.config ?? {},
    },
  },
});
</script>
