import { ref } from 'vue'

export default function useRecorder() {
  const isRecording = ref(false)
  const videoPreview = ref<HTMLVideoElement | null>(null)
  let stream: MediaStream | null = null

  async function recordScreen() {
    try {
      stream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: {
          displaySurface: 'monitor',
        },
      })

      if (!videoPreview.value) {
        stream.getTracks().forEach((track) => track.stop())
        throw 'videoPreview is not defined'
      }

      videoPreview.value.srcObject = stream

      const recorder = createRecorder(stream)

      stream.addEventListener('inactive', () => {
        recorder.stop()
        videoPreview.value && (videoPreview.value.srcObject = null)
      })
    } catch (error) {
      console.log('Error accessing media devices.', error)
    }
  }

  function createRecorder(stream: MediaStream) {
    isRecording.value = true
    let recordedChunks = [] as Blob[]

    const mediaRecorder = new MediaRecorder(stream)

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      saveFile(recordedChunks)
      recordedChunks = []
    }

    mediaRecorder.start(200)

    return mediaRecorder
  }

  function saveFile(recordedChunks: Blob[]) {
    const blob = new Blob(recordedChunks, {
      type: 'video/webm',
    })

    const filename = window.prompt('Enter file name') || String(Date.now())
    const downloadLink = document.createElement('a')
    const url = window.URL.createObjectURL(blob)
    downloadLink.href = url
    downloadLink.download = `${filename}.webm`

    downloadLink.click()
    URL.revokeObjectURL(url)

    isRecording.value = false
  }

  function stopRecording() {
    stream?.getTracks().forEach((track) => track.stop())
  }

  return {
    isRecording,
    videoPreview,
    recordScreen,
    stopRecording,
  }
}
