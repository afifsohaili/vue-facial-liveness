# Decision Log: Vue Liveness Package Port

## Decision 1: Package Structure

**Context**: Porting `@aws-amplify/ui-react-liveness` to `@aws-amplify/ui-vue-liveness`.

**Decision**: Follow the same structure as `@aws-amplify/ui-vue`:

- Use Vite for building (not Rollup like react-liveness)
- Use Vue SFC (`.vue`) files with `<script setup lang="ts">`
- Use `@xstate/vue` instead of `@xstate/react`
- Use Vue provide/inject instead of React Context
- Use `@testing-library/vue` + `@vue/test-utils` for testing

## Decision 2: Service Layer Reuse

**Context**: The service layer (machine definitions, types, AWS SDK integration, face detection, streaming utilities) is framework-agnostic TypeScript.

**Decision**: Copy service layer files as-is from react-liveness. These contain no React/JSX code and work identically in Vue.

## Decision 3: Dependency Versions

**Context**: Need to ensure latest dependencies for security.

**Decision**: Use the same dependency versions as the source react-liveness package since those are the versions tested and compatible with the AWS SDK integrations. Key runtime deps (xstate, @aws-sdk/_, @tensorflow/_, etc.) remain identical. Only change is using `@xstate/vue` instead of `@xstate/react`, and Vue-specific deps.

## Decision 4: Vue Component Architecture

**Context**: React uses JSX components; Vue uses SFC with templates.

**Decision**: Translate React components to Vue SFCs using `<script setup lang="ts">`:

- React functional components → Vue components with `<script setup>`
- React hooks → Vue composables (using `@xstate/vue` for useActor/useSelector)
- React Context → Vue provide/inject
- React.memo → Vue's built-in component caching or computed properties

## Decision 5: Build System

**Context**: react-liveness uses Rollup; vue package uses Vite.

**Decision**: Use Vite (matching `@aws-amplify/ui-vue` conventions). Vite library mode handles ESM/CJS output. CSS is bundled as a separate file.

## Decision 6: AWS Amplify UI Primitives

**Context**: react-liveness uses `@aws-amplify/ui-react` components (Flex, View, Button, Text, etc.).

**Decision**: Create minimal equivalent renderless/composable primitives in Vue since `@aws-amplify/ui-vue` doesn't expose basic layout primitives the same way. Use HTML elements with appropriate CSS classes matching the same class names from react-liveness. Some components from `@aws-amplify/ui-react` have equivalents in `@aws-amplify/ui-vue` (like Button, TextField) but basic layout (Flex, View) are rendered as plain divs with the same CSS class names.

## Decision 7: Internal React Imports

**Context**: react-liveness uses internal React components like `IconClose`, `AlertIcon`, `useTheme`, `useColorMode`, `useThemeBreakpoint` from `@aws-amplify/ui-react/internal`.

**Decision**: Implement simple Vue equivalents:

- `IconClose` → SVG inline component
- `AlertIcon` → SVG inline component
- For theme/color mode: Use CSS custom properties directly (CSS variables like `--amplify-colors-*` are applied by the Amplify UI CSS). No need for `useTheme`/`useColorMode` in Vue since the CSS variables work automatically.
- For `useThemeBreakpoint`: Skip - the popover positioning uses hard-coded pixel values which we can adjust.

## Decision 8: Test Framework

**Context**: React tests use `@testing-library/react`; Vue needs Vue-specific testing.

**Decision**: Use:

- `@testing-library/vue` for component rendering/interaction tests
- `@vue/test-utils` for composable tests
- `jest` with `@vue/vue3-jest` transformer for `.vue` files
- Same mocks as react-liveness for service layer tests (blob-polyfill, web-streams-polyfill, etc.)
