<template>
  <div class="amplify-liveness-start-screen-camera-select">
    <div class="amplify-liveness-start-screen-camera-select__container">
      <label
        for="amplify-liveness-camera-select"
        class="amplify-liveness-start-screen-camera-select__label"
      >
        Camera:
      </label>
      <select
        id="amplify-liveness-camera-select"
        data-testid="amplify-liveness-camera-select"
        :value="deviceId"
        @change="onSelect"
      >
        <option
          v-for="device in devices"
          :key="device.deviceId"
          :value="device.deviceId"
        >
          {{ device.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  deviceId?: string;
  devices: MediaDeviceInfo[];
}>();

const emit = defineEmits<{
  (e: 'select', value: string): void;
}>();

const onSelect = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('select', target.value);
};
</script>
