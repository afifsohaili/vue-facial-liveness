<template>
  <div
    class="amplify-liveness-detector-check"
    data-testid="amplify-liveness-detector-check"
    style="display: flex; flex-direction: column; position: relative; gap: var(--amplify-space-xl);"
  >
    <!-- Mobile Landscape Error -->
    <template v-if="errorState === 'MOBILE_LANDSCAPE_ERROR'">
      <div
        style="display: flex; flex-direction: column; text-align: center; align-items: center; justify-content: center; position: absolute; width: 100%; background-color: var(--amplify-colors-background-primary);"
      >
        <LandscapeErrorModal
          :header="landscapeHeaderText"
          :portrait-message="portraitMessageText"
          :landscape-message="landscapeMessageText"
          :try-again-text="tryAgainText"
          :on-retry="handleLandscapeRetry"
        />
      </div>
    </template>

    <!-- Permission Denied -->
    <template v-else-if="isPermissionDenied">
      <div
        style="display: flex; flex-direction: column; text-align: center; align-items: center; justify-content: center; width: 100%; height: 480px; background-color: var(--amplify-colors-background-primary);"
      >
        <div style="font-size: var(--amplify-font-sizes-large); font-weight: var(--amplify-font-weights-bold);">
          {{ errorState === 'CAMERA_FRAMERATE_ERROR' ? cameraMinSpecificationsHeadingText : cameraNotFoundHeadingText }}
        </div>
        <div :style="{ maxWidth: '420px' }">
          {{ errorState === 'CAMERA_FRAMERATE_ERROR' ? cameraMinSpecificationsMessageText : cameraNotFoundMessageText }}
        </div>
        <button class="amplify-button amplify-button--primary" type="button" @click="recheckCameraPermissions">
          {{ retryCameraPermissionsText }}
        </button>
        <div style="position: absolute; top: var(--amplify-space-medium); right: var(--amplify-space-medium);">
          <CancelButton :aria-label="cancelLivenessCheckText" />
        </div>
      </div>
    </template>

    <!-- Default: LivenessCameraModule -->
    <template v-else>
      <LivenessCameraModule
        :is-mobile-screen="isMobile"
        :is-recording-stopped="isRecordingStopped"
        :instruction-display-text="instructionDisplayText"
        :stream-display-text="streamDisplayText"
        :hint-display-text="hintDisplayText"
        :error-display-text="errorDisplayText"
        :camera-display-text="cameraDisplayText"
        :components="components"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { createLivenessSelector } from '../composables';

export const selectIsRecordingStopped = createLivenessSelector(
  (state: any) => state.context.isRecordingStopped
);
</script>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue';
import LandscapeErrorModal from './shared/LandscapeErrorModal.vue';
import CancelButton from './shared/CancelButton.vue';
import LivenessCameraModule from './LivenessCameraModule.vue';
import { useLivenessActor, useLivenessSelector } from '../composables';
import { selectErrorState } from './shared/Hint.vue';
import { LivenessErrorState } from '../service';
import { isMobileScreen, getLandscapeMediaQuery } from '../utils/device';
import { defaultErrorDisplayText } from '../displayText';
import type {
  InstructionDisplayText,
  HintDisplayText,
  CameraDisplayText,
  StreamDisplayText,
  ErrorDisplayText,
} from '../displayText';
import type { FaceLivenessDetectorComponents } from './shared/DefaultStartScreenComponents.vue';

const props = defineProps<{
  instructionDisplayText: Required<InstructionDisplayText>;
  hintDisplayText: Required<HintDisplayText>;
  cameraDisplayText: Required<CameraDisplayText>;
  streamDisplayText: Required<StreamDisplayText>;
  errorDisplayText: Required<ErrorDisplayText>;
  components?: FaceLivenessDetectorComponents;
}>();

const [state, send] = useLivenessActor();
const errorState = useLivenessSelector(selectErrorState);
const isRecordingStopped = useLivenessSelector(selectIsRecordingStopped);

const isPermissionDenied = computed(() => state.value.matches('permissionDenied'));
const isMobile = isMobileScreen();

const {
  cameraMinSpecificationsHeadingText,
  cameraMinSpecificationsMessageText,
  cameraNotFoundHeadingText,
  cameraNotFoundMessageText,
  retryCameraPermissionsText,
} = props.cameraDisplayText;

const { cancelLivenessCheckText } = props.streamDisplayText;

const displayText = computed(() => ({
  ...defaultErrorDisplayText,
  ...props.errorDisplayText,
}));

const { landscapeHeaderText, portraitMessageText, landscapeMessageText, tryAgainText } = displayText.value;

const recheckCameraPermissions = () => {
  send({ type: 'RETRY_CAMERA_CHECK' });
};

const handleLandscapeRetry = () => {
  send({ type: 'CANCEL' });
};

let landscapeMediaQuery: MediaQueryList | null = null;

const sendLandscapeWarning = (isLandscapeMatched: boolean) => {
  if (isLandscapeMatched) {
    send({ type: 'MOBILE_LANDSCAPE_WARNING' });
  }
};

onMounted(() => {
  if (isMobile) {
    landscapeMediaQuery = getLandscapeMediaQuery();
    sendLandscapeWarning(landscapeMediaQuery.matches);
    landscapeMediaQuery.addEventListener('change', (e) => {
      sendLandscapeWarning(e.matches);
    });
  }
});

onBeforeUnmount(() => {
  if (landscapeMediaQuery) {
    landscapeMediaQuery.removeEventListener('change', (e) => {
      sendLandscapeWarning(e.matches);
    });
  }
});
</script>
