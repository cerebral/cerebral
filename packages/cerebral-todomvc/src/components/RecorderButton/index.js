import React from 'react'
import { connect } from 'cerebral-view-react'

export default connect({
  recorder: 'recorder',
  isSaving: 'app.isSaving'
}, {
  paused: 'recorder.paused',
  resumed: 'recorder.resumed',
  stopped: 'recorder.stopped',
  played: 'recorder.played',
  recorded: 'recorder.recorded'
},
  function ({ recorder, paused, resumed, stopped, played, recorded, isSaving }) {
    const style = {
      border: '1px solid black',
      borderRadius: '2px',
      height: '25px',
      backgroundColor: '#EAEAEA',
      padding: '5px',
      lineHeight: '15px',
      boxSizing: 'border-box',
      opacity: isSaving && !recorder.isPlaying && !recorder.isPaused ? '0.5' : 1
    }

    if (recorder.isPlaying) {
      return (
        <button
          style={style}
          onClick={() => paused({}, {isRecorded: true})}
        >
          Pause playback
        </button>
      )
    }
    if (recorder.isPaused) {
      return (
        <button
          style={style}
          onClick={() => resumed()}
        >
          Play
        </button>
      )
    }
    if (recorder.isRecording) {
      return (
        <button
          style={style}
          disabled={isSaving}
          onClick={() => stopped()}
        >
          Stop recording
        </button>
      )
    }
    if (recorder.hasRecorded) {
      return (
        <button
          style={style}
          disabled={isSaving}
          onClick={() => played()}
        >
          Play
        </button>
      )
    }
    return (
      <button
        style={style}
        disabled={isSaving}
        onClick={() => recorded({
          paths: [
            ['app']
          ]
        })}
      >
        Record
      </button>
    )
  }
)
