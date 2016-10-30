function record ({recorder, state}) {
  recorder.record()
  state.merge('recorder', {
    isRecording: true,
    isPlaying: false,
    isPaused: false
  })
}

export default record
