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
import { LivenessErrorState } from '../../service';

// Mock composables at module level to avoid provider dependency
const mockMatches = jest.fn();
const mockSend = jest.fn();
const mockState = {
  matches: mockMatches,
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
const mockActorRef = { value: mockState };

jest.mock('../../composables', () => ({
  useLivenessActor: jest.fn(() => [mockActorRef, mockSend]),
  useLivenessSelector: jest.fn((selector: any) => {
    // Call the selector with mock state to get the appropriate value
    return selector(mockState);
  }),
  createLivenessSelector: jest.fn((selector: any) => selector),
  useMediaStreamInVideo: jest.fn(() => ({
    videoRef: { value: document.createElement('video') },
    videoHeight: { value: 100 },
    videoWidth: { value: 100 },
  })),
}));

import LivenessCheck from '../LivenessCheck.vue';

const {
  hintDisplayText,
  cameraDisplayText,
  streamDisplayText,
  errorDisplayText,
  instructionDisplayText,
} = getDisplayText(undefined);

const {
  cameraMinSpecificationsHeadingText,
  cameraMinSpecificationsMessageText,
  cameraNotFoundHeadingText,
  cameraNotFoundMessageText,
  retryCameraPermissionsText,
} = cameraDisplayText;

const { cancelLivenessCheckText } = streamDisplayText;
const defaultErrorDisplayTextValues = errorDisplayText;
const { landscapeHeaderText, landscapeMessageText } =
  defaultErrorDisplayTextValues;

describe('LivenessCheck', () => {
  const originalUserAgent = navigator.userAgent;

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
  });

  afterAll(() => {
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true,
    });
  });

  beforeEach(() => {
    mockMatches.mockReset();
    mockState.context.errorState = undefined;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mountLivenessCheck = (userAgent?: string) => {
    if (userAgent) {
      Object.defineProperty(navigator, 'userAgent', {
        value: userAgent,
        configurable: true,
      });
    }
    return mount(LivenessCheck, {
      props: {
        hintDisplayText,
        cameraDisplayText,
        streamDisplayText,
        errorDisplayText,
        instructionDisplayText,
      },
      global: {
        stubs: {
          'liveness-camera-module': {
            name: 'LivenessCameraModule',
            template: '<div>LivenessCameraModule</div>',
          },
          'cancel-button': {
            name: 'CancelButton',
            template:
              '<button :aria-label="ariaLabel">{{ ariaLabel }}</button>',
            props: ['ariaLabel'],
          },
          'landscape-error-modal': {
            name: 'LandscapeErrorModal',
            template:
              '<div><div>{{ header }}</div><div>{{ landscapeMessage }}</div></div>',
            props: [
              'header',
              'portraitMessage',
              'landscapeMessage',
              'tryAgainText',
            ],
          },
        },
      },
    });
  };

  it('should render the component content on desktop with permissionDenied true', () => {
    mockMatches.mockReturnValue(true);

    const wrapper = mountLivenessCheck();

    expect(wrapper.text()).toContain(cancelLivenessCheckText);
    expect(wrapper.text()).toContain(cameraNotFoundHeadingText);
    expect(wrapper.text()).toContain(cameraNotFoundMessageText);
    expect(wrapper.text()).toContain(retryCameraPermissionsText);
    expect(wrapper.text()).not.toContain('LivenessCameraModule');
  });

  it('should render the component content on desktop when no 15 fps camera is found', () => {
    mockMatches.mockReturnValue(true);
    mockState.context.errorState = LivenessErrorState.CAMERA_FRAMERATE_ERROR;

    const wrapper = mountLivenessCheck();

    expect(wrapper.text()).toContain(cancelLivenessCheckText);
    expect(wrapper.text()).toContain(cameraMinSpecificationsHeadingText);
    expect(wrapper.text()).toContain(cameraMinSpecificationsMessageText);
    expect(wrapper.text()).not.toContain('LivenessCameraModule');
  });

  it('should render the component content on mobile with permissionDenied false', () => {
    mockMatches.mockReturnValue(false);

    const wrapper = mountLivenessCheck(
      'Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36'
    );

    expect(wrapper.text()).not.toContain(cameraNotFoundHeadingText);
    expect(wrapper.text()).toContain('LivenessCameraModule');
  });

  it('should render the component content for mobile landscape errors', () => {
    mockMatches.mockReturnValue(true);
    mockState.context.errorState = LivenessErrorState.MOBILE_LANDSCAPE_ERROR;
    // Mock landscape media query
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: query.includes('landscape'),
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })) as any;

    const wrapper = mountLivenessCheck(
      'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36'
    );

    expect(wrapper.text()).toContain(landscapeHeaderText);
    expect(wrapper.text()).toContain(landscapeMessageText);
    expect(wrapper.text()).not.toContain('LivenessCameraModule');
  });
});
