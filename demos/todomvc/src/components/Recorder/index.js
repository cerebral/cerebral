import React from 'react'
import { connect } from 'cerebral/react'
import {state, signal} from 'cerebral/tags'

export default connect({
  recorder: state`recorder`,
  recordClicked: signal`recorder.recordClicked`,
  playClicked: signal`recorder.playClicked`,
  stopClicked: signal`recorder.stopClicked`,
  pauseClicked: signal`recorder.pauseClicked`
},
  function Recorder ({ recorder, recordClicked, playClicked, stopClicked, pauseClicked }) {
    const style = {
      height: '25px',
      lineHeight: '19px',
      border: '1px solid #333',
      backgroundColor: 'rgba(175, 47, 47, 0.15)',
      borderRadius: '3px',
      color: '#333',
      padding: '3px 10px',
      boxSizing: 'border-box',
      cursor: 'pointer'
    }

    if (recorder.isRecording) {
      return (
        <button style={style} onClick={() => stopClicked()}>
          Stop
        </button>
      )
    } else if (recorder.isPlaying) {
      return (
        <button style={style} onClick={() => pauseClicked()}>
          Pause
        </button>
      )
    } else if (recorder.isPaused) {
      return (
        <button style={style} onClick={() => playClicked()}>
          Resume
        </button>
      )
    } else if (recorder.hasRecording) {
      return (
        <button style={style} onClick={() => playClicked()}>
          Play
        </button>
      )
    } else {
      return (
        <button style={style} onClick={() => recordClicked()}>
          Record
        </button>
      )
    }
  }
)
