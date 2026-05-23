import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/vue';
import { mount } from '@vue/test-utils';
import CameraSelector from '../CameraSelector.vue';

const mockMediaDevices: MediaDeviceInfo[] = [
  {
    deviceId: '1',
    groupId: 'foobar',
    label: 'Camera 1',
    kind: 'videoinput',
    toJSON: () => ({}),
  } as MediaDeviceInfo,
  {
    deviceId: '2',
    groupId: 'foobar',
    label: 'Camera 2',
    kind: 'videoinput',
    toJSON: () => ({}),
  } as MediaDeviceInfo,
];

describe('CameraSelector', () => {
  it('should render', () => {
    const { container } = render(CameraSelector, {
      props: { devices: mockMediaDevices },
    });

    expect(container).toBeDefined();
  });

  it('renders CameraSelector when there are multiple devices and allows changing camera', async () => {
    const wrapper = mount(CameraSelector, {
      props: {
        deviceId: '1',
        devices: mockMediaDevices,
      },
    });

    const selectElement = wrapper.find('select');
    expect(selectElement.exists()).toBe(true);
    expect(selectElement.element.value).toBe('1');

    const options = wrapper.findAll('option');
    expect(options).toHaveLength(2);
    expect(options[0].text()).toBe('Camera 1');
    expect(options[1].text()).toBe('Camera 2');

    // Simulate selecting the back camera
    await selectElement.setValue('2');
    expect(wrapper.emitted('select')).toHaveLength(1);
    expect(wrapper.emitted('select')![0]).toEqual(['2']);
  });
});
