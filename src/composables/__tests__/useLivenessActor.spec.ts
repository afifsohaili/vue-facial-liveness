import { describe, it, expect, jest, afterEach } from '@jest/globals';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import * as XStateVue from '@xstate/vue';

import * as Providers from '../../providers';
import { useLivenessActor } from '../useLivenessActor';

jest.mock('../../providers', () => ({
  useFaceLivenessDetector: jest.fn(),
}));

const mockedUseFaceLivenessDetector = jest.mocked(
  Providers.useFaceLivenessDetector
);

describe('useLivenessActor', () => {
  const TestComponent = defineComponent({
    setup() {
      const actor = useLivenessActor();
      return { actor };
    },
    render() {
      return h('div', 'test');
    },
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the actor', () => {
    const service = {};
    const mockActor = {};
    const mockUseActor = jest
      .spyOn(XStateVue, 'useActor')
      .mockReturnValue(mockActor as any);

    mockedUseFaceLivenessDetector.mockReturnValue({ service } as any);

    const wrapper = mount(TestComponent);

    expect(wrapper.vm.actor).toBe(mockActor);
    expect(mockedUseFaceLivenessDetector).toHaveBeenCalledTimes(1);
    expect(mockUseActor).toHaveBeenCalledWith(service);
  });
});
