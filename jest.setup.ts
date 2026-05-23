import '@testing-library/jest-dom';

/**
 * This is a workaround to the problem of the jsdom library not supporting
 * URL.createObjectURL. See https://github.com/jsdom/jsdom/issues/1721.
 */
if (typeof window.URL.createObjectURL === 'undefined') {
  window.URL.createObjectURL = jest.fn() as any;
}

// Polyfill for window.matchMedia
if (typeof window.matchMedia === 'undefined') {
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
}

// Polyfill for MediaStream and related APIs used in tests
if (typeof (window as any).MediaStream === 'undefined') {
  class MockMediaStream {
    getTracks() {
      return [];
    }
    getVideoTracks() {
      return [];
    }
    addTrack() {}
    removeTrack() {}
  }
  (window as any).MediaStream = MockMediaStream;
}

if (typeof (window as any).MediaDeviceInfo === 'undefined') {
  class MockMediaDeviceInfo {
    deviceId!: string;
    groupId!: string;
    kind!: string;
    label!: string;
    toJSON() {
      return {};
    }
  }
  (window as any).MediaDeviceInfo = MockMediaDeviceInfo;
}
