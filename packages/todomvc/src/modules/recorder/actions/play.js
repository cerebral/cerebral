function play ({recorder, state}) {
  recorder.play({
    allowedSignals: ['recorder.pauseClicked', 'recorder.playClicked']
  })
  state.merge('recorder', {
    isPlaying: true,
    isPaused: false
  })
}

export default play
