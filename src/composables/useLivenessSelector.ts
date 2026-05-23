import { useSelector } from '@xstate/vue';

import { useFaceLivenessDetector } from '../providers';
import type { LivenessMachineState } from '../service';

export type LivenessSelectorFn<T> = (state: LivenessMachineState) => T;

export function createLivenessSelector<T>(
  selector: LivenessSelectorFn<T>
): LivenessSelectorFn<T> {
  return selector;
}

export function useLivenessSelector<T>(selector: LivenessSelectorFn<T>): T {
  const { service } = useFaceLivenessDetector();
  // useSelector from @xstate/vue returns Ref<T>. We return it directly
  // and let consumer handle the ref unwrapping via .value
  return useSelector(service, selector) as unknown as T;
}
