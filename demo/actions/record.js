function record ({state, services}) {
  state.set(['recorder', 'isRecording'], true);
  services.recorder.record();
}

export default record;
