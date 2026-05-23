import { describe, it, expect, jest } from '@jest/globals';
import { defineComponent, h, ref } from 'vue';
import { mount } from '@vue/test-utils';
import {
  useMediaStreamInVideo,
  type UseMediaStreamInVideo,
} from '../useMediaStreamInVideo';

const STATIC_VIDEO_CONSTRAINTS = {
  width: { min: 320, ideal: 640 },
  height: { min: 240, ideal: 480 },
  frameRate: { min: 15, ideal: 30 },
  facingMode: 'user',
};

jest.mock('../../utils/helpers', () => ({
  STATIC_VIDEO_CONSTRAINTS: {
    width: { min: 320, ideal: 640 },
    height: { min: 240, ideal: 480 },
    frameRate: { min: 15, ideal: 30 },
    facingMode: 'user',
  },
}));

describe('useMediaStreamInVideo', () => {
  const TestComponent = defineComponent({
    props: { stream: { type: Object, required: true } },
    setup(props: any) {
      const result = useMediaStreamInVideo(props.stream);
      return { ...result };
    },
    render() {
      return h('div', 'test');
    },
  });

  it('should return videoRef, videoHeight, videoWidth', () => {
    const track = {
      getSettings: () => ({ height: 200, width: 200 }),
      stop: jest.fn(),
    } as unknown as MediaStreamTrack;

    const stream = {
      getTracks: () => [track],
      getVideoTracks: () => [track],
      removeTrack: jest.fn(),
    } as unknown as MediaStream;

    const wrapper = mount(TestComponent, {
      props: { stream },
    });

    expect(wrapper.vm.videoRef).toBeDefined();
    expect(wrapper.vm.videoHeight).toBe(200);
    expect(wrapper.vm.videoWidth).toBe(200);

    wrapper.unmount();
    expect(stream.removeTrack).toHaveBeenCalledWith(track);
    expect(track.stop).toHaveBeenCalled();
  });

  it('should handle stream with no tracks', () => {
    const stream = {
      getTracks: () => [],
      getVideoTracks: () => [],
      removeTrack: jest.fn(),
    } as unknown as MediaStream;

    const wrapper = mount(TestComponent, {
      props: { stream },
    });

    const height = (STATIC_VIDEO_CONSTRAINTS.height as ConstrainULongRange)
      .ideal;
    const width = (STATIC_VIDEO_CONSTRAINTS.width as ConstrainULongRange).ideal;

    expect(wrapper.vm.videoHeight).toBe(height);
    expect(wrapper.vm.videoWidth).toBe(width);

    wrapper.unmount();
  });

  it('should handle stream track with no settings', () => {
    const track = {
      getSettings: () => undefined,
      stop: jest.fn(),
    } as unknown as MediaStreamTrack;

    const stream = {
      getTracks: () => [track],
      getVideoTracks: () => [track],
      removeTrack: jest.fn(),
    } as unknown as MediaStream;

    const wrapper = mount(TestComponent, {
      props: { stream },
    });

    const height = (STATIC_VIDEO_CONSTRAINTS.height as ConstrainULongRange)
      .ideal;
    const width = (STATIC_VIDEO_CONSTRAINTS.width as ConstrainULongRange).ideal;

    expect(wrapper.vm.videoHeight).toBe(height);
    expect(wrapper.vm.videoWidth).toBe(width);

    wrapper.unmount();
    expect(stream.removeTrack).toHaveBeenCalledWith(track);
    expect(track.stop).toHaveBeenCalled();
  });
});
