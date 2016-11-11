/* eslint-env mocha */
/* eslint-disable no-console */
const triggerUrlChange = require('./testHelper').triggerUrlChange

// Have to require due to mocks (load correct order)
const Controller = require('../../cerebral/src/Controller').default
const Router = require('../src').default
const addressbar = require('addressbar')
const assert = require('assert')

/*
  TODO: /:param urls FAIL
*/
describe('Router', () => {
  beforeEach(() => {
    console.warn.warnings = []
    addressbar.value = '/'
    addressbar.removeAllListeners('change')
  })
  it('should be able to define routes as config', () => {
    let count = 0
    Controller({
      devtools: {init () {}, send () {}},
      router: Router({
        routes: {
          '/': 'test'
        }
      }),
      signals: {
        test: [() => { count++ }]
      }
    })
    assert.equal(count, 1)
  })
  /*
  it('should expose base router and accept custom mapper', () => {
    let count = 0
    Controller({
      router: Router({
        routes: {
          '/': 'test'
        }
      }),
      signals: {
        test: [() => { count++ }]
      }
    })
    assert.equal(count, 1)
  })
  */
  it('should not trigger if preventAutostart option was provided', () => {
    let count = 0
    Controller({
      devtools: {init () {}, send () {}},
      router: Router({
        preventAutostart: true,
        routes: {
          '/': 'test'
        }
      }),
      signals: {
        test: [() => { count++ }]
      }
    })
    assert.equal(count, 0)
  })
  it('should support nested route definitions', () => {
    let count = 0
    Controller({
      devtools: {init () {}, send () {}},
      router: Router({
        routes: {
          '/': 'foo',
          '/bar': {
            '/': 'bar',
            '/baz': {
              '/': 'baz'
            }
          }
        }
      }),
      signals: {
        foo: [() => { count++ }],
        bar: [() => { count++ }],
        baz: [() => { count++ }]
      }
    })
    triggerUrlChange('/bar')
    triggerUrlChange('/bar/baz')
    assert.equal(count, 3)
  })
  it('should throw on missing signal', () => {
    assert.throws(() => {
      Controller({
        devtools: {init () {}, send () {}},
        router: Router({
          routes: {
            '/': 'test'
          }
        })
      })
    })
  })
  it('should throw on duplicate signal', () => {
    assert.throws(() => {
      Controller({
        devtools: {init () {}, send () {}},
        router: Router({
          routes: {
            '/': 'test',
            '/foo': 'test'
          }
        }),
        signals: {
          test: []
        }
      })
    })
  })
  it('should expose `getUrl` method on router provider', () => {
    addressbar.value = addressbar.origin + '/test'
    const controller = Controller({
      devtools: {init () {}, send () {}},
      router: Router({
        baseUrl: '/test',
        onlyHash: true,
        preventAutostart: true,
        routes: {
          '/': 'test'
        }
      }),
      signals: {
        test: [
          function action ({router}) {
            assert.equal(addressbar.value, 'http://localhost:3000/test/#/')
            assert.equal(router.getUrl(), '/')
          }
        ]
      }
    })
    controller.getSignal('test')({param: 'param'})
  })
  it('should update addressbar for routable signal call', () => {
    const controller = Controller({
      devtools: {init () {}, send () {}},
      router: Router({
        preventAutostart: true,
        routes: {
          '/': 'home',
          '/test': 'test'
        }
      }),
      signals: {
        home: [],
        test: []
      }
    })
    controller.getSignal('test')()

    assert.equal(addressbar.pathname, '/test')
  })
  /*
    TODO: Preserving URL should rather be done by "stringify", by checking if query
    option is on. If it is on it will of course stringify, but if not it should just keep
    the query "as is"
  it('should preserve addressbar value for signal triggered by route', () => {
    Controller({
      signals: {
        test: []
      },
      modules: {
        router: Router({
          '/test': 'test'
        }, {
          mapper: urlMapper(),
          preventAutostart: true
        })
      }
    })
    triggerUrlChange('/test?foo=bar')
    assert.equal(addressbar.value, addressbar.origin + '/test?query')
  })
  */
  it('should not update addressbar for regular signal call', () => {
    addressbar.value = addressbar.origin + '/test'
    let count = 0
    const controller = Controller({
      devtools: {init () {}, send () {}},
      router: Router({
        routes: {
          '/test': 'test'
        }
      }),
      signals: {
        test: [],
        foo: [() => { count++ }]
      }
    })
    controller.getSignal('foo')()
    assert.equal(addressbar.pathname, '/test')
    assert.equal(count, 1)
  })
  it('should allow redirect to url and trigger corresponded signal', (done) => {
    Controller({
      devtools: {init () {}, send () {}},
      router: Router({
        routes: {
          '/': 'doRedirect',
          '/existing/:string/:bool/:num': 'existing'
        }
      }),
      signals: {
        doRedirect: [({router}) => router.redirect('/existing/foo/%3Atrue/%3A42')],
        existing: [({input}) => {
          assert.equal(input.string, 'foo')
          assert.equal(input.bool, true)
          assert.equal(input.num, 42)
          assert.equal(addressbar.pathname, '/existing/foo/%3Atrue/%3A42')
          done()
        }]
      }
    })
  })
  it('should replaceState on redirect by default', () => {
    Controller({
      devtools: {init () {}, send () {}},
      router: Router({
        preventAutostart: true,
        routes: {
          '/foo': 'doRedirect',
          '/existing': 'existing'
        }
      }),
      signals: {
        doRedirect: [({router}) => router.redirect('/existing')],
        existing: [({input}) => {
          assert.equal(input.string, 'foo')
          assert.equal(input.bool, true)
          assert.equal(input.num, 42)
          assert.equal(addressbar.pathname, '/existing/foo/%3Atrue/%3A42')
        }]
      }
    })
  })
  it('should expose goTo on context provider', (done) => {
    Controller({
      devtools: {init () {}, send () {}},
      router: Router({
        preventAutostart: true,
        routes: {
          '/foo': 'doRedirect',
          '/existing': 'existing'
        }
      }),
      signals: {
        doRedirect: [({router}) => router.goTo('/existing')],
        existing: [() => {
          assert.equal(addressbar.pathname, '/existing')
          assert.equal(window.location.lastChangedWith, 'pushState')
          done()
        }]
      }
    })
    triggerUrlChange('/foo')
  })
  it('should allow redirect to signal', (done) => {
    const controller = Controller({
      devtools: {init () {}, send () {}},
      router: Router({
        preventAutostart: true,
        routes: {
          '/': 'home',
          '/foo/:id': 'detail'
        }
      }),
      signals: {
        'home': [],
        'createClicked': [
          function createEntity ({router}) {
            const entityId = 42
            router.redirectToSignal('detail', { id: entityId })
          }
        ],
        'detail': [
          function checkAction ({input}) {
            assert.equal(input.id, 42)
            assert.equal(addressbar.pathname, '/foo/%3A42')
            done()
          }
        ]
      }
    })

    controller.getSignal('createClicked')()
  })
  it('should warn if trying redirect to signal not bound to route', () => {
    const controller = Controller({
      devtools: {init () {}, send () {}},
      router: Router({
        preventAutostart: true,
        routes: {
          '/': 'home'
        }
      }),
      signals: {
        'home': [],
        'createClicked': [
          function createEntity ({router}) {
            const entityId = 42
            router.redirectToSignal('detail', { id: entityId })
          }
        ],
        'detail': []
      }
    })

    controller.getSignal('createClicked')()
    assert.equal(console.warn.warnings.length, 1)
  })
  it('should prevent navigation and warn when no signals was matched', () => {
    Controller({
      devtools: {init () {}, send () {}},
      router: Router({
        baseUrl: '/base',
        preventAutostart: true,
        routes: {
          '/': 'home'
        }
      }),
      signals: {
        'home': []
      }
    })

    triggerUrlChange('/missing')
    assert.equal(console.warn.warnings.length, 0)

    triggerUrlChange('/base/missing')
    assert.equal(console.warn.warnings.length, 1)
  })
  it('should not prevent navigation when no signals was matched if allowEscape option was provided', () => {
    Controller({
      devtools: {init () {}, send () {}},
      router: Router({
        baseUrl: '/base',
        allowEscape: true,
        preventAutostart: true,
        routes: {
          '/': 'home'
        }
      }),
      signals: {
        'home': []
      }
    })

    triggerUrlChange('/missing')
    assert.equal(console.warn.warnings.length, 0)

    triggerUrlChange('/base/missing')
    assert.equal(console.warn.warnings.length, 0)
  })
})
