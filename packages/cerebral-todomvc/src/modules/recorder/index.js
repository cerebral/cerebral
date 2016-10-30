import record from './chains/record'
import play from './chains/play'
import pause from './chains/pause'
import stop from './chains/stop'

export default {
  state: {
    isRecording: false,
    isPlaying: false,
    isPaused: false,
    hasRecording: false
  },
  signals: {
    recordClicked: record,
    playClicked: play,
    pauseClicked: pause,
    stopClicked: stop
  }
}
