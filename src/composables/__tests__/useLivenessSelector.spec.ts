import { describe, it, expect, jest, afterEach } from '@jest/globals';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import * as XStateVue from '@xstate/vue';

import { VERSION } from '../../version';
import * as Providers from '../../providers';
import {
  useLivenessSelector,
  createLivenessSelector,
  type LivenessSelectorFn,
} from '../useLivenessSelector';

jest.mock('../../providers', () => ({
  useFaceLivenessDetector: jest.fn(),
}));

const mockedUseFaceLivenessDetector = jest.mocked(
  Providers.useFaceLivenessDetector
);

describe('createLivenessSelector', () => {
  it('should create a selector function that can read state context', () => {
    type TestState = { context: { errorState: string | null } };
    const selectErrorState = createLivenessSelector(
      (state: TestState) => state.context.errorState
    );

    expect(selectErrorState).toBeDefined();
    expect(typeof selectErrorState).toBe('function');
  });

  it('should return the same function reference', () => {
    const selector: LivenessSelectorFn<any> = (state: any) =>
      state.context.isRecordingStopped;

    const created = createLivenessSelector(selector);
    expect(created).toBe(selector);
  });
});

describe('useLivenessSelector', () => {
  const TestComponent = defineComponent({
    props: { selector: { type: Function, required: true } },
    setup(props: any) {
      const value = useLivenessSelector(props.selector);
      return { value };
    },
    render() {
      return h('div', 'test');
    },
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the selector value', () => {
    const selector = jest.fn();
    const service = {};
    const expectedValue = { test: 'result' };

    jest.spyOn(XStateVue, 'useSelector').mockReturnValue(expectedValue as any);

    mockedUseFaceLivenessDetector.mockReturnValue({ service } as any);

    const wrapper = mount(TestComponent, {
      props: { selector },
    });

    expect(wrapper.vm.value).toBe(expectedValue);
    expect(mockedUseFaceLivenessDetector).toHaveBeenCalledTimes(1);
  });
});
