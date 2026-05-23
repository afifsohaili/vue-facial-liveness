import { describe, it, expect, jest, beforeAll } from '@jest/globals';
import { mount } from '@vue/test-utils';

// Mock @xstate/vue at the root - this catches all imports across the component tree
const mockMatches = jest.fn().mockReturnValue(false);
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
  done: false,
  toStrings: () => [],
  value: {},
  event: { type: 'xstate.init' },
  children: {},
  actions: [],
  activities: {},
  meta: {},
  history: undefined,
  tags: new Set(),
};
// useActor/useInterpret from @xstate/vue return Ref-wrapped values
const stateRef = { value: mockState };

jest.mock('@xstate/vue', () => ({
  useInterpret: jest.fn(() => ({
    send: jest.fn(),
    subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })),
    getSnapshot: jest.fn(() => mockState),
    start: jest.fn(),
    stop: jest.fn(),
    status: 0,
  })),
  useActor: jest.fn(() => [stateRef, jest.fn()]),
  useSelector: jest.fn((_service: any, selector: any) => ({
    value: selector(mockState),
  })),
}));

// Mock aws-amplify/auth
jest.mock('aws-amplify/auth', () => ({
  fetchAuthSession: jest.fn(() =>
    Promise.resolve({
      credentials: { accessKeyId: 'test', secretAccessKey: 'test' },
    })
  ),
}));

import FaceLivenessDetector from '../FaceLivenessDetector.vue';
import FaceLivenessDetectorCore from '../FaceLivenessDetectorCore.vue';

describe('FaceLivenessDetector', () => {
  beforeAll(() => {
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  const defaultProps = {
    region: 'us-east-1',
    sessionId: 'sessionId',
    onAnalysisComplete: () => Promise.resolve(),
  };

  it('should render the liveness detector container', () => {
    const wrapper = mount(FaceLivenessDetectorCore, {
      props: defaultProps,
    });
    expect(wrapper.find('[data-testid="liveness-detector"]').exists()).toBe(
      true
    );
  });

  it('should render LivenessCheck inside the flow', () => {
    const wrapper = mount(FaceLivenessDetectorCore, {
      props: defaultProps,
    });
    expect(
      wrapper.find('[data-testid="amplify-liveness-detector-check"]').exists()
    ).toBe(true);
  });

  it('should render with FaceLivenessDetector wrapper (integration)', () => {
    const wrapper = mount(FaceLivenessDetector, {
      props: defaultProps,
    });
    expect(wrapper.find('[data-testid="liveness-detector"]').exists()).toBe(
      true
    );
  });

  it('should render with disableStartScreen prop', () => {
    const wrapper = mount(FaceLivenessDetectorCore, {
      props: {
        ...defaultProps,
        disableStartScreen: true,
      },
    });
    expect(
      wrapper.find('[data-testid="amplify-liveness-detector-check"]').exists()
    ).toBe(true);
  });
});
