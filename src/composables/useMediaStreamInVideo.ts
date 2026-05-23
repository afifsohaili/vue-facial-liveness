import { ref, watch, onUnmounted, type Ref } from 'vue';
import { isObject } from '@aws-amplify/ui';
import { STATIC_VIDEO_CONSTRAINTS } from '../utils/helpers';

export interface UseMediaStreamInVideo {
  videoRef: Ref<HTMLVideoElement | null>;
  videoHeight: Ref<number | undefined>;
  videoWidth: Ref<number | undefined>;
}

export function useMediaStreamInVideo(
  stream: MediaStream
): UseMediaStreamInVideo {
  const height = (STATIC_VIDEO_CONSTRAINTS.height as ConstrainULongRange).ideal;
  const width = (STATIC_VIDEO_CONSTRAINTS.width as ConstrainULongRange).ideal;

  const videoRef = ref<HTMLVideoElement | null>(null);
  const videoHeight = ref<number | undefined>(height);
  const videoWidth = ref<number | undefined>(width);

  const stop = watch(
    () => stream,
    (newStream) => {
      if (newStream) {
        if (isObject(videoRef.value)) {
          videoRef.value.srcObject = newStream;
        }

        const settings = newStream.getTracks()?.[0]?.getSettings();
        if (settings) {
          videoHeight.value = settings.height;
          videoWidth.value = settings.width;
        }
      }
    },
    { immediate: true }
  );

  onUnmounted(() => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        stream.removeTrack(track);
        track.stop();
      });
    }
    stop();
  });

  return {
    videoRef,
    videoHeight,
    videoWidth,
  };
}
