import {
  describe,
  it,
  expect,
  jest,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
} from '@jest/globals';
import { mount } from '@vue/test-utils';
import { getDisplayText } from '../../displayText';
import { FaceMatchState } from '../../service';
import { LivenessClassNames } from '../../types/classNames';

// Shared mutable state for mock configuration
const mockState = {
  matches: jest.fn(),
  context: {
    errorState: undefined,
    faceMatchAssociatedParams: {
      faceMatchState: undefined,
      illuminationState: undefined,
      faceMatchPercentage: undefined,
    },
    faceMatchStateBeforeStart: undefined,
    isFaceFarEnoughBeforeRecording: undefined,
    isRecordingStopped: undefined,
    videoAssociatedParams: {
      videoConstraints: undefined,
      videoMediaStream: undefined,
      selectedDeviceId: undefined,
      selectableDevices: [],
    },
  },
  value: {},
};
const mockSend = jest.fn();
const mockActorRef = { value: mockState };
const mockSelectorImpl = { fn: null as ((sel: any) => any) | null };

jest.mock('../../composables', () => {
  const { computed } = require('vue');
  return {
    useLivenessActor: jest.fn(() => [mockActorRef, mockSend]),
    useLivenessSelector: jest.fn((selector: any) => {
      if (mockSelectorImpl.fn) {
        return mockSelectorImpl.fn(selector);
      }
      try {
        return computed(() => selector(mockState));
      } catch {
        return computed(() => undefined);
      }
    }),
    createLivenessSelector: jest.fn((selector: any) => selector),
    useMediaStreamInVideo: jest.fn((_stream: any) => ({
      videoRef: { value: document.createElement('video') },
      videoHeight: { value: 100 },
      videoWidth: { value: 100 },
    })),
  };
});

import LivenessCameraModule from '../LivenessCameraModule.vue';
import { isDeviceUserFacing } from '../../utils/device';

const {
  hintDisplayText,
  streamDisplayText,
  errorDisplayText,
  cameraDisplayText,
  instructionDisplayText,
} = getDisplayText(undefined);
const { cancelLivenessCheckText, recordingIndicatorText } = streamDisplayText;

// Helper to setup state matches
let isCheckingCamera = false;
let isNotRecording = false;
let isRecording = false;
let isStart = false;
let isInitCamera = false;
let isInitWebsocket = false;
let isWaitingForCamera = false;

function setupStateMatches() {
  mockState.matches.mockImplementation((matcher: any) => {
    if (typeof matcher === 'string') {
      if (matcher === 'initCamera') return isInitCamera;
      if (matcher === 'initWebsocket') return isInitWebsocket;
      if (matcher === 'start') return isStart;
      if (matcher === 'userCancel') return false;
      if (matcher === 'notRecording') return isNotRecording;
      if (matcher === 'recording') return isRecording;
      if (matcher === 'checkSucceeded') return false;
      if (matcher === 'detectFaceBeforeStart') return false;
      if (matcher === 'waitForDOMAndCameraDetails') return false;
    }
    if (typeof matcher === 'object' && matcher !== null) {
      if (matcher.initCamera === 'cameraCheck') return isCheckingCamera;
      if (matcher.initCamera === 'waitForDOMAndCameraDetails')
        return isWaitingForCamera;
      if (matcher.recording === 'flashFreshnessColors') return false;
    }
    return false;
  });
}

describe('LivenessCameraModule', () => {
  beforeAll(() => {
    // Mock matchMedia
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })) as any;

    // Mock navigator.mediaDevices
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: jest.fn().mockResolvedValue({
          getTracks: () => [],
          getVideoTracks: () => [],
        }),
        enumerateDevices: jest.fn().mockResolvedValue([
          {
            deviceId: '123',
            kind: 'videoinput',
            label: 'Front Camera',
            groupId: '',
          },
          {
            deviceId: '456',
            kind: 'videoinput',
            label: 'Back Camera',
            groupId: '',
          },
        ]),
      },
      writable: true,
      configurable: true,
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    isCheckingCamera = false;
    isNotRecording = false;
    isRecording = false;
    isStart = false;
    isInitCamera = false;
    isInitWebsocket = false;
    isWaitingForCamera = false;
    mockState.context.faceMatchAssociatedParams.faceMatchState = undefined;
    mockState.context.faceMatchAssociatedParams.faceMatchPercentage = undefined;
    mockState.context.videoAssociatedParams.selectableDevices = [];
    mockState.context.videoAssociatedParams.selectedDeviceId = undefined;
    mockState.context.videoAssociatedParams.videoMediaStream = undefined;
    mockState.context.videoAssociatedParams.videoConstraints = undefined;
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mountCameraModule = () => {
    return mount(LivenessCameraModule, {
      props: {
        isMobileScreen: false,
        isRecordingStopped: false,
        hintDisplayText,
        streamDisplayText,
        errorDisplayText,
        cameraDisplayText,
        instructionDisplayText,
      },
      global: {
        stubs: {
          'cancel-button': {
            name: 'CancelButton',
            template:
              '<button :aria-label="ariaLabel">{{ ariaLabel }}</button>',
            props: ['ariaLabel'],
          },
          hint: {
            name: 'Hint',
            template: '<div>Hint</div>',
          },
          'camera-selector': {
            name: 'CameraSelector',
            template:
              '<div><select :value="deviceId" data-testid="amplify-liveness-camera-select" @change="$emit(\'select\', ($event.target as HTMLSelectElement).value)"><option v-for="d in devices" :key="d.deviceId" :value="d.deviceId">{{ d.label }}</option></select></div>',
            props: ['deviceId', 'devices'],
            emits: ['select'],
          },
          'liveness-icon-with-popover': {
            name: 'LivenessIconWithPopover',
            template:
              '<div><button data-testid="popover-icon" @click="$emit(\'toggle\')">i</button><slot /></div>',
          },
          'match-indicator': {
            name: 'MatchIndicator',
            template:
              '<div class="amplify-liveness-match-indicator" data-testid="match-indicator"><div class="amplify-liveness-match-indicator__bar" :style="{ width: percentage + \'%\' }"></div></div>',
            props: ['percentage'],
          },
        },
      },
    });
  };

  it('should render centered loader when isInitCamera true', async () => {
    isInitCamera = true;
    setupStateMatches();

    const wrapper = mountCameraModule();
    expect(wrapper.find('[data-testid="centered-loader"]').exists()).toBe(true);
  });

  it('should render centered loader when isInitWebsocket true', async () => {
    isInitWebsocket = true;
    setupStateMatches();

    const wrapper = mountCameraModule();
    expect(wrapper.find('[data-testid="centered-loader"]').exists()).toBe(true);
  });

  it('should render recording icon when isRecording true', async () => {
    isRecording = true;
    setupStateMatches();

    const wrapper = mountCameraModule();
    expect(wrapper.find('[data-testid="rec-icon"]').exists()).toBe(true);
    expect(wrapper.text()).toContain(recordingIndicatorText);
  });

  it('should render MatchIndicator when isRecording and faceMatchState is TOO_FAR', async () => {
    isRecording = true;
    setupStateMatches();
    mockState.context.faceMatchAssociatedParams.faceMatchState =
      FaceMatchState.TOO_FAR;
    mockState.context.faceMatchAssociatedParams.faceMatchPercentage = 25;

    const wrapper = mountCameraModule();
    const matchIndicator = wrapper.findAll('.amplify-liveness-match-indicator');
    expect(matchIndicator.length).toBe(1);
  });

  it('should render MatchIndicator when isRecording and faceMatchState is CANT_IDENTIFY', async () => {
    isRecording = true;
    setupStateMatches();
    mockState.context.faceMatchAssociatedParams.faceMatchState =
      FaceMatchState.CANT_IDENTIFY;
    mockState.context.faceMatchAssociatedParams.faceMatchPercentage = 25;

    const wrapper = mountCameraModule();
    const matchIndicator = wrapper.findAll('.amplify-liveness-match-indicator');
    expect(matchIndicator.length).toBe(1);
  });

  it('should render MatchIndicator when isRecording and faceMatchState is FACE_IDENTIFIED', async () => {
    isRecording = true;
    setupStateMatches();
    mockState.context.faceMatchAssociatedParams.faceMatchState =
      FaceMatchState.FACE_IDENTIFIED;
    mockState.context.faceMatchAssociatedParams.faceMatchPercentage = 25;

    const wrapper = mountCameraModule();
    const matchIndicator = wrapper.findAll('.amplify-liveness-match-indicator');
    expect(matchIndicator.length).toBe(1);
  });

  it('should not render MatchIndicator when isRecording and faceMatchState is MATCHED', async () => {
    isRecording = true;
    setupStateMatches();
    mockState.context.faceMatchAssociatedParams.faceMatchState =
      FaceMatchState.MATCHED;
    mockState.context.faceMatchAssociatedParams.faceMatchPercentage = 25;

    const wrapper = mountCameraModule();
    const matchIndicator = wrapper.findAll('.amplify-liveness-match-indicator');
    expect(matchIndicator.length).toBe(0);
  });

  it('should not render MatchIndicator when isRecording and faceMatchState is TOO_MANY', async () => {
    isRecording = true;
    setupStateMatches();
    mockState.context.faceMatchAssociatedParams.faceMatchState =
      FaceMatchState.TOO_MANY;
    mockState.context.faceMatchAssociatedParams.faceMatchPercentage = 25;

    const wrapper = mountCameraModule();
    const matchIndicator = wrapper.findAll('.amplify-liveness-match-indicator');
    expect(matchIndicator.length).toBe(0);
  });

  it('should render photosensitivity warning', async () => {
    isNotRecording = true;
    setupStateMatches();

    const wrapper = mountCameraModule();
    expect(wrapper.text()).toContain('Photosensitivity warning');
  });

  it('should show a full screen camera on mobile', async () => {
    setupStateMatches();

    const wrapper = mount(LivenessCameraModule, {
      props: {
        isMobileScreen: true,
        isRecordingStopped: false,
        hintDisplayText,
        streamDisplayText,
        errorDisplayText,
        cameraDisplayText,
        instructionDisplayText,
        testId: 'cameraModule',
      },
      global: {
        stubs: {
          'cancel-button': true,
          hint: true,
          'camera-selector': true,
        },
      },
    });

    const cameraModule = wrapper.find('[data-testid="cameraModule"]');
    // The mobile class should be applied
    expect(cameraModule.classes()).toContain(
      'amplify-liveness-camera-module--mobile'
    );
  });

  it('should selectors work with state context', () => {
    // Direct selector function tests
    const { createLivenessSelector } = require('../../composables');

    const selectVideoConstraints = createLivenessSelector(
      (state: any) => state.context.videoAssociatedParams?.videoConstraints
    );
    const selectVideoStream = createLivenessSelector(
      (state: any) => state.context.videoAssociatedParams?.videoMediaStream
    );
    const selectFaceMatchPercentage = createLivenessSelector(
      (state: any) =>
        state.context.faceMatchAssociatedParams?.faceMatchPercentage
    );
    const selectSelectedDeviceId = createLivenessSelector(
      (state: any) => state.context.videoAssociatedParams?.selectedDeviceId
    );
    const selectSelectableDevices = createLivenessSelector(
      (state: any) => state.context.videoAssociatedParams?.selectableDevices
    );
    const selectFaceMatchState = createLivenessSelector(
      (state: any) => state.context.faceMatchAssociatedParams?.faceMatchState
    );

    const testState: any = {
      context: {
        videoAssociatedParams: {
          videoConstraints: { width: 100 },
          videoMediaStream: { getTracks: () => [] },
          selectedDeviceId: 'foobar',
          selectableDevices: ['foobar'],
        },
        faceMatchAssociatedParams: {
          faceMatchPercentage: 100,
          faceMatchState: FaceMatchState.MATCHED,
        },
      },
    };

    expect(selectVideoConstraints(testState)).toEqual({ width: 100 });
    expect(selectVideoStream(testState)).toEqual({
      getTracks: expect.any(Function),
    });
    expect(selectFaceMatchPercentage(testState)).toEqual(100);
    expect(selectSelectedDeviceId(testState)).toEqual('foobar');
    expect(selectSelectableDevices(testState)).toEqual(['foobar']);
    expect(selectFaceMatchState(testState)).toEqual(FaceMatchState.MATCHED);
  });

  it('should selectors work with undefined values', () => {
    const { createLivenessSelector } = require('../../composables');

    const selectVideoConstraints = createLivenessSelector(
      (state: any) => state.context.videoAssociatedParams?.videoConstraints
    );
    const selectVideoStream = createLivenessSelector(
      (state: any) => state.context.videoAssociatedParams?.videoMediaStream
    );
    const selectFaceMatchPercentage = createLivenessSelector(
      (state: any) =>
        state.context.faceMatchAssociatedParams?.faceMatchPercentage
    );

    const emptyState: any = { context: {} };

    expect(selectVideoConstraints(emptyState)).toBeUndefined();
    expect(selectVideoStream(emptyState)).toBeUndefined();
    expect(selectFaceMatchPercentage(emptyState)).toBeUndefined();
  });

  it('selectors in template should work with empty context', () => {
    // Test that the component renders without crashing when selectors return undefined
    isStart = true;
    setupStateMatches();

    const wrapper = mountCameraModule();
    expect(wrapper.exists()).toBe(true);
  });
});
