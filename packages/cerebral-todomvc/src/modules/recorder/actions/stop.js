function stop ({recorder, state}) {
  state.merge('recorder', {
    isRecording: false,
    isPlaying: false,
    isPaused: false,
    hasRecording: true
  })
  recorder.stop()
}

export default stop
