/* eslint-env mocha */
/* eslint-disable no-console */
const {makeTest, triggerUrlChange} = require('./testHelper')

// Have to require due to mocks (load correct order)
const Router = require('../').default
const addressbar = require('addressbar')
const assert = require('assert')

describe('matching', () => {
  beforeEach(() => {
    console.warn.warnings = []
    addressbar.value = addressbar.origin + '/'
    addressbar.removeAllListeners('change')
  })

  it('should match root route', () => {
    let count = 0
    const controller = makeTest(
      Router({
        preventAutostart: true,
        routes: {
          '/': 'home'
        }
      }), {
        'home': [() => { count++ }]
      }
    )

    triggerUrlChange('/')
    triggerUrlChange('/?query=')
    triggerUrlChange('/#hash')
    triggerUrlChange('/?query=#hash')
    assert.equal(count, 4)

    assert.doesNotThrow(() => {
      controller.getSignal('home')({
        foo: 'bar'
      })
    })

    assert.doesNotThrow(() => {
      controller.getSignal('home')()
    })

    triggerUrlChange('/path')
    triggerUrlChange('/path?query=')
    triggerUrlChange('/path/#/')
    assert.equal(console.warn.warnings.length, 3)
  })

  it('should match simple route', () => {
    let count = 0
    const controller = makeTest(
      Router({
        preventAutostart: true,
        routes: {
          '/foo': 'home'
        }
      }), {
        'home': [() => { count++ }]
      }
    )

    triggerUrlChange('/foo')
    triggerUrlChange('/foo?query=')
    triggerUrlChange('/foo#hash')
    triggerUrlChange('/foo?query=#hash')
    assert.equal(count, 4)

    assert.doesNotThrow(() => {
      controller.getSignal('home')({
        foo: 'bar'
      })
    })

    assert.doesNotThrow(() => {
      controller.getSignal('home')()
    })

    triggerUrlChange('/foo/path')
    triggerUrlChange('/foo/path?query=')
    triggerUrlChange('/foo/path/#/')
    assert.equal(console.warn.warnings.length, 3)
  })

  it('should match deep route', () => {
    let count = 0
    const controller = makeTest(
      Router({
        preventAutostart: true,
        routes: {
          '/foo/bar/baz/42': 'home'
        }
      }), {
        'home': [() => { count++ }]
      }
    )

    triggerUrlChange('/foo/bar/baz/42')
    triggerUrlChange('/foo/bar/baz/42?query=')
    triggerUrlChange('/foo/bar/baz/42#hash')
    triggerUrlChange('/foo/bar/baz/42?query=#hash')
    assert.equal(count, 4)

    assert.doesNotThrow(() => {
      controller.getSignal('home')({
        foo: 'bar'
      })
    })

    assert.doesNotThrow(() => {
      controller.getSignal('home')()
    })

    triggerUrlChange('/foo/bar/baz/')
    triggerUrlChange('/foo/bar/baz/43')
    triggerUrlChange('/foo/bar/baz/42/foo')
    triggerUrlChange('/#/foo/bar/baz/42')
    assert.equal(console.warn.warnings.length, 4)
  })

  it('should match params route', () => {
    let count = 0
    const controller = makeTest(
      Router({
        preventAutostart: true,
        routes: {
          '/foo/:param': 'home'
        }
      }), {
        'home': [() => { count++ }]
      }
    )

    triggerUrlChange('/foo/foo')
    triggerUrlChange('/foo/bar')
    triggerUrlChange('/foo/bar?query=')
    triggerUrlChange('/foo/bar#hash')
    triggerUrlChange('/foo/bar?query=#hash')
    assert.equal(count, 5)

    assert.doesNotThrow(() => {
      controller.getSignal('home')({
        param: 'bar'
      })
    })

    assert.throws(() => {
      controller.getSignal('home')()
    })

    triggerUrlChange('/bar')
    triggerUrlChange('/#/bar')
    assert.equal(console.warn.warnings.length, 2)
  })

  it('should match several params route', () => {
    let count = 0
    const controller = makeTest(
      Router({
        preventAutostart: true,
        routes: {
          '/foo/:param/:param2': 'home'
        }
      }), {
        'home': [() => { count++ }]
      }
    )

    triggerUrlChange('/foo/foo/bar')
    triggerUrlChange('/foo/bar/bar')
    triggerUrlChange('/foo/foo/bar?query=')
    triggerUrlChange('/foo/foo/bar#hash')
    triggerUrlChange('/foo/foo/bar?query=#hash')
    assert.equal(count, 5)

    assert.doesNotThrow(() => {
      controller.getSignal('home')({
        param: 'bar',
        param2: 'foo'
      })
    })

    assert.throws(() => {
      controller.getSignal('home')()
    })

    assert.throws(() => {
      controller.getSignal('home')({
        param: 'bar'
      })
    })

    triggerUrlChange('/foo/bar')
    triggerUrlChange('/#/foo/bar/hih')
    assert.equal(console.warn.warnings.length, 2)
  })

  it('should match regexp route', () => {
    let count = 0
    const controller = makeTest(
      Router({
        preventAutostart: true,
        routes: {
          '/foo/:param([\\w+-?]+)-test/:param2(%3A\\d+)': 'home'
        }
      }), {
        'home': [() => { count++ }]
      }
    )

    triggerUrlChange('/foo/foo-test/%3A42')
    triggerUrlChange('/foo/foo-bar-test/%3A42')
    triggerUrlChange('/foo/foo-test/%3A42?query=')
    triggerUrlChange('/foo/foo-test/%3A42#hash')
    triggerUrlChange('/foo/foo-test/%3A42?query=#hash')
    assert.equal(count, 5)

    assert.doesNotThrow(() => {
      controller.getSignal('home')({
        param: 'foo',
        param2: 42
      })
    })

    assert.throws(() => {
      controller.getSignal('home')()
    })

    assert.throws(() => {
      controller.getSignal('home')({
        param: 'foo',
        param2: 'bar'
      })
    })

    triggerUrlChange('/foo/footest/%3A42')
    triggerUrlChange('/foo/foo-test/bar')
    triggerUrlChange('/foo/#/foo-test/%3A42')
    assert.equal(console.warn.warnings.length, 3)
  })

  it('should match catch route', () => {
    let count = 0
    const controller = makeTest(
      Router({
        preventAutostart: true,
        routes: {
          '/*': 'home'
        }
      }), {
        'home': [() => { count++ }]
      }
    )
    triggerUrlChange('/')
    triggerUrlChange('/foo')
    triggerUrlChange('/foo/bar/baz')
    assert.equal(count, 3)

    assert.doesNotThrow(() => {
      controller.getSignal('home')({
        0: 'bar'
      })
    })

    assert.throws(() => {
      controller.getSignal('home')()
    })
  })
})
