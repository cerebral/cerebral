/* eslint-env mocha */
/* eslint-disable no-console */
const state = require('../../cerebral/src/tags').state
const props = require('../../cerebral/src/tags').props
const assert = require('assert')
const {flattenConfig} = require('./utils')

describe('flattenConfig', () => {
  it('should handle object config', () => {
    const config = {
      '/some/url': 'some.signal',
      '/other/url': 'other.signal'
    }
    assert.deepEqual(flattenConfig(config), {
      '/some/url': {
        signal: 'some.signal'
      },
      '/other/url': {
        signal: 'other.signal'
      }
    })
  })

  it('should handle nested object config', () => {
    const config = {
      '/': 'base.signal',
      '/foo': {
        '/': 'foo.signal',
        '/baz': {
          '/': 'baz.signal'
        }
      }
    }
    assert.deepEqual(flattenConfig(config), {
      '/': {
        signal: 'base.signal'
      },
      '/foo/': {
        signal: 'foo.signal'
      },
      '/foo/baz/': {
        signal: 'baz.signal'
      }
    })
  })

  it('should handle array config', () => {
    const config = [
      {path: '/some/url', signal: 'some.signal'},
      {path: '/other/url', signal: 'other.signal'}
    ]
    assert.deepEqual(flattenConfig(config), {
      '/some/url': {
        signal: 'some.signal'
      },
      '/other/url': {
        signal: 'other.signal'
      }
    })
  })

  it('should handle nested array config', () => {
    const config = [
      {
        path: '/foo',
        signal: 'foo.signal',
        routes: {
          '/bing': 'bing.signal',
          '/bar': {
            '/': 'bar.signal',
            '/baz': 'baz.signal'
          }
        }
      },
      {path: '/other/url', signal: 'other.signal'}
    ]
    assert.deepEqual(flattenConfig(config), {
      '/foo': {
        signal: 'foo.signal'
      },
      '/foo/bing': {
        signal: 'bing.signal'
      },
      '/foo/bar/': {
        signal: 'bar.signal'
      },
      '/foo/bar/baz': {
        signal: 'baz.signal'
      },
      '/other/url': {
        signal: 'other.signal'
      }
    })
  })

  it('should parse map parameter', () => {
    const config = flattenConfig([
      {
        path: '/settings/:tab',
        // the 'focus' parameter is expected in the query
        map: {tab: props`tab`, focus: props`focus`},
        signal: 'some.signal'
      },
      {
        path: '/view/:view',
        map: {view: state`app.view`},
        signal: 'app.viewRouted'
      },
      {
        path: '/other/url',
        signal: 'other.signal'
      }
    ])
    Object.keys(config).forEach(key => {
      config[key] = Object.keys(config[key])
    })

    assert.deepEqual(config, {
      '/settings/:tab': ['signal', 'map', 'propsMapping'],
      '/view/:view': ['signal', 'map', 'stateMapping'],
      '/other/url': ['signal']
    })
  })
})
