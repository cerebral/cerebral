/* eslint-env mocha */
import FunctionTree from '../'
import assert from 'assert'

describe('PathProvider', () => {
  it('should add path function when paths can be taken', () => {
    const ft = new FunctionTree()

    ft.run([
      ({path}) => {
        assert.ok(path.success)
        assert.ok(path.error)
        return path.success()
      }, {
        success: [],
        error: []
      }
    ])
  })
  it('should NOT add path function when paths can NOT be taken', () => {
    const ft = new FunctionTree()

    ft.run([
      ({path}) => {
        assert.ok(!path)
      }
    ])
  })
  it('should have possible outputs as methods', () => {
    const ft = new FunctionTree()

    ft.run([
      ({path}) => {
        assert.ok(path.foo)
        assert.ok(path.bar)
        return path.foo()
      }, {
        foo: [],
        bar: []
      }
    ])
  })
  it('should go down path based on method used', (done) => {
    const ft = new FunctionTree()

    ft.run([
      ({path}) => {
        return path.foo()
      }, {
        foo: [
          () => {
            assert.ok(true)
            done()
          }
        ],
        bar: []
      }
    ])
  })
  it('should pass payload down paths', (done) => {
    const ft = new FunctionTree()

    ft.run([
      ({path}) => {
        return path.foo({foo: 'bar'})
      }, {
        foo: [
          ({props}) => {
            assert.deepEqual(props, {foo: 'bar'})
            done()
          }
        ],
        bar: []
      }
    ])
  })
  it('should pass payload async', (done) => {
    function actionA ({path}) {
      return new Promise((resolve) => {
        setTimeout(function () {
          resolve(path.foo({foo: 'bar'}))
        })
      })
    }

    function actionB ({props}) {
      assert.deepEqual(props, {foo: 'bar'})
    }

    const ft = new FunctionTree()

    ft.run([
      actionA, {
        foo: [
          actionB
        ],
        bar: []
      }
    ]).then(() => done())
  })
})
