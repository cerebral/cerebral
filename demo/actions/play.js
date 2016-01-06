function play ({state, services}) {
  services.recorder.seek(0);
  state.merge('recorder', {
    isPlaying: true
  });
  services.recorder.play();
}

export default play;
