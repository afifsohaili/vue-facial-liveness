<template>
  <!-- Checking camera state -->
  <template v-if="isCheckingCamera">
    <div class="amplify-liveness-start-screen-camera-waiting" style="display: flex; justify-content: center;">
      <div class="amplify-liveness-centered-loader amplify-liveness-loader" style="font-size: 2rem;" data-testid="centered-loader" />
      <div
        class="amplify-liveness-start-screen-camera-waiting__text"
        style="font-size: var(--amplify-font-sizes-large); font-weight: var(--amplify-font-weights-bold);"
        data-testid="waiting-camera-permission"
      >
        {{ cameraDisplayText.waitingCameraPermissionText }}
      </div>
    </div>
  </template>

  <template v-else>
    <!-- Photosensitivity Warning (non face-movement challenge) -->
    <div v-if="!isFaceMovementChallenge" :style="{ visibility: isStartView ? 'visible' : 'hidden' }">
      <slot name="photosensitive-warning">
        <div class="amplify-alert amplify-liveness-start-screen-warning" style="z-index: 3;">
          <div style="flex: 1;">
            <div class="amplify-alert__heading">{{ instructionDisplayText.photosensitivityWarningHeadingText }}</div>
            <div class="amplify-alert__body">{{ instructionDisplayText.photosensitivityWarningBodyText }}</div>
          </div>
          <LivenessIconWithPopover
            :label-text="instructionDisplayText.photosensitivityWarningLabelText"
            :heading-text="instructionDisplayText.photosensitivityWarningHeadingText"
          >
            {{ instructionDisplayText.photosensitivityWarningInfoText }}
          </LivenessIconWithPopover>
        </div>
      </slot>
    </div>

    <!-- Centered Loader (initializing) -->
    <div v-if="shouldShowCenteredLoader" class="amplify-liveness-connecting-loader" style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
      <div class="amplify-liveness-loader" style="font-size: 2rem;" data-testid="centered-loader" />
      <div class="amplify-liveness-landscape-error-modal__header">{{ hintDisplayText.hintConnectingText }}</div>
    </div>

    <!-- Camera Module -->
    <div
      :class="[
        'amplify-liveness-camera-module',
        shouldShowFullScreenCamera ? 'amplify-liveness-camera-module--mobile' : '',
      ]"
      :data-testid="testId"
      style="display: flex; flex-direction: column; gap: 0;"
    >
      <!-- Overlay -->
      <div
        :class="[
          'amplify-liveness-overlay',
          'amplify-liveness-instruction-overlay',
        ]"
        :style="{
          alignItems: 'center',
          justifyContent: isRecording && !isFlashingFreshness ? 'flex-start' : 'space-between',
        }"
      >
        <!-- Recording Icon -->
        <div v-if="isRecording" class="amplify-liveness-recording-icon-container">
          <div class="amplify-liveness-recording-icon">
            <div data-testid="rec-icon" style="display: flex; justify-content: center;">
              <svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="8" fill="red" /></svg>
            </div>
            <span style="font-weight: bold;">{{ streamDisplayText.recordingIndicatorText }}</span>
          </div>
        </div>

        <!-- Cancel Button -->
        <div v-if="!isStartView && !isWaitingForCamera && !isCheckSucceeded" class="amplify-liveness-cancel-container">
          <button
            autofocus
            class="amplify-liveness-cancel-button"
            :aria-label="streamDisplayText.cancelLivenessCheckText"
            @click="send({ type: 'CANCEL' })"
          >
            <svg aria-hidden="true" data-testid="close-icon" width="24" height="24" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" />
            </svg>
          </button>
        </div>

        <!-- Hint -->
        <div
          :class="[
            'amplify-liveness-hint',
            shouldShowFullScreenCamera ? 'amplify-liveness-hint--mobile' : '',
          ]"
          style="display: flex; flex-direction: column;"
        >
          <Hint :hint-display-text="hintDisplayText" />
        </div>

        <!-- Error Modal -->
        <div v-if="errorState">
          <div class="amplify-liveness-overlay-opaque">
            <div class="amplify-liveness-toast" aria-labelledby="amplify-liveness-error-heading" aria-describedby="amplify-liveness-error-message" role="alertdialog">
              <div v-if="renderErrorContent">
                <div class="amplify-liveness-error-modal" style="display: flex;">
                  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="var(--amplify-colors-font-error)">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  <div class="amplify-liveness-error-modal__heading" id="amplify-liveness-error-heading">{{ errorHeadingText }}</div>
                </div>
                <div id="amplify-liveness-error-message">{{ errorMessageText }}</div>
              </div>
              <div style="display: flex; justify-content: center;">
                <button class="amplify-button amplify-button--primary" type="button" @click="send({ type: 'CANCEL' })">
                  {{ errorDisplayText.tryAgainText }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Match Indicator -->
        <div v-if="isRecording && !isFlashingFreshness && showMatchIndicatorStates.includes(faceMatchState)">
          <div class="amplify-liveness-match-indicator">
            <div
              class="amplify-liveness-match-indicator__bar"
              :style="{ '--percentage': `${Math.ceil(faceMatchPercentage)}%` }"
              role="progressbar"
              aria-label="MatchIndicator"
              :aria-valuenow="faceMatchPercentage"
              :aria-valuetext="`${Math.ceil(faceMatchPercentage)}% face fit`"
            />
          </div>
        </div>
      </div>

      <!-- Freshness Canvas (hidden) -->
      <canvas
        ref="freshnessColorRef"
        class="amplify-liveness-freshness-canvas"
        style="display: none;"
      />

      <!-- Video Anchor -->
      <div
        class="amplify-liveness-video-anchor"
        :style="{ aspectRatio: `${aspectRatio}` }"
      >
        <video
          ref="videoRef"
          muted
          autoplay
          playsinline
          :width="mediaWidth"
          :height="mediaHeight"
          :class="[
            'amplify-liveness-video',
            isCameraUserFacing ? 'amplify-liveness-video--user-facing' : '',
            isRecordingStopped ? 'amplify-liveness-fade-out' : '',
          ]"
          data-testid="video"
          :aria-label="cameraDisplayText.a11yVideoLabelText"
          @canplay="handleMediaPlay"
          @loadedmetadata="handleLoadedMetadata"
        />

        <!-- Oval Canvas -->
        <div
          :class="[
            'amplify-liveness-oval-canvas',
            shouldShowFullScreenCamera ? 'amplify-liveness-oval-canvas--mobile' : '',
            isRecordingStopped ? 'amplify-liveness-fade-out' : '',
          ]"
          style="display: flex; flex-direction: column;"
        >
          <canvas ref="canvasRef" />
        </div>

        <!-- Camera Selector -->
        <CameraSelector
          v-if="allowDeviceSelection"
          :device-id="selectedDeviceId"
          :devices="selectableDevices"
          @select="onCameraChange"
        />
      </div>
    </div>

    <!-- Start View Button -->
    <div v-if="isStartView" style="display: flex; justify-content: center;">
      <button class="amplify-button amplify-button--primary" type="button" @click="beginLivenessCheck">
        {{ instructionDisplayText.startScreenBeginCheckText }}
      </button>
    </div>
  </template>
</template>

<script lang="ts">
import { createLivenessSelector } from '../composables';

export const selectChallengeType = createLivenessSelector(
  (state: any) => state.context.parsedSessionInformation?.Challenge?.Name
);
export const selectVideoConstraints = createLivenessSelector(
  (state: any) => state.context.videoAssociatedParams?.videoConstraints
);
export const selectVideoStream = createLivenessSelector(
  (state: any) => state.context.videoAssociatedParams?.videoMediaStream
);
export const selectFaceMatchPercentage = createLivenessSelector(
  (state: any) => state.context.faceMatchAssociatedParams?.faceMatchPercentage
);
export const selectFaceMatchState = createLivenessSelector(
  (state: any) => state.context.faceMatchAssociatedParams?.faceMatchState
);
export const selectSelectedDeviceId = createLivenessSelector(
  (state: any) => state.context.videoAssociatedParams?.selectedDeviceId
);
export const selectSelectableDevices = createLivenessSelector(
  (state: any) => state.context.videoAssociatedParams?.selectableDevices
);
</script>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { classNames } from '@aws-amplify/ui';
import { FaceMatchState, clearOvalCanvas, drawStaticOval } from '../service';
import { FACE_MOVEMENT_CHALLENGE } from '../service/utils/constants';
import {
  useLivenessActor,
  useLivenessSelector,
  useMediaStreamInVideo,
} from '../composables';
import { selectErrorState } from './shared/Hint.vue';
import Hint from './shared/Hint.vue';
import CameraSelector from './shared/CameraSelector.vue';
import LivenessIconWithPopover from './shared/LivenessIconWithPopover.vue';
import { LivenessClassNames } from '../types/classNames';
import { isDeviceUserFacing } from '../utils/device';
import type {
  InstructionDisplayText,
  ErrorDisplayText,
  HintDisplayText,
  StreamDisplayText,
  CameraDisplayText,
} from '../displayText';
import type { FaceLivenessDetectorComponents } from './shared/DefaultStartScreenComponents.vue';

const props = defineProps<{
  isMobileScreen: boolean;
  isRecordingStopped: boolean;
  instructionDisplayText: Required<InstructionDisplayText>;
  streamDisplayText: Required<StreamDisplayText>;
  hintDisplayText: Required<HintDisplayText>;
  errorDisplayText: Required<ErrorDisplayText>;
  cameraDisplayText: Required<CameraDisplayText>;
  components?: FaceLivenessDetectorComponents;
  testId?: string;
}>();

const [state, send] = useLivenessActor();

const isFaceMovementChallenge = useLivenessSelector(selectChallengeType) === FACE_MOVEMENT_CHALLENGE.type;
const videoStream = useLivenessSelector(selectVideoStream);
const videoConstraints = useLivenessSelector(selectVideoConstraints);
const selectedDeviceId = useLivenessSelector(selectSelectedDeviceId);
const selectableDevices = useLivenessSelector(selectSelectableDevices);
const faceMatchPercentage = useLivenessSelector(selectFaceMatchPercentage);
const faceMatchState = useLivenessSelector(selectFaceMatchState);
const errorState = useLivenessSelector(selectErrorState);

const { videoRef, videoWidth, videoHeight } = useMediaStreamInVideo(videoStream.value!);

const canvasRef = ref<HTMLCanvasElement | null>(null);
const freshnessColorRef = ref<HTMLCanvasElement | null>(null);
const isCameraReady = ref(false);
const isMetadataLoaded = ref(false);
const isCameraUserFacing = ref(true);

const isInitCamera = computed(() => state.value.matches('initCamera'));
const isInitWebsocket = computed(() => state.value.matches('initWebsocket'));
const isCheckingCamera = computed(() => state.value.matches({ initCamera: 'cameraCheck' }));
const isWaitingForCamera = computed(() => state.value.matches({ initCamera: 'waitForDOMAndCameraDetails' }));
const isStartView = computed(() => state.value.matches('start') || state.value.matches('userCancel'));
const isDetectFaceBeforeStart = computed(() => state.value.matches('detectFaceBeforeStart'));
const isRecording = computed(() => state.value.matches('recording'));
const isCheckSucceeded = computed(() => state.value.matches('checkSucceeded'));
const isFlashingFreshness = computed(() => state.value.matches({ recording: 'flashFreshnessColors' }));

const mediaWidth = ref<number | undefined>(videoWidth.value);
const mediaHeight = ref<number | undefined>(videoHeight.value);
const aspectRatio = ref<number>(videoWidth.value && videoHeight.value ? videoWidth.value / videoHeight.value : 0);

const hasMultipleDevices = computed(() => !!selectableDevices.value?.length && selectableDevices.value.length > 1);
const allowDeviceSelection = computed(
  () => isStartView.value && hasMultipleDevices.value && (!props.isMobileScreen || isFaceMovementChallenge)
);

const shouldShowCenteredLoader = computed(() => isInitCamera.value || isInitWebsocket.value);
const shouldShowFullScreenCamera = computed(
  () => props.isMobileScreen && !isStartView.value && !shouldShowCenteredLoader.value
);

const showMatchIndicatorStates = [
  FaceMatchState.TOO_FAR,
  FaceMatchState.CANT_IDENTIFY,
  FaceMatchState.FACE_IDENTIFIED,
  FaceMatchState.OFF_CENTER,
];

// Camera facing detection
watch(selectedDeviceId, async () => {
  const userFacing = await isDeviceUserFacing(selectedDeviceId.value);
  isCameraUserFacing.value = userFacing;
}, { immediate: true });

// Oval drawing effect
watch([videoRef, videoStream, isStartView, isMetadataLoaded], async () => {
  const shouldDrawOval =
    canvasRef.value &&
    videoRef.value &&
    videoStream.value &&
    isStartView.value &&
    isMetadataLoaded.value;

  if (shouldDrawOval) {
    await nextTick();
    drawStaticOval(canvasRef.value!, videoRef.value!, videoStream.value);
  }
}, { immediate: true });

// Set DOM and camera details
watch(isCameraReady, () => {
  if (isCameraReady.value) {
    send({
      type: 'SET_DOM_AND_CAMERA_DETAILS',
      data: {
        videoEl: videoRef.value,
        canvasEl: canvasRef.value,
        freshnessColorEl: freshnessColorRef.value,
        isMobile: props.isMobileScreen,
      },
    });
  }

  if (videoRef.value) {
    mediaWidth.value = videoRef.value.videoWidth;
    mediaHeight.value = videoRef.value.videoHeight;
    aspectRatio.value = videoRef.value.videoWidth / videoRef.value.videoHeight;
  }
});

// Clear oval canvas when detecting face before start
watch(isDetectFaceBeforeStart, () => {
  if (isDetectFaceBeforeStart.value) {
    clearOvalCanvas({ canvas: canvasRef.value! });
  }
});

// Register the handleMediaPlay and handleLoadedMetadata as regular functions
const handleMediaPlay = () => {
  isCameraReady.value = true;
};

const handleLoadedMetadata = () => {
  isMetadataLoaded.value = true;
};

const beginLivenessCheck = () => {
  send({ type: 'BEGIN' });
};

const onCameraChange = (newDeviceId: string) => {
  const changeCamera = async () => {
    isMetadataLoaded.value = false;
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: {
        ...videoConstraints.value,
        deviceId: { exact: newDeviceId },
      } as MediaTrackConstraints,
      audio: false,
    });
    send({
      type: 'UPDATE_DEVICE_AND_STREAM',
      data: { newDeviceId, newStream },
    });
  };
  changeCamera();
};

// Error modal rendering
const cameraAccessErrors = ['CAMERA_ACCESS_ERROR', 'CAMERA_FRAMERATE_ERROR', 'MOBILE_LANDSCAPE_ERROR'];
const renderErrorContent = computed(() => {
  if (!errorState.value) return false;
  return !cameraAccessErrors.includes(errorState.value);
});

const errorHeadingText = computed(() => {
  if (!errorState.value) return '';
  const map: Record<string, string> = {
    CONNECTION_TIMEOUT: props.errorDisplayText.connectionTimeoutHeaderText,
    TIMEOUT: props.errorDisplayText.timeoutHeaderText,
    FACE_DISTANCE_ERROR: props.errorDisplayText.faceDistanceHeaderText,
    MULTIPLE_FACES_ERROR: props.errorDisplayText.multipleFacesHeaderText,
    RUNTIME_ERROR: props.errorDisplayText.clientHeaderText,
    SERVER_ERROR: props.errorDisplayText.serverHeaderText,
  };
  return map[errorState.value] || props.errorDisplayText.serverHeaderText;
});

const errorMessageText = computed(() => {
  if (!errorState.value) return '';
  const map: Record<string, string> = {
    CONNECTION_TIMEOUT: props.errorDisplayText.connectionTimeoutMessageText,
    TIMEOUT: props.errorDisplayText.timeoutMessageText,
    FACE_DISTANCE_ERROR: props.errorDisplayText.faceDistanceMessageText,
    MULTIPLE_FACES_ERROR: props.errorDisplayText.multipleFacesMessageText,
    RUNTIME_ERROR: props.errorDisplayText.clientMessageText,
    SERVER_ERROR: props.errorDisplayText.serverMessageText,
  };
  return map[errorState.value] || props.errorDisplayText.serverMessageText;
});
</script>
