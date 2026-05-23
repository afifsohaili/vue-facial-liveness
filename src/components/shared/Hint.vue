<template>
  <!-- Start view -->
  <template v-if="isStartView">
    <div aria-live="polite" style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;" role="alert">
      {{ hintDisplayText.hintCenterFaceInstructionText }}
    </div>
    <div
      class="amplify-liveness-toast amplify-liveness-toast--primary amplify-liveness-toast--large"
      :style="{ backgroundColor: 'var(--amplify-colors-background-primary)' }"
    >
      <div class="amplify-liveness-toast__container">
        <div class="amplify-liveness-toast__message" :style="{ color: 'var(--amplify-colors-font-primary)' }">
          <div aria-live="assertive">{{ hintDisplayText.hintCenterFaceText }}</div>
        </div>
      </div>
    </div>
  </template>

  <!-- Error or check completed states - render nothing -->
  <template v-else-if="errorState || isCheckFailed || isCheckSuccessful"></template>

  <!-- Pre-recording states -->
  <template v-else-if="!isRecording">
    <!-- Face detection before start -->
    <template v-if="isCheckFaceDetectedBeforeStart">
      <template v-if="faceMatchStateBeforeStart === 'TOO MANY FACES'">
        <div class="amplify-liveness-toast amplify-liveness-toast--primary amplify-liveness-toast--large">
          <div class="amplify-liveness-toast__container">
            <div class="amplify-liveness-toast__message">
              <div aria-live="assertive">{{ hintDisplayText.hintTooManyFacesText }}</div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="amplify-liveness-toast amplify-liveness-toast--primary amplify-liveness-toast--large">
          <div class="amplify-liveness-toast__container">
            <div class="amplify-liveness-toast__message">
              <div aria-live="assertive">{{ hintDisplayText.hintMoveFaceFrontOfCameraText }}</div>
            </div>
          </div>
        </div>
      </template>
    </template>

    <!-- Face distance check -->
    <template v-else-if="isCheckFaceDistanceBeforeRecording && isFaceFarEnoughBeforeRecordingState === false">
      <div class="amplify-liveness-toast amplify-liveness-toast--primary amplify-liveness-toast--large">
        <div class="amplify-liveness-toast__container">
          <div class="amplify-liveness-toast__message">
            <div aria-live="assertive">{{ hintDisplayText.hintTooCloseText }}</div>
          </div>
        </div>
      </div>
    </template>

    <!-- Uploading state -->
    <template v-else-if="isUploading">
      <div aria-live="polite" style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;">
        {{ hintDisplayText.hintCheckCompleteText }}
      </div>
      <div class="amplify-liveness-toast amplify-liveness-toast--default amplify-liveness-toast--medium" aria-live="polite">
        <div class="amplify-liveness-toast__container">
          <div class="amplify-liveness-toast__message">
            <div class="amplify-liveness-hint__text">
              <div class="amplify-liveness-loader" />
              <div>{{ hintDisplayText.hintVerifyingText }}</div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Illumination warning -->
    <template v-else-if="illuminationState && illuminationState !== 'normal'">
      <div class="amplify-liveness-toast amplify-liveness-toast--primary amplify-liveness-toast--large">
        <div class="amplify-liveness-toast__container">
          <div class="amplify-liveness-toast__message">
            <div aria-live="assertive">{{ illuminationStateStringMap[illuminationState] }}</div>
          </div>
        </div>
      </div>
    </template>
  </template>

  <!-- Recording - flashing freshness -->
  <template v-else-if="isFlashingFreshness">
    <div class="amplify-liveness-toast amplify-liveness-toast--primary amplify-liveness-toast--large">
      <div class="amplify-liveness-toast__container">
        <div class="amplify-liveness-toast__message">
          <div aria-live="assertive">{{ hintDisplayText.hintHoldFaceForFreshnessText }}</div>
        </div>
      </div>
    </div>
  </template>

  <!-- Recording - face matching -->
  <template v-else-if="isRecording && !isFlashingFreshness">
    <div class="amplify-liveness-toast amplify-liveness-toast--primary amplify-liveness-toast--large">
      <div class="amplify-liveness-toast__container">
        <div class="amplify-liveness-toast__message">
          <div
            aria-live="polite"
            style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;"
          >
            {{ a11yHintString }}
          </div>
          <div :aria-label="a11yHintString">{{ resultHintString }}</div>
        </div>
      </div>
    </div>
  </template>
</template>

<script lang="ts">
import { createLivenessSelector } from '../../composables';

export const selectErrorState = createLivenessSelector(
  (state: any) => state.context.errorState
);
export const selectFaceMatchState = createLivenessSelector(
  (state: any) => state.context.faceMatchAssociatedParams!.faceMatchState
);
export const selectIlluminationState = createLivenessSelector(
  (state: any) => state.context.faceMatchAssociatedParams!.illuminationState
);
export const selectIsFaceFarEnoughBeforeRecording = createLivenessSelector(
  (state: any) => state.context.isFaceFarEnoughBeforeRecording
);
export const selectFaceMatchStateBeforeStart = createLivenessSelector(
  (state: any) => state.context.faceMatchStateBeforeStart
);
const selectFaceMatchPercentage = createLivenessSelector(
  (state: any) => state.context.faceMatchAssociatedParams?.faceMatchPercentage
);
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { useLivenessActor, useLivenessSelector } from '../../composables';
import type { HintDisplayText } from '../../displayText';
import { FaceMatchState, IlluminationState } from '../../service';

const props = defineProps<{
  hintDisplayText: Required<HintDisplayText>;
}>();

const [state] = useLivenessActor();

const errorState = useLivenessSelector(selectErrorState);
const faceMatchState = useLivenessSelector(selectFaceMatchState);
const illuminationState = useLivenessSelector(selectIlluminationState);
const faceMatchStateBeforeStart = useLivenessSelector(selectFaceMatchStateBeforeStart);
const isFaceFarEnoughBeforeRecordingState = useLivenessSelector(selectIsFaceFarEnoughBeforeRecording);
const faceMatchPercentage = useLivenessSelector(selectFaceMatchPercentage);

const isCheckFaceDetectedBeforeStart = computed(
  () => state.value.matches('checkFaceDetectedBeforeStart') || state.value.matches('detectFaceBeforeStart')
);
const isCheckFaceDistanceBeforeRecording = computed(
  () => state.value.matches('checkFaceDistanceBeforeRecording') || state.value.matches('detectFaceDistanceBeforeRecording')
);
const isStartView = computed(() => state.value.matches('start') || state.value.matches('userCancel'));
const isRecording = computed(() => state.value.matches('recording'));
const isUploading = computed(() => state.value.matches('uploading'));
const isCheckSuccessful = computed(() => state.value.matches('checkSucceeded'));
const isCheckFailed = computed(() => state.value.matches('checkFailed'));
const isFlashingFreshness = computed(() => state.value.matches({ recording: 'flashFreshnessColors' }));

const FaceMatchStateStringMap: Record<string, string | undefined> = {
  [FaceMatchState.CANT_IDENTIFY]: props.hintDisplayText.hintCanNotIdentifyText,
  [FaceMatchState.FACE_IDENTIFIED]: props.hintDisplayText.hintTooFarText,
  [FaceMatchState.TOO_MANY]: props.hintDisplayText.hintTooManyFacesText,
  [FaceMatchState.TOO_FAR]: props.hintDisplayText.hintTooFarText,
  [FaceMatchState.MATCHED]: props.hintDisplayText.hintHoldFaceForFreshnessText,
  [FaceMatchState.OFF_CENTER]: props.hintDisplayText.hintFaceOffCenterText,
};

const illuminationStateStringMap: Record<string, string> = {
  [IlluminationState.BRIGHT]: props.hintDisplayText.hintIlluminationTooBrightText,
  [IlluminationState.DARK]: props.hintDisplayText.hintIlluminationTooDarkText,
  [IlluminationState.NORMAL]: props.hintDisplayText.hintIlluminationNormalText,
};

const resultHintString = computed(() => {
  if (faceMatchState.value === FaceMatchState.MATCHED) {
    return FaceMatchStateStringMap[faceMatchState.value] ?? props.hintDisplayText.hintTooFarText;
  }
  return props.hintDisplayText.hintTooFarText;
});

const a11yHintString = computed(() => {
  if (faceMatchState.value === FaceMatchState.OFF_CENTER) {
    return FaceMatchStateStringMap[faceMatchState.value] ?? resultHintString.value;
  }
  if (
    faceMatchState.value === FaceMatchState.TOO_FAR &&
    (faceMatchPercentage.value ?? 0) > 50
  ) {
    return props.hintDisplayText.hintMatchIndicatorText;
  }
  return resultHintString.value;
});
</script>
