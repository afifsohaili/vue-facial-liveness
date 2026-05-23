# vue-facial-liveness

Vue 3 face liveness detection component using AWS Rekognition Streaming.

> ⚠️ **Disclaimer:** This package is an AI-ported derivative of [`@aws-amplify/ui-react-liveness`](https://www.npmjs.com/package/@aws-amplify/ui-react-liveness) (Apache 2.0). The service layer (XState machine, AWS SDK integration, face detection) is copied as-is; Vue-specific UI components and composables were translated from React equivalents. This is **not** an official AWS Amplify package. Use at your own risk. No guarantees of correctness, security, or ongoing maintenance are provided.

## Prerequisites

- An AWS account with [Amazon Rekognition](https://aws.amazon.com/rekognition/) enabled
- A backend API that calls `CreateFaceLivenessSession` and `GetFaceLivenessSessionResults` (see [AWS docs](https://docs.aws.amazon.com/rekognition/latest/dg/face-liveness.html))
- `aws-amplify` v6 configured in your Vue app (for credential resolution)

## Installation

```bash
npm install vue-facial-liveness aws-amplify @aws-amplify/core vue
```

## Quick Start

```vue
<script setup lang="ts">
import { FaceLivenessDetector } from 'vue-facial-liveness';
import 'vue-facial-liveness/styles.css';

const sessionId = ref<string>('');
const region = 'us-east-1';

// Fetch sessionId from your backend (which calls CreateFaceLivenessSession)
onMounted(async () => {
  const res = await fetch('/api/create-liveness-session');
  const data = await res.json();
  sessionId.value = data.sessionId;
});

const handleAnalysisComplete = async () => {
  // Call your backend to get results via GetFaceLivenessSessionResults
  const res = await fetch('/api/liveness-result', {
    method: 'POST',
    body: JSON.stringify({ sessionId: sessionId.value }),
  });
  const result = await res.json();
  console.log('Liveness result:', result);
};

const handleError = (error: any) => {
  console.error('Liveness error:', error);
};
</script>

<template>
  <FaceLivenessDetector
    :region="region"
    :session-id="sessionId"
    :on-analysis-complete="handleAnalysisComplete"
    :on-error="handleError"
  />
</template>
```

## Components

### FaceLivenessDetector

High-level component with built-in credential resolution via `fetchAuthSession()` from `aws-amplify/auth`.

| Prop                 | Type                        | Required | Description                                      |
| -------------------- | --------------------------- | -------- | ------------------------------------------------ |
| `region`             | `string`                    | Yes      | AWS region for Rekognition streaming             |
| `sessionId`          | `string`                    | Yes      | Session ID from `CreateFaceLivenessSession` API  |
| `onAnalysisComplete` | `(result: any) => void`     | Yes      | Called when liveness analysis is complete        |
| `onUserCancel?`      | `() => void`                | No       | Called when user cancels the flow                |
| `onError?`           | `(error: any) => void`      | No       | Called when an error occurs                      |
| `disableStartScreen?`| `boolean`                   | No       | Skip the "Get Ready" start screen                |
| `config?`            | `FaceLivenessDetectorConfig`| No       | Advanced config (deviceId, binaryPath, etc.)     |
| `components?`        | `object`                    | No       | Custom component overrides                       |
| `displayText?`       | `object`                    | No       | Custom display text overrides (i18n)             |

### FaceLivenessDetectorCore

Lower-level component that requires an explicit `credentialProvider` in its config.

| Prop                 | Type                              | Required | Description                                      |
| -------------------- | --------------------------------- | -------- | ------------------------------------------------ |
| `region`             | `string`                          | Yes      | AWS region for Rekognition streaming             |
| `sessionId`          | `string`                          | Yes      | Session ID from `CreateFaceLivenessSession` API  |
| `onAnalysisComplete` | `(result: any) => void`           | Yes      | Called when liveness analysis is complete        |
| `onUserCancel?`      | `() => void`                      | No       | Called when user cancels the flow                |
| `onError?`           | `(error: any) => void`            | No       | Called when an error occurs                      |
| `disableStartScreen?`| `boolean`                         | No       | Skip the "Get Ready" start screen                |
| `config?`            | `FaceLivenessDetectorCoreConfig`  | No       | Full config including `credentialProvider`, `endpointOverride`, `systemClockOffset` |
| `components?`        | `object`                          | No       | Custom component overrides                       |
| `displayText?`       | `object`                          | No       | Custom display text overrides (i18n)             |

## Advanced Config

```ts
interface FaceLivenessDetectorCoreConfig {
  deviceId?: string;          // Pre-select a camera
  binaryPath?: string;        // Override TF WASM binary CDN path
  faceModelUrl?: string;      // Override Blazeface model URL
  credentialProvider?: () => Promise<AwsCredentials>;  // Custom AWS credentials
  endpointOverride?: string;  // Override the Rekognition endpoint (internal use)
  systemClockOffset?: number; // Clock offset compensation
}
```

## Display Text Customization

You can override any displayed text for i18n:

```vue
<FaceLivenessDetector
  :display-text="{
    hintDisplayText: {
      centerFaceInstruction: 'Pusatkan muka anda',
      holdCameraBetween: 'Pegang kamera pada paras mata',
    },
  }"
/>
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Dev (watch mode)
npm run dev

# Test
npm test
```

## Architecture

The package uses **XState** for state machine orchestration and **TensorFlow.js** (BlazeFace) for client-side face detection. The video stream is sent to AWS Rekognition Streaming for server-side liveness verification.

Key layers:
- **Components** — Vue 3 SFCs using `<script setup lang="ts">`
- **Composables** — `useLivenessActor`, `useLivenessSelector`, `useMediaStreamInVideo`
- **Providers** — Vue `provide/inject` for sharing the XState interpreter
- **Service** — XState machine, AWS SDK client, face detection, streaming utilities (framework-agnostic)

## License

Apache-2.0 — see [LICENSE](./LICENSE). Derivative work of `@aws-amplify/ui-react-liveness` by Amazon.com, Inc. or its affiliates.
