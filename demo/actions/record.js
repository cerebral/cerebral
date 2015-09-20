function record (input, state, output, services) {
  state.set(['recorder', 'isRecording'], true);
  services.recorder.record();
}

export default record;
