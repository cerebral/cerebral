module.exports = function Recorder () {
  return function (module, controller) {
    var signalStore = controller.getStore()
    var signalMethods = controller.getSignals()

    var currentSignal = null
    var currentSeek = 0
    var currentRecording = null
    var durationTimer = null
    var playbackTimers = []
    var duration = 0
    var started = null
    var ended = null
    var isPlaying = false
    var isRecording = false
    var isCatchingUp = false
    var startSeek = 0
    var catchup = null

    // Runs the signal synchronously
    var triggerSignal = function (signal) {
      var signalName = signal.name.split('.')
      var signalMethodPath = signalMethods
      while (signalName.length) {
        signalMethodPath = signalMethodPath[signalName.shift()]
      }
      currentSignal = signal
      signalMethodPath(signal.input, {
        isRecorded: true
      })
    }

    var services = {
      seek: function (seek) {
        startSeek = seek
        clearTimeout(durationTimer)
        playbackTimers.forEach(clearTimeout)

        controller.emit('seek', startSeek, currentRecording)

        if (signalStore.isRemembering()) {
          return
        }

        // Optimize with FOR loop
        catchup = currentRecording.signals.filter(function (signal) {
          return signal.start - currentRecording.start < startSeek
        })
        isCatchingUp = true
        catchup.forEach(triggerSignal)
        isCatchingUp = false
      },

      getCurrentSignal: function () {
        return currentSignal
      },

      createTimer: function () {
        var update = function () {
          duration += 500
          controller.emit('duration', duration)
          if (duration < currentRecording.duration) {
            durationTimer = setTimeout(update, 500)
            controller.emit('change')
          }
        }
        durationTimer = setTimeout(update, 500)
      },

      // TODO: Do I need this? Not in use?
      resetState: function () {
        controller.emit('recorderReset', currentRecording)
      },

      play: function () {
        if (isPlaying || isRecording) {
          throw new Error('CEREBRAL Recorder - You can not play while already playing or recording')
        }

        this.createTimer()
        var signalsCount = currentRecording.signals.length
        var startIndex = catchup.length
        for (var x = startIndex; x < signalsCount; x++) {
          var signal = currentRecording.signals[x]
          var durationTarget = signal.start - currentRecording.start - startSeek
          playbackTimers.push(setTimeout(triggerSignal.bind(null, signal), durationTarget))
        }
        isPlaying = true
        started = Date.now()
      },

      record: function (options) {
        if (signalStore.isRemembering()) {
          return
        }

        options = options || {}

        // If we are recording over the previous stuff, go back to start
        if (currentRecording) {
          this.resetState()
        }

        var paths = options.paths || [[]]
        var state = paths.map(function (path) {
          return {
            path: path,
            value: controller.get(path)
          }
        })

        currentRecording = {
          initialState: state,
          start: Date.now(),
          signals: []
        }

        isRecording = true
      },

      stop: function () {
        var wasPlaying = isPlaying
        clearTimeout(durationTimer)
        isPlaying = false
        isRecording = false

        if (signalStore.isRemembering() || wasPlaying) {
          return
        }

        currentRecording.end = Date.now()
        currentRecording.duration = currentRecording.end - currentRecording.start
      },

      pause: function pause () {
        if (signalStore.isRemembering()) {
          return
        }

        ended = Date.now()
        currentSeek = ended - started
        clearTimeout(durationTimer)
        playbackTimers.forEach(clearTimeout)
        isPlaying = false
      },

      addSignal: function (signal) {
        currentRecording.signals.push(signal)
      },

      isRecording: function () {
        return isRecording
      },

      isPlaying: function () {
        return isPlaying
      },

      isCatchingUp: function () {
        return isCatchingUp
      },

      getRecording: function () {
        return currentRecording
      },

      getCurrentSeek: function () {
        return currentSeek
      },

      loadRecording: function (recording) {
        currentRecording = recording
      }
    }

    // uncomment after merge with cerebral-module-recorder
    // module.services(services)
    controller.getRecorder = function getRecorder () {
      console.warn('Cerebral: controller.getRecorder() is deprecated. Please upgrade recorder module.')
      return services
    }

    controller.on('signalStart', function (args) {
      if (isRecording) services.addSignal(args.signal)
    })
  }
}
