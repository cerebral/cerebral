/* eslint-env mocha */
/* eslint-disable no-console */
const triggerUrlChange = require('./testHelper').triggerUrlChange

// Have to require due to mocks (load correct order)
const Controller = require('../../cerebral/src/Controller').default
const Router = require('../').default
const addressbar = require('addressbar')
const assert = require('assert')

describe('Router - matching', () => {
  beforeEach(() => {
    console.warn.warnings = []
    addressbar.value = addressbar.origin + '/'
    addressbar.removeAllListeners('change')
  })
  describe('full url', () => {
    it('root route', () => {
      let count = 0
      const controller = Controller({
        devtools: {init () {}, send () {}},
        router: Router({
          preventAutostart: true,
          routes: {
            '/': 'home'
          }
        }),
        signals: {
          'home': [() => { count++ }]
        }
      })

      triggerUrlChange('/')
      triggerUrlChange('/?query')
      triggerUrlChange('/#hash')
      triggerUrlChange('/?query#hash')
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
      triggerUrlChange('/path?query')
      triggerUrlChange('/path/#/')
      assert.equal(console.warn.warnings.length, 3)
    })
    it('simple route', () => {
      let count = 0
      const controller = Controller({
        devtools: {init () {}, send () {}},
        router: Router({
          preventAutostart: true,
          routes: {
            '/foo': 'home'
          }
        }),
        signals: {
          'home': [() => { count++ }]
        }
      })

      triggerUrlChange('/foo')
      triggerUrlChange('/foo?query')
      triggerUrlChange('/foo#hash')
      triggerUrlChange('/foo?query#hash')
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
      triggerUrlChange('/foo/path?query')
      triggerUrlChange('/foo/path/#/')
      assert.equal(console.warn.warnings.length, 3)
    })
    it('deep route', () => {
      let count = 0
      const controller = Controller({
        devtools: {init () {}, send () {}},
        router: Router({
          preventAutostart: true,
          routes: {
            '/foo/bar/baz/42': 'home'
          }
        }),
        signals: {
          'home': [() => { count++ }]
        }
      })

      triggerUrlChange('/foo/bar/baz/42')
      triggerUrlChange('/foo/bar/baz/42?query')
      triggerUrlChange('/foo/bar/baz/42#hash')
      triggerUrlChange('/foo/bar/baz/42?query#hash')
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
    it('params route', () => {
      let count = 0
      const controller = Controller({
        devtools: {init () {}, send () {}},
        router: Router({
          preventAutostart: true,
          routes: {
            '/foo/:param': 'home'
          }
        }),
        signals: {
          'home': [() => { count++ }]
        }
      })

      triggerUrlChange('/foo/foo')
      triggerUrlChange('/foo/bar')
      triggerUrlChange('/foo/bar?query')
      triggerUrlChange('/foo/bar#hash')
      triggerUrlChange('/foo/bar?query#hash')
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
    it('several params route', () => {
      let count = 0
      const controller = Controller({
        devtools: {init () {}, send () {}},
        router: Router({
          preventAutostart: true,
          routes: {
            '/foo/:param/:param2': 'home'
          }
        }),
        signals: {
          'home': [() => { count++ }]
        }
      })

      triggerUrlChange('/foo/foo/bar')
      triggerUrlChange('/foo/bar/bar')
      triggerUrlChange('/foo/foo/bar?query')
      triggerUrlChange('/foo/foo/bar#hash')
      triggerUrlChange('/foo/foo/bar?query#hash')
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
    it('regexp route', () => {
      let count = 0
      const controller = Controller({
        devtools: {init () {}, send () {}},
        router: Router({
          preventAutostart: true,
          routes: {
            '/foo/:param([\\w+-?]+)-test/:param2(%3A\\d+)': 'home'
          }
        }),
        signals: {
          'home': [() => { count++ }]
        }
      })

      triggerUrlChange('/foo/foo-test/%3A42')
      triggerUrlChange('/foo/foo-bar-test/%3A42')
      triggerUrlChange('/foo/foo-test/%3A42?query')
      triggerUrlChange('/foo/foo-test/%3A42#hash')
      triggerUrlChange('/foo/foo-test/%3A42?query#hash')
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
    it('catch all route', () => {
      let count = 0
      const controller = Controller({
        devtools: {init () {}, send () {}},
        router: Router({
          preventAutostart: true,
          routes: {
            '/*': 'home'
          }
        }),
        signals: {
          'home': [() => { count++ }]
        }
      })
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
  describe('with baseUrl option', () => {
    it('root route', () => {
      let count = 0
      const controller = Controller({
        devtools: {init () {}, send () {}},
        router: Router({
          baseUrl: '/base',
          preventAutostart: true,
          routes: {
            '/': 'home'
          }
        }),
        signals: {
          'home': [() => { count++ }]
        }
      })

      triggerUrlChange('/base')
      triggerUrlChange('/base?query')
      triggerUrlChange('/base#hash')
      triggerUrlChange('/base?query#hash')
      assert.equal(count, 4)

      assert.doesNotThrow(() => {
        controller.getSignal('home')({
          foo: 'bar'
        })
      })

      assert.doesNotThrow(() => {
        controller.getSignal('home')()
      })

      triggerUrlChange('/base/path')
      triggerUrlChange('/base/path?query')
      triggerUrlChange('/base/path/#/')
      assert.equal(console.warn.warnings.length, 3)
    })
  })
  describe('with onlyHash option', () => {
    it('root route', () => {
      let count = 0
      const controller = Controller({
        devtools: {init () {}, send () {}},
        router: Router({
          onlyHash: true,
          preventAutostart: true,
          routes: {
            '/': 'home'
          }
        }),
        signals: {
          'home': [() => { count++ }]
        }
      })

      triggerUrlChange('/#/')
      triggerUrlChange('/#/?query')
      triggerUrlChange('/#/#hash')
      triggerUrlChange('/#/?query#hash')
      triggerUrlChange('/')
      assert.equal(count, 5)

      assert.doesNotThrow(() => {
        controller.getSignal('home')({
          foo: 'bar'
        })
      })

      assert.doesNotThrow(() => {
        controller.getSignal('home')()
      })

      triggerUrlChange('/#/foo')
      triggerUrlChange('/foo#/')
      assert.equal(console.warn.warnings.length, 1)
      assert.equal(addressbar.value, addressbar.origin + '/foo#/')
    })
  })
  describe('with onlyHash and baseUrl option', () => {
    it('root route', () => {
      let count = 0
      const controller = Controller({
        devtools: {init () {}, send () {}},
        router: Router({
          onlyHash: true,
          baseUrl: '/base',
          preventAutostart: true,
          routes: {
            '/': 'home'
          }
        }),
        signals: {
          'home': [() => { count++ }]
        }
      })

      triggerUrlChange('/base/#/')
      triggerUrlChange('/base/#/?query')
      triggerUrlChange('/base/#/#hash')
      triggerUrlChange('/base/#/?query#hash')
      triggerUrlChange('/base/')
      assert.equal(count, 5)

      assert.doesNotThrow(() => {
        controller.getSignal('home')({
          foo: 'bar'
        })
      })

      assert.doesNotThrow(() => {
        controller.getSignal('home')()
      })

      triggerUrlChange('/base/#/foo')
      triggerUrlChange('/base/foo#/')
      assert.equal(console.warn.warnings.length, 1)
      assert.equal(addressbar.value, addressbar.origin + '/base/foo#/')
    })
  })
  describe('with onlyHash option and autodetected baseUrl', () => {
    it('root route', () => {
      addressbar.value = addressbar.origin + '/base/'
      let count = 0
      const controller = Controller({
        devtools: {init () {}, send () {}},
        router: Router({
          onlyHash: true,
          preventAutostart: true,
          routes: {
            '/': 'home'
          }
        }),
        signals: {
          'home': [() => { count++ }]
        }
      })

      triggerUrlChange('/base/#/')
      triggerUrlChange('/base/#/?query')
      triggerUrlChange('/base/#/#hash')
      triggerUrlChange('/base/#/?query#hash')
      triggerUrlChange('/base/')
      assert.equal(count, 5)

      assert.doesNotThrow(() => {
        controller.getSignal('home')({
          foo: 'bar'
        })
      })

      assert.doesNotThrow(() => {
        controller.getSignal('home')()
      })

      triggerUrlChange('/base/#/foo')
      triggerUrlChange('/base/foo#/')
      assert.equal(console.warn.warnings.length, 1)
      assert.equal(addressbar.value, addressbar.origin + '/base/foo#/')
    })
  })
})
