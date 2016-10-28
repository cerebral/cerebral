/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {concat, debounce, filter, input, merge, pop, push, set, shift, splice, state, toggle, unset, unshift, wait, when} from './'

describe('Operators', () => {
  it('should be able to nest template tags', () => {
    const controller = new Controller({
      state: {
        tip: '',
        userNames: {
          joe: 'Joe'
        }
      },
      signals: {
        test: [
          set(state`tip`, state`userNames.${input`userId`}`)
        ]
      }
    })
    controller.getSignal('test')({userId: 'joe'})
    assert.equal(controller.getState().tip, 'Joe')
  })
  it('should be able to nest multiple template tags', () => {
    const controller = new Controller({
      state: {
        tip: '',
        users: {
          admin: {
            joe: {
              name: 'Joe'
            }
          }
        }
      },
      signals: {
        test: [
          set(state`tip`, state`users.${input`type`}.${input`userId`}.${input`field`}`)
        ]
      }
    })
    controller.getSignal('test')({type: 'admin', userId: 'joe', field: 'name'})
    assert.equal(controller.getState().tip, 'Joe')
  })
  describe('debounce', () => {
    it('should debounce execution', (done) => {
      let discardedCount = 0
      const controller = new Controller({
        signals: {
          test: [
            debounce(50, [
              () => {
                assert.equal(discardedCount, 1)
                done()
              }
            ]),
            () => { discardedCount++ }
          ]
        }
      })
      controller.getSignal('test')()
      setTimeout(() => {
        controller.getSignal('test')()
      }, 10)
    })
  })
  describe('filter', () => {
    it('should filter input', () => {
      let accepted = 0
      let discarded = 0
      const controller = new Controller({
        signals: {
          test: [
            filter(input`value`, (value) => Boolean(value.length)), {
              accepted: [
                () => { accepted++ }
              ],
              discarded: [
                () => { discarded++ }
              ]
            }
          ]
        }
      })
      controller.getSignal('test')({value: ''})
      controller.getSignal('test')({value: 'foo'})
      assert.equal(accepted, 1)
      assert.equal(discarded, 1)
    })
    it('should filter state', () => {
      let discarded = 0
      const controller = new Controller({
        state: {
          foo: 'bar'
        },
        signals: {
          test: [
            filter(state`foo`, (value) => value === 'bar'), {
              accepted: [
                ({state}) => { state.set('foo', 'bar2') }
              ],
              discarded: [
                () => { discarded++ }
              ]
            }
          ]
        }
      })
      controller.getSignal('test')()
      controller.getSignal('test')()
      assert.equal(discarded, 1)
    })
  })
  describe('toggle', () => {
    it('should toggle state', () => {
      const controller = new Controller({
        state: {
          foo: true
        },
        signals: {
          test: [
            toggle(state`foo`)
          ]
        }
      })
      controller.getSignal('test')()
      assert.deepEqual(controller.getState(), {foo: false})
    })
    it('should toggle state with input', () => {
      const controller = new Controller({
        state: {
          todos: {
            one: true,
            two: false
          }
        },
        signals: {
          test: [
            toggle(state`todos.${input`ref`}`)
          ]
        }
      })
      controller.getSignal('test')({ref: 'one'})
      assert.deepEqual(controller.getState(), {todos: {one: false, two: false}})
    })
  })
  describe('when', () => {
    it('should check truthy value of input', () => {
      let count = 0
      const controller = new Controller({
        signals: {
          test: [
            when(input`foo`), {
              true: [() => { count++ }],
              false: []
            }
          ]
        }
      })
      controller.getSignal('test')({foo: 'bar'})
      assert.equal(count, 1)
    })
    it('should check truthy value of state', () => {
      let count = 0
      const controller = new Controller({
        state: {
          foo: false
        },
        signals: {
          test: [
            when(state`foo`), {
              true: [],
              false: [() => { count++ }]
            }
          ]
        }
      })
      controller.getSignal('test')()
      assert.equal(count, 1)
    })
  })
  describe('wait', () => {
    it('should hold execution for set time', (done) => {
      const start = Date.now()
      const controller = new Controller({
        signals: {
          test: [
            wait(100),
            () => {
              assert.ok(Date.now() - start >= 100)
              done()
            }
          ]
        }
      })
      controller.getSignal('test')()
    })
  })
  describe('set', () => {
    it('should set value to model', () => {
      const controller = new Controller({
        state: {
          foo: 'bar'
        },
        signals: {
          test: [
            set(state`foo`, 'bar2')
          ]
        }
      })
      controller.getSignal('test')()
      assert.deepEqual(controller.getState(), {foo: 'bar2'})
    })
    it('should set non string value to model', () => {
      const controller = new Controller({
        state: {
          foo: 'bar'
        },
        signals: {
          test: [
            set(state`foo`, {bar: 'baz'})
          ]
        }
      })
      controller.getSignal('test')()
      assert.deepEqual(controller.getState(), {foo: {bar: 'baz'}})
    })
    it('should set value to model from input', () => {
      const controller = new Controller({
        state: {
          foo: 'bar'
        },
        signals: {
          test: [
            set(state`foo`, input`value`)
          ]
        }
      })
      controller.getSignal('test')({
        value: 'bar2'
      })
      assert.deepEqual(controller.getState(), {foo: 'bar2'})
    })
    it('should set value to model from model', () => {
      const controller = new Controller({
        state: {
          foo: 'bar',
          grabValue: 'bar2'
        },
        signals: {
          test: [
            set(state`foo`, state`grabValue`)
          ]
        }
      })
      controller.getSignal('test')()
      assert.equal(controller.getState().foo, 'bar2')
    })
  })
  describe('concat', () => {
    it('should concat literal array in model', () => {
      const controller = new Controller({
        state: {
          list: ['one']
        },
        signals: {
          test: [
            concat(state`list`, ['two'])
          ]
        }
      })
      controller.getSignal('test')()
      assert.deepEqual(controller.getState(), {list: ['one', 'two']})
    })
    it('should concat state array in model', () => {
      const controller = new Controller({
        state: {
          list: ['one'],
          list2: ['two', 'three']
        },
        signals: {
          test: [
            concat(state`list`, state`list2`)
          ]
        }
      })
      controller.getSignal('test')()
      assert.deepEqual(controller.getState(), {list: ['one', 'two', 'three'], list2: ['two', 'three']})
    })
  })
  describe('merge', () => {
    it('should merge value in model', () => {
      const controller = new Controller({
        state: {
          users: {
            john: 'John Difool'
          }
        },
        signals: {
          test: [
            merge(state`users`, {largo: 'Largo Winch'})
          ]
        }
      })
      controller.getSignal('test')()
      assert.deepEqual(controller.getState(), {users: {
        john: 'John Difool',
        largo: 'Largo Winch'
      }})
    })
    it('should merge value from input in model', () => {
      const controller = new Controller({
        state: {
          users: {
            john: 'John Difool'
          }
        },
        signals: {
          test: [
            merge(state`users`, input`value`)
          ]
        }
      })
      controller.getSignal('test')({value: {largo: 'Largo Winch'}})
      assert.deepEqual(controller.getState(), {users: {
        john: 'John Difool',
        largo: 'Largo Winch'
      }})
    })
  })
  describe('pop', () => {
    it('should pop value from model', () => {
      const controller = new Controller({
        state: {
          list: ['a', 'b', 'c']
        },
        signals: {
          test: [
            pop(state`list`)
          ]
        }
      })
      controller.getSignal('test')()
      assert.deepEqual(controller.getState(), {list: ['a', 'b']})
    })
  })
  describe('push', () => {
    it('should push value in model', () => {
      const controller = new Controller({
        state: {
          list: ['a', 'b']
        },
        signals: {
          test: [
            push(state`list`, 'c')
          ]
        }
      })
      controller.getSignal('test')()
      assert.deepEqual(controller.getState(), {list: ['a', 'b', 'c']})
    })
    it('should push value from input in model', () => {
      const controller = new Controller({
        state: {
          list: ['a', 'b']
        },
        signals: {
          test: [
            push(state`list`, input`value`)
          ]
        }
      })
      controller.getSignal('test')({value: 'c'})
      assert.deepEqual(controller.getState(), {list: ['a', 'b', 'c']})
    })
  })
  describe('shift', () => {
    it('should shift value in model', () => {
      const controller = new Controller({
        state: {
          list: ['a', 'b', 'c']
        },
        signals: {
          test: [
            shift(state`list`)
          ]
        }
      })
      controller.getSignal('test')()
      assert.deepEqual(controller.getState(), {list: ['b', 'c']})
    })
  })
  describe('splice', () => {
    it('should splice value in model', () => {
      const controller = new Controller({
        state: {
          list: ['a', 'b', 'c', 'd']
        },
        signals: {
          test: [
            splice(state`list`, 1, 2, 'x', 'y')
          ]
        }
      })
      controller.getSignal('test')()
      assert.deepEqual(controller.getState(), {list: ['a', 'x', 'y', 'd']})
    })
    it('should splice value from input in model', () => {
      const controller = new Controller({
        state: {
          list: ['a', 'b', 'c', 'd']
        },
        signals: {
          test: [
            splice(state`list`, input`idx`, 1, input`x`, input`y`)
          ]
        }
      })
      controller.getSignal('test')({idx: 2, x: 'one', y: 'two'})
      assert.deepEqual(controller.getState(), {list: ['a', 'b', 'one', 'two', 'd']})
    })
  })
  describe('unset', () => {
    it('should unset value in model', () => {
      const controller = new Controller({
        state: {
          foo: 'bar',
          bar: 'baz'
        },
        signals: {
          test: [
            unset(state`foo`)
          ]
        }
      })
      controller.getSignal('test')()
      assert.deepEqual(controller.getState(), {bar: 'baz'})
    })
  })
  describe('unshift', () => {
    it('should unshift value in model', () => {
      const controller = new Controller({
        state: {
          list: ['a', 'b']
        },
        signals: {
          test: [
            unshift(state`list`, 'x')
          ]
        }
      })
      controller.getSignal('test')()
      assert.deepEqual(controller.getState(), {list: ['x', 'a', 'b']})
    })
    it('should unshift value from input in model', () => {
      const controller = new Controller({
        state: {
          list: ['a', 'b']
        },
        signals: {
          test: [
            unshift(state`list`, input`value`)
          ]
        }
      })
      controller.getSignal('test')({value: 'x'})
      assert.deepEqual(controller.getState(), {list: ['x', 'a', 'b']})
    })
  })
})
