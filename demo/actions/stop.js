function stop (input, state, output, services) {
  state.merge('recorder', {
    isPlaying: false,
    isRecording: false,
    hasRecorded: true
  });
  services.recorder.stop();
}

export default stop;
