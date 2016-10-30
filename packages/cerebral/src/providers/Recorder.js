/*
  - Wrap mutation methods and track their usage
  -
*/
export default function RecorderProvider (options = {}) {
  const timeout = options.setTimeout || setTimeout

  const mutationMethods = [
    'set',
    'push',
    'merge',
    'pop',
    'shift',
    'unshift',
    'splice',
    'unset',
    'concat'
  ]
  let provider = null

  /*
    We create the provider on the first signal execution
  */
  function createProvider (context) {
    const controller = context.controller
    // We will override the origin runSignal method to block
    // signals from running while playing back recording
    const originalRunSignal = controller.runSignal
    let allowedSignals = []
    let currentRecording = null
    let currentSeek = 0
    let currentEventIndex = 0
    let lastEventTimestamp = 0
    let nextEventTimeout = null
    let started = null
    let ended = null
    let isPlaying = false
    let isRecording = false

    // We need to record flush events to update the UI
    // at the same time as during the recording
    controller.on('flush', () => {
      if (isRecording) {
        currentRecording.events.push({
          type: 'flush',
          timestamp: Date.now()
        })
      }
    })

    function mutate (mutation) {
      const args = JSON.parse(mutation.args)
      const path = args.shift().split('.')

      controller.model[mutation.method].apply(controller.model, [path].concat(args))
    }

    // During playback we run events as they were recorded, one after
    // the other
    function runNextEvent () {
      const event = currentRecording.events[currentEventIndex]

      nextEventTimeout = timeout(() => {
        if (event.type === 'mutation') {
          mutate(event)
        } else if (event.type === 'flush') {
          controller.flush(currentEventIndex === 0)
        }

        lastEventTimestamp = event.timestamp
        currentEventIndex++

        if (!currentRecording.events[currentEventIndex]) {
          controller.runSignal = originalRunSignal
          isPlaying = false
          currentEventIndex = 0

          return
        }

        runNextEvent()
      }, event.timestamp - lastEventTimestamp)
    }

    function resetState () {
      currentRecording.initialState.forEach((state) => {
        controller.model.set(state.path, JSON.parse(state.value))
      })
      for (let x = 0; x < currentEventIndex; x++) {
        if (currentRecording.events[x].type === 'mutation') {
          mutate(currentRecording.events[x])
        }
      }
    }

    return {
      seek (seek) {
        clearTimeout(nextEventTimeout)

        for (let x = 0; x < currentRecording.events.length; x++) {
          currentEventIndex = x

          const event = currentRecording.events[x]
          if (event.timestamp - currentRecording.start > seek) {
            break
          }
        }

        resetState()
      },
      play (options = {}) {
        if (isPlaying || isRecording) {
          throw new Error('CEREBRAL Recorder - You can not play while already playing or recording')
        }

        allowedSignals = options.allowedSignals || []
        resetState()
        isPlaying = true
        started = Date.now()
        lastEventTimestamp = currentRecording.start

        controller.runSignal = (...args) => {
          if (allowedSignals.indexOf(args[0]) >= 0) {
            originalRunSignal.apply(controller, args)
          }
        }
        runNextEvent()
      },
      record (options = {}) {
        // If we are recording over the previous stuff, go back to start
        if (currentRecording) {
          currentSeek = 0
          ended = null
        }

        const paths = (options.initialState || [''])
        const state = paths.map(function (path) {
          const arrayPath = path ? path.split('.') : []

          return {
            path: arrayPath,
            value: JSON.stringify(controller.getState(arrayPath))
          }
        })

        currentRecording = {
          initialState: state,
          start: Date.now(),
          events: []
        }
        isRecording = true
      },
      stop () {
        const wasPlaying = isPlaying
        clearTimeout(nextEventTimeout)
        isPlaying = false
        isRecording = false
        controller.runSignal = originalRunSignal

        if (wasPlaying) {
          return
        }

        currentRecording.end = Date.now()
        currentEventIndex = 0
        currentRecording.events.push({
          type: 'flush',
          timestamp: Date.now()
        })
      },
      pause () {
        ended = Date.now()
        currentSeek = ended - started
        clearTimeout(nextEventTimeout)
        isPlaying = false
      },
      getRecording () {
        return currentRecording
      },
      getCurrentSeek () {
        return currentSeek
      },
      loadRecording (recording) {
        currentRecording = recording
      },
      isRecording () {
        return isRecording
      }
    }
  }

  return function Recorder (context) {
    context.recorder = provider = provider || createProvider(context)

    if (context.recorder.isRecording()) {
      context.state = mutationMethods.reduce((state, method) => {
        const originMethod = state[method]

        state[method] = (...args) => {
          context.recorder.getRecording().events.push({
            type: 'mutation',
            method,
            args: JSON.stringify(args),
            timestamp: Date.now()
          })
          originMethod.apply(null, args)
        }

        return state
      }, context.state)
    }

    return context
  }
}
