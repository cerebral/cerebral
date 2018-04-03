/* eslint-env mocha */
import { Controller, Module } from 'cerebral'
import StorageProvider, { StorageProviderError } from './'
import { setStorage, removeStorage, getStorage } from './operators'
import assert from 'assert'

function StorageMock(async, errorMessage) {
  const storage = {}

  if (async) {
    return {
      setItem(key, value) {
        storage[key] = value

        return errorMessage
          ? Promise.reject(new Error(errorMessage))
          : Promise.resolve()
      },
      getItem(key) {
        return errorMessage
          ? Promise.reject(new Error(errorMessage))
          : Promise.resolve(storage[key])
      },
      removeItem(key) {
        delete storage[key]

        return errorMessage
          ? Promise.reject(new Error(errorMessage))
          : Promise.resolve()
      },
    }
  }

  return {
    setItem(key, value) {
      storage[key] = value
    },
    getItem(key) {
      return storage[key]
    },
    removeItem(key) {
      delete storage[key]
    },
  }
}

describe('Storage Provider', () => {
  describe('sync', () => {
    it('should set value in storage', () => {
      const target = StorageMock()
      const rootModule = Module({
        modules: {
          storage: StorageProvider({
            target,
          }),
        },
        signals: {
          test: setStorage('foo', 'bar'),
        },
      })
      const controller = Controller(rootModule)

      controller.getSignal('test')()
      assert.equal(target.getItem('foo'), JSON.stringify('bar'))
    })
    it('should get value in storage', () => {
      const target = StorageMock()
      const rootModule = Module({
        modules: {
          storage: StorageProvider({
            target,
          }),
        },
        signals: {
          test: [
            setStorage('foo', 'bar'),
            getStorage('foo'),
            ({ props }) => assert.equal(props.value, 'bar'),
          ],
        },
      })
      const controller = Controller(rootModule)
      controller.getSignal('test')()
    })
    it('should remove value in storage', () => {
      const target = StorageMock()
      const rootModule = Module({
        modules: {
          storage: StorageProvider({
            target,
          }),
        },
        signals: {
          test: [
            setStorage('foo', 'bar'),
            getStorage('foo'),
            ({ props }) => assert.equal(props.value, 'bar'),
            removeStorage('foo'),
            ({ props }) => assert.equal(target.getItem('foo'), undefined),
          ],
        },
      })
      const controller = Controller(rootModule)
      controller.getSignal('test')()
    })
  })
  describe('async', () => {
    it('should set value in storage', (done) => {
      const target = StorageMock(true)
      const rootModule = Module({
        modules: {
          storage: StorageProvider({
            target,
          }),
        },
        signals: {
          test: [
            setStorage('foo', 'bar'),
            () => {
              return target.getItem('foo').then((value) => {
                assert.equal(value, JSON.stringify('bar'))
                done()
              })
            },
          ],
        },
      })
      const controller = Controller(rootModule)
      controller.getSignal('test')()
    })
    it('should get value in storage', (done) => {
      const target = StorageMock(true)
      const rootModule = Module({
        modules: {
          storage: StorageProvider({
            target,
          }),
        },
        signals: {
          test: [
            setStorage('foo', 'bar'),
            getStorage('foo'),
            ({ props }) => {
              assert.equal(props.value, 'bar')
              done()
            },
          ],
        },
      })
      const controller = Controller(rootModule)

      controller.getSignal('test')()
    })
    it('should remove value in storage', (done) => {
      const target = StorageMock(true)
      const rootModule = Module({
        modules: {
          storage: StorageProvider({
            target,
          }),
        },
        signals: {
          test: [
            setStorage('foo', 'bar'),
            getStorage('foo'),
            ({ props }) => {
              assert.equal(props.value, 'bar')
            },
            removeStorage('foo'),
            getStorage('foo'),
            ({ props }) => {
              assert.equal(props.value, undefined)
              done()
            },
          ],
        },
      })
      const controller = Controller(rootModule)
      controller.getSignal('test')()
    })
    it('should throw StorageProviderError', (done) => {
      const target = StorageMock(true, 'error')
      const rootModule = Module({
        modules: {
          storage: StorageProvider({
            target,
          }),
        },
        signals: {
          test: [
            setStorage('foo', 'bar'),
            {
              success: [],
              error: [
                ({ props }) => {
                  assert.ok(props.error instanceof StorageProviderError)
                  done()
                },
              ],
            },
          ],
        },
      })
      const controller = Controller(rootModule)
      controller.getSignal('test')()
    })
  })
  it('should use prefix if defined', () => {
    const target = StorageMock()
    const rootModule = Module({
      modules: {
        storage: StorageProvider({
          target,
          prefix: 'bah',
        }),
      },
      signals: {
        test: setStorage('foo', 'bar'),
      },
    })
    const controller = Controller(rootModule)
    controller.getSignal('test')()
    assert.equal(target.getItem('bah.foo'), JSON.stringify('bar'))
  })
  it('should sync defined state changes with storage', () => {
    const target = StorageMock()
    const rootModule = Module({
      state: {
        foo: 'bar',
      },
      modules: {
        storage: StorageProvider({
          target,
          sync: {
            foo: 'foo',
          },
        }),
      },
      signals: {
        test: [({ state }) => state.set('foo', 'bar2')],
      },
    })
    const controller = Controller(rootModule)
    controller.getSignal('test')()
    assert.equal(target.getItem('foo'), JSON.stringify('bar2'))
  })
  it('should sync defined state changes with storage on initialization', () => {
    const target = StorageMock()
    target.setItem('foo', JSON.stringify('bar2'))
    const rootModule = Module({
      state: {
        foo: 'bar',
      },
      modules: {
        storage: StorageProvider({
          target,
          sync: {
            foo: 'foo',
          },
        }),
      },
    })
    const controller = Controller(rootModule)
    assert.equal(controller.getState('foo'), 'bar2')
  })
})
