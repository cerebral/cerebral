function play (input, state, output, services) {
  state.merge('recorder', {
    isPlaying: true
  });
  services.recorder.seek(0, true);
}

export default play;
