import React from 'react'
import { connect } from 'cerebral-view-react'

export default connect({
  recorder: 'recorder'
}, {
  paused: 'recorder.paused',
  resumed: 'recorder.resumed',
  stopped: 'recorder.stopped',
  played: 'recorder.played',
  recorded: 'recorder.recorded'
},
  function ({ recorder, paused, resumed, stopped, played, recorded }) {
    let style = {
      border: '1px solid black',
      borderRadius: '2px',
      height: '25px',
      backgroundColor: '#EAEAEA',
      padding: '5px',
      lineHeight: '15px',
      boxSizing: 'border-box'
    }
    if (recorder.isPlaying) {
      return React.createElement('button', {
        style: style,
        onClick: function () {
          paused({}, {
            isRecorded: true
          })
        }
      }, 'Pause playback')
    }
    if (recorder.isPaused) {
      return React.createElement('button', {
        style: style,
        onClick: function () { resumed() }
      }, 'Play')
    }
    if (recorder.isRecording) {
      return React.createElement('button', {
        style: style,
        onClick: function () { stopped() }
      }, 'Stop recording')
    }
    if (recorder.hasRecorded) {
      return React.createElement('button', {
        style: style,
        onClick: function () { played() }
      }, 'Play')
    }
    return React.createElement('button', {
      style: style,
      onClick: function () { recorded() }
    }, 'Record')
  }
)
