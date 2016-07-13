import React from 'react'
import { connect } from 'cerebral-view-react'

export default connect({
  recorder: 'recorder'
}, function (props) {
  let style = {
    border: '1px solid black',
    borderRadius: '2px',
    height: '25px',
    backgroundColor: '#EAEAEA',
    padding: '5px',
    lineHeight: '15px',
    boxSizing: 'border-box'
  }
  var signals = props.signals
  if (props.recorder.isPlaying) {
    return React.createElement('button', {
      style: style,
      onClick: function () {
        signals.recorder.paused({}, {
          isRecorded: true
        })
      }
    }, 'Pause playback')
  }
  if (props.recorder.isPaused) {
    return React.createElement('button', {
      style: style,
      onClick: function () { signals.recorder.resumed() }
    }, 'Play')
  }
  if (props.recorder.isRecording) {
    return React.createElement('button', {
      style: style,
      onClick: function () { signals.recorder.stopped() }
    }, 'Stop recording')
  }
  if (props.recorder.hasRecorded) {
    return React.createElement('button', {
      style: style,
      onClick: function () { signals.recorder.played() }
    }, 'Play')
  }
  return React.createElement('button', {
    style: style,
    onClick: function () { signals.recorder.recorded() }
  }, 'Record')
})
