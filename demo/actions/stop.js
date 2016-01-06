function stop ({state, services}) {
  state.merge('recorder', {
    isPlaying: false,
    isRecording: false,
    hasRecorded: true
  });
  services.recorder.stop();
}

export default stop;
