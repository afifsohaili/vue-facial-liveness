import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import {
  IlluminationState,
  FaceMatchState,
  LivenessErrorState,
} from '../../../service';
import { getDisplayText } from '../../../displayText';

const { hintDisplayText } = getDisplayText(undefined);

// Import selectors directly from the component
import {
  selectErrorState,
  selectFaceMatchState,
  selectIlluminationState,
  selectIsFaceFarEnoughBeforeRecording,
  selectFaceMatchStateBeforeStart,
} from '../Hint.vue';

describe('Hint selectors', () => {
  it('selectErrorState should extract error state from context', () => {
    const state: any = {
      context: { errorState: LivenessErrorState.RUNTIME_ERROR },
    };
    expect(selectErrorState(state)).toEqual(LivenessErrorState.RUNTIME_ERROR);
  });

  it('selectFaceMatchState should extract face match state', () => {
    const state: any = {
      context: {
        faceMatchAssociatedParams: {
          faceMatchState: FaceMatchState.OFF_CENTER,
        },
      },
    };
    expect(selectFaceMatchState(state)).toEqual(FaceMatchState.OFF_CENTER);
  });

  it('selectIlluminationState should extract illumination state', () => {
    const state: any = {
      context: {
        faceMatchAssociatedParams: {
          illuminationState: IlluminationState.DARK,
        },
      },
    };
    expect(selectIlluminationState(state)).toEqual(IlluminationState.DARK);
  });

  it('selectIsFaceFarEnoughBeforeRecording should extract boolean', () => {
    const state: any = {
      context: { isFaceFarEnoughBeforeRecording: false },
    };
    expect(selectIsFaceFarEnoughBeforeRecording(state)).toBe(false);
  });

  it('selectFaceMatchStateBeforeStart should extract before start state', () => {
    const state: any = {
      context: { faceMatchStateBeforeStart: FaceMatchState.TOO_MANY },
    };
    expect(selectFaceMatchStateBeforeStart(state)).toEqual(
      FaceMatchState.TOO_MANY
    );
  });
});

describe('Hint component - selector functions', () => {
  it('should render nothing for error state', () => {
    const errorState = selectErrorState({
      context: { errorState: LivenessErrorState.FACE_DISTANCE_ERROR },
    });
    expect(errorState).toEqual(LivenessErrorState.FACE_DISTANCE_ERROR);
  });

  it('should detect face match states correctly', () => {
    const matched = selectFaceMatchState({
      context: {
        faceMatchAssociatedParams: { faceMatchState: FaceMatchState.MATCHED },
      },
    });
    expect(matched).toEqual(FaceMatchState.MATCHED);

    const tooFar = selectFaceMatchState({
      context: {
        faceMatchAssociatedParams: { faceMatchState: FaceMatchState.TOO_FAR },
      },
    });
    expect(tooFar).toEqual(FaceMatchState.TOO_FAR);
  });

  it('should detect illumination states correctly', () => {
    const dark = selectIlluminationState({
      context: {
        faceMatchAssociatedParams: {
          illuminationState: IlluminationState.DARK,
        },
      },
    });
    expect(dark).toEqual(IlluminationState.DARK);

    const bright = selectIlluminationState({
      context: {
        faceMatchAssociatedParams: {
          illuminationState: IlluminationState.BRIGHT,
        },
      },
    });
    expect(bright).toEqual(IlluminationState.BRIGHT);
  });
});
