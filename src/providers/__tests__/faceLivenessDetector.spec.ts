import { describe, it, expect, jest } from '@jest/globals';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import FaceLivenessDetectorProvider from '../../components/FaceLivenessDetectorProvider.vue';
import {
  useFaceLivenessDetector,
  FACE_LIVENESS_DETECTOR_KEY,
} from '../faceLivenessDetector';

describe('faceLivenessDetector', () => {
  it('should export FACE_LIVENESS_DETECTOR_KEY', () => {
    expect(FACE_LIVENESS_DETECTOR_KEY).toBeDefined();
    expect(typeof FACE_LIVENESS_DETECTOR_KEY).toBe('symbol');
    expect(FACE_LIVENESS_DETECTOR_KEY.description).toBe('FaceLivenessDetector');
  });

  it('should export useFaceLivenessDetector', () => {
    expect(useFaceLivenessDetector).toBeDefined();
    expect(typeof useFaceLivenessDetector).toBe('function');
  });
});

describe('FaceLivenessDetectorProvider', () => {
  const TestComponent = defineComponent({
    setup() {
      const context = useFaceLivenessDetector();
      return { context };
    },
    render() {
      return h('div', 'Some component');
    },
  });

  it('should render children by default', () => {
    const wrapper = mount(FaceLivenessDetectorProvider, {
      props: {
        componentProps: {
          region: 'us-east-1',
          sessionId: 'sessionId',
          onAnalysisComplete: () => Promise.resolve(),
        } as any,
        service: {} as any,
      },
      slots: {
        default: TestComponent,
      },
    });

    expect(wrapper.text()).toContain('Some component');
  });

  it('should provide context to child components', () => {
    const wrapper = mount(FaceLivenessDetectorProvider, {
      props: {
        componentProps: {
          region: 'us-east-1',
          sessionId: 'sessionId',
          onAnalysisComplete: () => Promise.resolve(),
        } as any,
        service: { id: 'test-service' } as any,
      },
      slots: {
        default: TestComponent,
      },
    });

    const testComponent = wrapper.findComponent(TestComponent);
    expect(testComponent.exists()).toBe(true);
    // The context should have componentProps and service
    expect(testComponent.vm.context).toBeDefined();
    expect(testComponent.vm.context.service.id).toBe('test-service');
  });
});
