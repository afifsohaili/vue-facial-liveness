import { defineConfig, PluginOption } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import typescript2 from 'rollup-plugin-typescript2';

const resolvePath = (str: string) => path.resolve(__dirname, str);

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    typescript2({
      check: false,
      include: ['src/**/*.vue', 'src/**/*.ts'],
      tsconfigOverride: {
        compilerOptions: {
          sourceMap: true,
          declaration: true,
          declarationMap: true,
        },
        exclude: ['*.ts', '**/__mocks__', '**/__tests__'],
      },
    }) as PluginOption,
  ],
  build: {
    cssCodeSplit: false,
    lib: {
      entry: resolvePath('./src/index.ts'),
      formats: ['es', 'cjs'],
      name: 'vue-facial-liveness',
      cssFileName: 'style',
      fileName: (format: string) =>
        format === 'es' ? 'index.js' : `index.${format}`,
    },
    rollupOptions: {
      external: [
        '@aws-amplify/core',
        '@aws-amplify/ui',
        '@aws-sdk/client-rekognitionstreaming',
        '@aws-sdk/util-format-url',
        '@smithy/eventstream-serde-browser',
        '@smithy/fetch-http-handler',
        '@smithy/protocol-http',
        '@smithy/signature-v4',
        '@smithy/types',
        '@mediapipe/face_detection',
        '@tensorflow/tfjs-backend-cpu',
        '@tensorflow/tfjs-backend-wasm',
        '@tensorflow/tfjs-converter',
        '@tensorflow/tfjs-core',
        '@xstate/vue',
        'aws-amplify',
        'aws-amplify/auth',
        'tslib',
        'uuid',
        'vue',
        'xstate',
      ],
      output: { globals: { vue: 'Vue' } },
    },
  },
});
