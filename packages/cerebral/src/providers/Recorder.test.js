/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'

const timeoutMock = () => {
  function timeout (callback, time) {
    timeout.callbacks.push({
      callback,
      time
    })
  }
  timeout.callbacks = []
  timeout.tick = () => {
    const firstTimeout = timeout.callbacks.shift()
    firstTimeout.callback()

    return firstTimeout.time
  }
  return timeout
}

describe('Recorder', () => {
  it('should record mutations', () => {
    const timeout = timeoutMock()
    const RecorderProvider = require('./Recorder').default
    const controller = new Controller({
      state: {
        foo: 'bar'
      },
      signals: {
        record: [({recorder}) => recorder.record()],
        update: [({state}) => state.set('foo', 'bar2')],
        stop: [({recorder}) => recorder.stop()],
        verify: [({recorder}) => {
          const recording = recorder.getRecording()
          assert.ok(recording.end)
          assert.ok(recording.start)
          assert.deepEqual(recording.initialState[0].path, [])
          assert.equal(recording.initialState[0].value, JSON.stringify({
            foo: 'bar'
          }))
          assert.equal(recording.events.length, 3)
        }]
      },
      providers: [RecorderProvider({
        setTimeout: timeout
      })]
    })
    controller.getSignal('record')()
    controller.getSignal('update')()
    controller.getSignal('stop')()
    controller.getSignal('verify')()
  })
  it('should replay mutations', () => {
    const timeout = timeoutMock()
    const RecorderProvider = require('./Recorder').default
    const now = Date.now()
    const recording = {
      start: now,
      end: now + 20,
      duration: 20,
      initialState: [{
        path: [],
        value: JSON.stringify({foo: 'bar2'})
      }],
      events: [{
        type: 'mutation',
        method: 'set',
        args: JSON.stringify(['foo', 'bar3']),
        timestamp: now + 10
      }]
    }
    const controller = new Controller({
      state: {
        foo: 'bar'
      },
      signals: {
        play: [({recorder}) => {
          recorder.loadRecording(recording)
          recorder.play({
            allowedSignals: ['stop']
          })
        }],
        stop: [({recorder}) => recorder.stop()]
      },
      providers: [RecorderProvider({
        setTimeout: timeout
      })]
    })
    controller.getSignal('play')()
    assert.deepEqual(controller.getState(), {
      foo: 'bar2'
    })
    timeout.tick()
    assert.deepEqual(controller.getState(), {
      foo: 'bar3'
    })
    controller.getSignal('stop')()
  })
  it('should allow option to extract specific paths as starting point', () => {
    const timeout = timeoutMock()
    const RecorderProvider = require('./Recorder').default
    const controller = new Controller({
      state: {
        foo: 'bar'
      },
      signals: {
        record: [({recorder}) => recorder.record({
          initialState: ['foo']
        })],
        update: [({state}) => state.set('foo', 'bar2')],
        stop: [({recorder}) => recorder.stop()],
        play: [({recorder}) => recorder.play({
          allowedSignals: ['stop']
        })]
      },
      providers: [RecorderProvider({
        setTimeout: timeout
      })]
    })
    controller.getSignal('record')()
    controller.getSignal('update')()
    controller.getSignal('stop')()
    controller.getSignal('update')()
    controller.getSignal('play')()
    assert.deepEqual(controller.getState(), {foo: 'bar'})
    controller.getSignal('stop')()
  })
  it('should prevent further signal execution', () => {
    const timeout = timeoutMock()
    const RecorderProvider = require('./Recorder').default
    const controller = new Controller({
      state: {
        foo: 'bar'
      },
      signals: {
        record: [({recorder}) => recorder.record({
          initialState: ['foo']
        })],
        update: [({state}) => state.set('foo', 'bar2')],
        update2: [({state}) => state.set('foo', 'bar3')],
        stop: [({recorder}) => recorder.stop()],
        play: [({recorder}) => recorder.play({
          allowedSignals: ['stop']
        })]
      },
      providers: [RecorderProvider({
        setTimeout: timeout
      })]
    })
    controller.getSignal('record')()
    controller.getSignal('update')()
    controller.getSignal('stop')()
    controller.getSignal('play')()
    timeout.tick() // flush
    timeout.tick()
    controller.getSignal('update2')()
    assert.deepEqual(controller.getState(), {foo: 'bar2'})
    controller.getSignal('stop')()
  })
  it('should emit flush event when playing back, on subsequente changes and as last event', (done) => {
    const timeout = timeoutMock()
    const RecorderProvider = require('./Recorder').default
    const controller = new Controller({
      state: {
        foo: 'bar'
      },
      signals: {
        record: [({recorder}) => recorder.record({
          initialState: ['foo']
        })],
        update: [({state}) => state.set('foo', 'bar2')],
        stop: [({recorder}) => recorder.stop()],
        play: [({recorder}) => recorder.play({
          allowedSignals: ['stop']
        })]
      },
      providers: [RecorderProvider({
        setTimeout: timeout
      })]
    })
    controller.getSignal('record')()
    controller.getSignal('update')()
    controller.getSignal('stop')()
    controller.once('flush', (changes) => {
      assert.deepEqual(changes, [{
        path: ['foo'],
        forceChildPathUpdates: true
      }])
    })
    controller.getSignal('play')()
    timeout.tick()
    controller.once('flush', (changes) => {
      assert.deepEqual(changes, [{
        path: ['foo'],
        forceChildPathUpdates: true
      }])
      controller.getSignal('stop')()
      done()
    })
  })
  it('should be able to pause and continue playback', () => {
    const timeout = timeoutMock()
    const RecorderProvider = require('./Recorder').default
    const now = Date.now()
    const recording = {
      start: now,
      end: now + 25,
      duration: 25,
      initialState: [{path: [], value: JSON.stringify({foo: 'bar'})}],
      events: [{
        type: 'mutation',
        method: 'set',
        args: JSON.stringify(['foo', 'bar2']),
        timestamp: now + 10
      }, {
        type: 'mutation',
        method: 'set',
        args: JSON.stringify(['foo', 'bar3']),
        timestamp: now + 20
      }, {
        type: 'mutation',
        method: 'set',
        args: JSON.stringify(['foo', 'bar4']),
        timestamp: now + 25
      }]
    }
    const controller = new Controller({
      state: {
        foo: 'bar'
      },
      signals: {
        play: [({recorder}) => {
          recorder.loadRecording(recording)
          recorder.play({
            allowedSignals: ['stop', 'pause']
          })
        }],
        pause: [({recorder}) => recorder.pause()],
        stop: [({recorder}) => recorder.stop()]
      },
      providers: [RecorderProvider({
        setTimeout: timeout
      })]
    })
    controller.getSignal('play')()
    assert.equal(timeout.tick(), 10)
    assert.deepEqual(controller.getState(), {
      foo: 'bar2'
    })
    assert.equal(timeout.tick(), 10)
    assert.deepEqual(controller.getState(), {
      foo: 'bar3'
    })
    controller.getSignal('pause')()
    controller.getSignal('play')()
    assert.equal(timeout.tick(), 5)
    assert.deepEqual(controller.getState(), {
      foo: 'bar4'
    })
    controller.getSignal('stop')()
  })
  it('should be able to seek', () => {
    const RecorderProvider = require('./Recorder').default
    const now = Date.now()
    const recording = {
      start: now,
      end: now + 25,
      duration: 25,
      initialState: [{path: [], value: JSON.stringify({foo: 'bar'})}],
      events: [{
        type: 'mutation',
        method: 'set',
        args: JSON.stringify(['foo', 'bar2']),
        timestamp: now + 10
      }, {
        type: 'mutation',
        method: 'set',
        args: JSON.stringify(['foo', 'bar3']),
        timestamp: now + 20
      }, {
        type: 'mutation',
        method: 'set',
        args: JSON.stringify(['foo', 'bar4']),
        timestamp: now + 25
      }]
    }
    const controller = new Controller({
      state: {
        foo: 'bar'
      },
      signals: {
        load: [({recorder}) => {
          recorder.loadRecording(recording)
        }],
        seek: [({recorder}) => recorder.seek(21)],
        stop: [({recorder}) => recorder.stop()]
      },
      providers: [RecorderProvider()]
    })
    controller.getSignal('load')()
    controller.getSignal('seek')()
    assert.deepEqual(controller.getState(), {
      foo: 'bar3'
    })
    controller.getSignal('stop')()
  })
  it('should emit events', () => {
    const timeout = timeoutMock()
    const RecorderProvider = require('./Recorder').default
    const controller = new Controller({
      state: {
        foo: 'bar'
      },
      signals: {
        record: [({recorder}) => recorder.record({
          initialState: ['foo']
        })],
        update: [({state}) => state.set('foo', 'bar2')],
        update2: [({state}) => state.set('foo', 'bar3')],
        stop: [({recorder}) => recorder.stop()],
        play: [({recorder}) => recorder.play({
          allowedSignals: ['stop']
        })]
      },
      providers: [RecorderProvider({
        setTimeout: timeout
      })]
    })
    let eventsCount = 0
    controller.on('recorder:record', () => {
      eventsCount++
    })
    controller.on('recorder:stop', () => {
      eventsCount++
    })
    controller.on('recorder:play', () => {
      eventsCount++
    })
    controller.getSignal('record')()
    controller.getSignal('update')()
    controller.getSignal('stop')()
    controller.getSignal('play')()
    timeout.tick() // flush
    timeout.tick()
    controller.getSignal('update2')()
    assert.deepEqual(controller.getState(), {foo: 'bar2'})
    controller.getSignal('stop')()
    assert(eventsCount, 4)
  })
  it('should add external events', () => {
    const timeout = timeoutMock()
    const RecorderProvider = require('./Recorder').default
    const controller = new Controller({
      state: {
        foo: 'bar'
      },
      signals: {
        record: [({recorder}) => recorder.record({
          initialState: ['foo']
        })],
        update: [({state}) => state.set('foo', 'bar2')],
        update2: [({state}) => state.set('foo', 'bar3')],
        stop: [({recorder}) => recorder.stop()],
        play: [({recorder}) => recorder.play({
          allowedSignals: ['stop']
        })]
      },
      providers: [RecorderProvider({
        setTimeout: timeout
      })]
    })
    let eventsCount = 0
    controller.on('test', (data) => {
      assert.equal(data, 'foo')
      eventsCount++
    })
    controller.getSignal('record')()
    controller.getSignal('update')()
    controller.emit('recorder:event', 'test', 'foo')
    controller.getSignal('stop')()
    controller.getSignal('play')()
    timeout.tick() // flush
    timeout.tick()
    timeout.tick()
    controller.getSignal('stop')()
    assert(eventsCount, 1)
  })
})
