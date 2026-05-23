import { useActor } from '@xstate/vue';

import { useFaceLivenessDetector } from '../providers';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useLivenessActor() {
  const { service } = useFaceLivenessDetector();
  const actor = useActor(service);

  return actor;
}
