import type { FaceLivenessDetectorCoreProps as FaceLivenessDetectorPropsFromUi } from '../service';
import type { LivenessDisplayText } from '../displayText';
import type {
  InstructionDisplayText,
  HintDisplayText,
  CameraDisplayText,
  StreamDisplayText,
  ErrorDisplayText,
} from '../displayText';

export interface FaceLivenessDetectorCoreProps
  extends FaceLivenessDetectorPropsFromUi {
  components?: any;
  displayText?: LivenessDisplayText;
}

export interface FaceLivenessDetectorProps
  extends FaceLivenessDetectorPropsFromUi {
  components?: any;
  displayText?: LivenessDisplayText;
}

export interface LivenessCheckProps {
  instructionDisplayText: Required<InstructionDisplayText>;
  hintDisplayText: Required<HintDisplayText>;
  cameraDisplayText: Required<CameraDisplayText>;
  streamDisplayText: Required<StreamDisplayText>;
  errorDisplayText: Required<ErrorDisplayText>;
  components?: any;
}

export interface LivenessCameraModuleProps {
  isMobileScreen: boolean;
  isRecordingStopped: boolean;
  instructionDisplayText: Required<InstructionDisplayText>;
  streamDisplayText: Required<StreamDisplayText>;
  hintDisplayText: Required<HintDisplayText>;
  errorDisplayText: Required<ErrorDisplayText>;
  cameraDisplayText: Required<CameraDisplayText>;
  components?: any;
  testId?: string;
}

export interface FaceLivenessDetectorComponents {
  ErrorView?: any;
  PhotosensitiveWarning?: any;
}
