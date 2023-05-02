<script setup lang="ts">
import useRecorder from '@/composables/recorder'

const { videoPreview, isRecording, recordScreen, stopRecording } = useRecorder()
</script>

<template>
  <video
    ref="videoPreview"
    v-show="isRecording"
    autoplay
    style="width: 100%"
  ></video>

  <button
    v-if="!isRecording"
    @click="recordScreen"
  >
    Start record!
  </button>

  <button
    v-else
    @click="stopRecording"
  >
    Stop recording!
  </button>
</template>
