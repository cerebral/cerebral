export default (options = {}) => {
  return (module, controller) => {

    module.alias('cerebral-module-recorder');

    module.state({
      isRecording: false,
      isPlaying: false,
      hasRecorded: false
    });

    const play = ({state}) => {
      controller.recorder.seek(0);
      state.merge([module.name], {
        isPlaying: true
      });
      controller.recorder.play();
    }

    module.signal('played', [
      play
    ]);

    const record = ({input, state}) => {
      state.set([module.name, 'isRecording'], true);
      controller.recorder.record({
        paths: input.paths
      });
    }

    module.signal('recorded', [
      record
    ]);

    const stop = ({state}) => {
      state.merge('recorder', {
        isPlaying: false,
        isRecording: false,
        hasRecorded: true
      });
      controller.recorder.stop();
    }

    module.signal('stopped', [
      stop
    ]);

  };
}
