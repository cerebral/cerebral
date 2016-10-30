function pause ({recorder, state}) {
  recorder.pause()
  state.merge('recorder', {
    isPlaying: false,
    isPaused: true
  })
}

export default pause
