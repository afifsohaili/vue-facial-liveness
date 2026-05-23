import { provide, inject, type InjectionKey } from 'vue';
import type { LivenessInterpreter } from '../service';
import type { FaceLivenessDetectorCoreProps } from '../service/types/liveness';

export interface FaceLivenessDetectorContextType {
  componentProps: FaceLivenessDetectorCoreProps;
  service: LivenessInterpreter;
}

export const FACE_LIVENESS_DETECTOR_KEY: InjectionKey<FaceLivenessDetectorContextType> =
  Symbol('FaceLivenessDetector');

export function useFaceLivenessDetector(): FaceLivenessDetectorContextType {
  const props = inject(FACE_LIVENESS_DETECTOR_KEY, null);
  if (props === null) {
    throw new Error(
      'useFaceLivenessDetector must be used within a FaceLivenessDetectorProvider'
    );
  }
  return props;
}

export function createFaceLivenessDetectorProvider(
  value: FaceLivenessDetectorContextType
): void {
  provide(FACE_LIVENESS_DETECTOR_KEY, value);
}
