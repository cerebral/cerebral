/* eslint-env mocha */
import {Controller} from '../'
import assert from 'assert'

describe('Debugger', () => {
  it('should send debuggerData', () => {
    const controller = new Controller({
      devtools: { init () {}, send () {}, sendExecutionData (debuggerData) { assert.equal(debuggerData, 1) } },
      signals: {
        foo: [(context) => { context.debugger.send(1) }]
      }
    })
    controller.getSignal('foo')()
  })
  it('should wrap provider', () => {
    function MyProvider (options = {}) {
      let cachedProvider = null

      function createProvider (context) {
        return {
          doSomething () {}
        }
      }

      return (context) => {
        context.myProvider = cachedProvider = cachedProvider || createProvider(context)

        if (context.debugger) {
          context.debugger.wrapProvider('myProvider')
        }

        return context
      }
    }
    const controller = new Controller({
      devtools: {
        init () {},
        send () {},
        sendExecutionData (debuggerData) {
          assert.deepEqual(debuggerData,
            {
              method: 'myProvider.doSomething',
              args: [ 1 ]
            }
          )
        }
      },
      providers: [
        MyProvider()
      ],
      signals: {
        foo: [
          ({myProvider}) => {
            myProvider.doSomething(1)
          }
        ]
      }
    })
    controller.getSignal('foo')()
  })
  it('throw send debuggerData', () => {
    const controller = new Controller({
      devtools: { init () {}, send () {}, sendExecutionData () {}, preventPropsReplacement: true },
      signals: {
        foo: [() => {}]
      }
    })
    controller.getSignal('foo')()
  })
})
