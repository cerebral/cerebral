/* eslint-env mocha */
'use strict'

const jsdom = require('jsdom')

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.window = document.defaultView
global.navigator = {userAgent: 'node.js'}
global.CustomEvent = global.window.CustomEvent = () => {}
global.window.dispatchEvent = () => {}

const React = require('react')
const TestUtils = require('react-addons-test-utils')
const assert = require('assert')
const Controller = require('../Controller').default
const {state, signal, props} = require('../tags')
const {compute} = require('../')
const {Container, StateContainer, connect, decorator} = require('./react')

describe('React', () => {
  describe('state container', () => {
    it('should be able to wrap app with container', () => {
      class TestComponent extends React.Component {
        render () {
          return (
            <div />
          )
        }
      }
      const tree = TestUtils.renderIntoDocument((
        <StateContainer>
          <TestComponent />
        </StateContainer>
      ))

      assert.ok(TestUtils.findRenderedComponentWithType(tree, TestComponent))
    })
    it('should be able to expose state', () => {
      const model = {
        foo: 'bar'
      }
      const TestComponent = connect({
        foo: state`foo`
      }, (props) => {
        return (
          <div>{props.foo}</div>
        )
      })
      const tree = TestUtils.renderIntoDocument((
        <StateContainer state={model}>
          <TestComponent />
        </StateContainer>
      ))

      assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar')
    })
    it('should be able to expose state with connectDecorator', () => {
      const model = {
        foo: 'bar'
      }
      const TestComponent = decorator({
        foo: state`foo`
      })(
        (props) => {
          return (
            <div>{props.foo}</div>
          )
        }
      )
      const tree = TestUtils.renderIntoDocument((
        <StateContainer state={model}>
          <TestComponent />
        </StateContainer>
      ))

      assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar')
    })
  })
  describe('container', () => {
    it('should be able to expose controller', () => {
      const controller = Controller({
        state: {
          foo: 'bar'
        }
      })
      const TestComponent = connect({
        foo: state`foo`
      }, (props) => {
        return (
          <div>{props.foo}</div>
        )
      })
      const tree = TestUtils.renderIntoDocument((
        <Container controller={controller}>
          <TestComponent />
        </Container>
      ))

      assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar')
    })
    it('should throw if no controller provided', () => {
      const TestComponent = connect({
        foo: state`foo`
      }, (props) => {
        return (
          <div>{props.foo}</div>
        )
      })
      assert.throws(() => {
        TestUtils.renderIntoDocument((
          <Container>
            <TestComponent />
          </Container>
        ))
      })
    })
  })
  describe('connect', () => {
    it('should be able to extract state', () => {
      const controller = Controller({
        state: {
          foo: 'bar'
        }
      })
      const TestComponent = connect({
        foo: state`foo`
      }, (props) => {
        return (
          <div>{props.foo}</div>
        )
      })
      const tree = TestUtils.renderIntoDocument((
        <Container controller={controller}>
          <TestComponent />
        </Container>
      ))

      assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar')
    })
    it('should render only ones where multiple state matches', () => {
      const controller = Controller({
        state: {
          foo: 'bar',
          bar: 'foo'
        },
        signals: {
          test: [({state}) => {
            state.set('foo', 'bar2')
            state.set('bar', 'foo2')
          }]
        }
      })
      let renderCount = 0
      const TestComponent = connect({
        foo: state`foo`,
        bar: state`bar`
      }, (props) => {
        renderCount++
        return (
          <div>{props.foo}</div>
        )
      })
      const tree = TestUtils.renderIntoDocument((
        <Container controller={controller}>
          <TestComponent />
        </Container>
      ))

      assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar')
      assert.equal(renderCount, 1)
      controller.getSignal('test')()
      assert.equal(renderCount, 2)
    })
    it('should be able to extract signals', () => {
      const controller = Controller({
        state: {
          foo: 'bar'
        },
        signals: {
          someSignal: []
        }
      })
      const TestComponent = connect({
        signal: signal`someSignal`
      }, (props) => {
        assert.ok(typeof props.signal === 'function')
        return (
          <div>{props.foo}</div>
        )
      })
      TestUtils.renderIntoDocument((
        <Container controller={controller}>
          <TestComponent />
        </Container>
      ))
    })
    it('should rerender on state update', () => {
      const controller = Controller({
        state: {
          foo: 'bar'
        },
        signals: {
          methodCalled: [({state}) => state.set('foo', 'bar2')]
        }
      })
      class TestComponentClass extends React.Component {
        callSignal () {
          this.props.methodCalled()
        }
        render () {
          return (
            <div>{this.props.foo}</div>
          )
        }
      }
      const TestComponent = connect({
        foo: state`foo`,
        methodCalled: signal`methodCalled`
      }, TestComponentClass)
      const tree = TestUtils.renderIntoDocument((
        <Container controller={controller}>
          <TestComponent />
        </Container>
      ))
      const component = TestUtils.findRenderedComponentWithType(tree, TestComponentClass)
      component.callSignal()
      assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar2')
    })
    it('should rerender on parent dep replacement', () => {
      const controller = Controller({
        state: {
          foo: {
            bar: 'baz'
          }
        },
        signals: {
          methodCalled: [({state}) => state.set('foo', {bar: 'baz2'})]
        }
      })
      class TestComponentClass extends React.Component {
        callSignal () {
          this.props.methodCalled()
        }
        render () {
          return (
            <div>{this.props.foo}</div>
          )
        }
      }
      const TestComponent = connect({
        foo: state`foo.bar`,
        methodCalled: signal`methodCalled`
      }, TestComponentClass)
      const tree = TestUtils.renderIntoDocument((
        <Container controller={controller}>
          <TestComponent />
        </Container>
      ))
      const component = TestUtils.findRenderedComponentWithType(tree, TestComponentClass)
      component.callSignal()
      assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'baz2')
    })
    it('should only rerender affected components', () => {
      let renderCount = 0
      const controller = Controller({
        state: {
          foo: 'bar'
        },
        signals: {
          methodCalled: [({state}) => state.set('foo', 'bar2')]
        }
      })
      class TestComponentClass2 extends React.Component {
        render () {
          renderCount++
          return (
            <div />
          )
        }
      }
      const TestComponent2 = connect({}, TestComponentClass2)
      class TestComponentClass extends React.Component {
        callSignal () {
          this.props.methodCalled()
        }
        render () {
          renderCount++
          return (
            <div><TestComponent2 /></div>
          )
        }
      }
      const TestComponent = connect({
        foo: state`foo`,
        methodCalled: signal`methodCalled`
      }, TestComponentClass)
      const tree = TestUtils.renderIntoDocument((
        <Container controller={controller}>
          <TestComponent />
        </Container>
      ))
      const component = TestUtils.findRenderedComponentWithType(tree, TestComponentClass)
      component.callSignal()
      assert.equal(renderCount, 3)
    })
    it('should be able to dynamically define signals', () => {
      const controller = Controller({
        state: {
          test: ''
        },
        signals: {
          foo: [({state}) => state.set('test', 'fooSignal')]
        }
      })
      const TestComponent = connect({
        signal: signal`${props`path`}`
      },
      ({signal}) => {
        signal()
        return null
      })
      TestUtils.renderIntoDocument((
        <Container controller={controller}>
          <TestComponent path='foo' />
        </Container>
      ))
      assert.equal(controller.getModel().get(['test']), 'fooSignal')
    })
    it('should allow props tag', () => {
      const controller = Controller({
        state: {
          foo: {
            baz: 'mip'
          }
        }
      })
      const TestComponent = connect({
        a: props`foo`,
        b: props`bar.id`,
        c: state`foo.${props`propKey`}`
      },
      ({a, b, c}) => {
        return <div>{a + b + c}</div>
      })
      const tree = TestUtils.renderIntoDocument((
        <Container controller={controller}>
          <TestComponent foo='bar' bar={{id: '1'}} propKey='baz' />
        </Container>
      ))
      assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar1mip')
    })
    it('should update tags', () => {
      const controller = Controller({
        state: {
          list: {
            0: 'foo',
            1: 'bar'
          },
          currentItem: '0'
        },
        signals: {
          test: [({state}) => { state.set('currentItem', '1') }]
        }
      })
      const TestComponent = connect({
        foo: state`list.${state`currentItem`}`
      },
      ({foo}) => {
        return <div>{foo}</div>
      })
      const tree = TestUtils.renderIntoDocument((
        <Container controller={controller}>
          <TestComponent />
        </Container>
      ))
      assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'foo')
      controller.getSignal('test')()
      assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar')
    })
    it('should be able to adjust props with function', () => {
      const controller = Controller({
        state: {
          foo: 'bar'
        },
        signals: {
          foo: []
        }
      })
      const TestComponent = connect({
        foo: state`foo`,
        fooSignal: signal`foo`
      }, (depsProps, ownProps, resolve) => {
        assert.equal(depsProps.foo, 'bar')
        assert.equal(typeof depsProps.fooSignal, 'function')
        assert.deepEqual(ownProps, {mip: 'mop'})
        assert.equal(resolve.path(state`foo`), 'foo')
        assert.equal(resolve.value(state`foo`), 'bar')

        return {bar: depsProps.foo + ownProps.mip}
      }, (props) => {
        assert.deepEqual(Object.keys(props), ['bar'])
        return (
          <div>{props.bar}</div>
        )
      })
      const tree = TestUtils.renderIntoDocument((
        <Container controller={controller}>
          <TestComponent mip='mop' />
        </Container>
      ))

      assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'barmop')
    })
    it('should update on props change', () => {
      const controller = Controller({})
      class TestComponentClass2 extends React.Component {
        render () {
          return (
            <div>{this.props.foo}</div>
          )
        }
      }
      const TestComponent2 = connect({}, TestComponentClass2)
      class TestComponentClass extends React.Component {
        constructor (props) {
          super(props)
          this.state = {foo: 'bar'}
        }
        changePath () {
          this.setState({
            foo: 'bar2'
          })
        }
        render () {
          return (
            <span><TestComponent2 foo={this.state.foo} /></span>
          )
        }
      }
      const TestComponent = connect({}, TestComponentClass)
      const tree = TestUtils.renderIntoDocument((
        <Container controller={controller}>
          <TestComponent />
        </Container>
      ))
      assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar')
      const component = TestUtils.findRenderedComponentWithType(tree, TestComponentClass)
      component.changePath()
      assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar2')
    })
    describe('STRICT render update', () => {
      it('should update when parent path changes', () => {
        let renderCount = 0
        const controller = Controller({
          state: {
            foo: {
              bar: 'baz'
            }
          },
          signals: {
            methodCalled: [({state}) => state.set('foo', 'bar2')]
          }
        })
        class TestComponentClass extends React.Component {
          callSignal () {
            this.props.methodCalled()
          }
          render () {
            renderCount++
            return (
              <div>{this.props.foo}</div>
            )
          }
        }
        const TestComponent = connect({
          foo: state`foo.bar`,
          methodCalled: signal`methodCalled`
        }, TestComponentClass)
        const tree = TestUtils.renderIntoDocument((
          <Container controller={controller}>
            <TestComponent />
          </Container>
        ))
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'baz')
        const component = TestUtils.findRenderedComponentWithType(tree, TestComponentClass)
        component.callSignal()
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, '')
        assert.equal(renderCount, 2)
      })
      it('should be able to override immediate child interest', () => {
        let renderCount = 0
        const controller = Controller({
          state: {
            foo: [{
              bar: 'baz'
            }]
          },
          signals: {
            methodCalled: [({state}) => state.set('foo.0.bar', 'baz2')]
          }
        })
        class TestComponentClass extends React.Component {
          callSignal () {
            this.props.methodCalled()
          }
          render () {
            renderCount++
            return (
              <div>{this.props.foo[0]}</div>
            )
          }
        }
        const TestComponent = connect({
          foo: state`foo.*`,
          methodCalled: signal`methodCalled`
        }, TestComponentClass)
        const tree = TestUtils.renderIntoDocument((
          <Container controller={controller}>
            <TestComponent />
          </Container>
        ))
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, '0')
        const component = TestUtils.findRenderedComponentWithType(tree, TestComponentClass)
        component.callSignal()
        assert.equal(renderCount, 1)
      })
      it('should by default update when nested children update', () => {
        let renderCount = 0
        const controller = Controller({
          state: {
            foo: {
              bar: {
                baz: 'value'
              }
            }
          },
          signals: {
            methodCalled: [({state}) => state.set('foo.bar.baz', 'value2')]
          }
        })
        class TestComponentClass extends React.Component {
          callSignal () {
            this.props.methodCalled()
          }
          render () {
            renderCount++
            return (
              <div>{this.props.foo.bar.baz}</div>
            )
          }
        }
        const TestComponent = connect({
          foo: state`foo`,
          methodCalled: signal`methodCalled`
        }, TestComponentClass)
        const tree = TestUtils.renderIntoDocument((
          <Container controller={controller}>
            <TestComponent />
          </Container>
        ))
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'value')
        const component = TestUtils.findRenderedComponentWithType(tree, TestComponentClass)
        component.callSignal()
        assert.equal(renderCount, 2)
      })
      it('should by default update when nested children update with array', () => {
        let renderCount = 0
        const controller = Controller({
          state: {
            foo: [{
              bar: 'value'
            }]
          },
          signals: {
            methodCalled: [({state}) => state.set('foo.0.bar', 'value2')]
          }
        })
        class TestComponentClass extends React.Component {
          callSignal () {
            this.props.methodCalled()
          }
          render () {
            renderCount++
            return (
              <div>{this.props.foo[0].bar}</div>
            )
          }
        }
        const TestComponent = connect({
          foo: state`foo`,
          methodCalled: signal`methodCalled`
        }, TestComponentClass)
        const tree = TestUtils.renderIntoDocument((
          <Container controller={controller}>
            <TestComponent />
          </Container>
        ))
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'value')
        const component = TestUtils.findRenderedComponentWithType(tree, TestComponentClass)
        component.callSignal()
        assert.equal(renderCount, 2)
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'value2')
      })
      it('should by default update when nested children update using COMPUTE', () => {
        let renderCount = 0
        const controller = Controller({
          state: {
            foo: {
              bar: {
                baz: 'value'
              }
            }
          },
          signals: {
            methodCalled: [({state}) => state.set('foo.bar.baz', 'value2')]
          }
        })
        class TestComponentClass extends React.Component {
          callSignal () {
            this.props.methodCalled()
          }
          render () {
            renderCount++
            return (
              <div>{this.props.foo.bar.baz}</div>
            )
          }
        }
        const TestComponent = connect({
          foo: compute(state`foo`),
          methodCalled: signal`methodCalled`
        }, TestComponentClass)
        const tree = TestUtils.renderIntoDocument((
          <Container controller={controller}>
            <TestComponent />
          </Container>
        ))
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'value')
        const component = TestUtils.findRenderedComponentWithType(tree, TestComponentClass)
        component.callSignal()
        assert.equal(renderCount, 2)
      })
    })
    describe('Compute', () => {
      it('should allow use of compute as state dependency and access props', () => {
        const controller = Controller({})
        class TestComponentClass extends React.Component {
          render () {
            return (
              <div>{this.props.foo}</div>
            )
          }
        }
        const TestComponent = connect({
          foo: compute((get) => {
            return get(props`foo`) + 'baz'
          })
        }, TestComponentClass)
        const tree = TestUtils.renderIntoDocument((
          <Container controller={controller}>
            <TestComponent foo='bar' />
          </Container>
        ))
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'barbaz')
      })
      it('should have access to state through state argument', () => {
        const controller = Controller({
          state: {
            foo: 'bar'
          }
        })
        class TestComponentClass extends React.Component {
          render () {
            return (
              <div>{this.props.foo}</div>
            )
          }
        }
        const TestComponent = connect({
          foo: compute((get) => {
            return get(state`foo`)
          })
        }, TestComponentClass)
        const tree = TestUtils.renderIntoDocument((
          <Container controller={controller}>
            <TestComponent />
          </Container>
        ))
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar')
      })
      it('should track state', () => {
        const controller = Controller({
          state: {
            foo: 'bar'
          },
          signals: {
            changeState: [({state}) => state.set('foo', 'bar2')]
          }
        })
        class TestComponentClass extends React.Component {
          render () {
            return (
              <div>{this.props.foo}</div>
            )
          }
        }
        const TestComponent = connect({
          foo: compute((get) => {
            return get(state`foo`)
          })
        }, TestComponentClass)
        const tree = TestUtils.renderIntoDocument((
          <Container controller={controller}>
            <TestComponent />
          </Container>
        ))
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar')
        controller.getSignal('changeState')()
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar2')
      })
      it('should update dependency map when compute is rerun', () => {
        const controller = Controller({
          state: {
            map: {}
          },
          signals: {
            changeState: [({state}) => state.set('map.1', {awesome: true})],
            changeState2: [({state}) => state.set('map.1.awesome', false)]
          }
        })
        class TestComponentClass extends React.Component {
          render () {
            return (
              <div>{this.props.foo.length}</div>
            )
          }
        }
        const TestComponent = connect({
          foo: compute(state`map.*`, (map, get) => {
            return map.filter((key) => {
              return get(state`map.${key}.awesome`)
            })
          })
        }, TestComponentClass)
        const tree = TestUtils.renderIntoDocument((
          <Container controller={controller}>
            <TestComponent />
          </Container>
        ))
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, '0')
        controller.getSignal('changeState')()
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, '1')
        controller.getSignal('changeState2')()
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, '0')
      })
      it('should handle complex state changes', () => {
        const controller = Controller({
          state: {
            user: {
              projects: ['0', '1']
            },
            projects: {
              '0': 'foo',
              '1': 'bar',
              '2': 'baz'
            }
          },
          signals: {
            changeState: [({state}) => state.push('user.projects', '2')]
          }
        })
        class TestComponentClass extends React.Component {
          render () {
            return (
              <div>{this.props.projects.join()}</div>
            )
          }
        }
        const TestComponent = connect({
          projects: compute((get) => {
            const projects = get(state`user.projects`)

            return projects.map((projectKey) => get(state`projects.${projectKey}`))
          })
        }, TestComponentClass)
        const tree = TestUtils.renderIntoDocument((
          <Container controller={controller}>
            <TestComponent />
          </Container>
        ))
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'foo,bar')
        controller.getSignal('changeState')()
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'foo,bar,baz')
      })
      it('should handle strict deps', () => {
        const controller = Controller({
          state: {
            user: {
              projects: ['0', '1']
            },
            projects: {
              '0': {title: '0'},
              '1': {title: '1'}
            }
          },
          signals: {
            changeState: [({state}) => state.set('projects.1.title', 'woop')]
          }
        })
        class TestComponentClass extends React.Component {
          render () {
            return (
              <div>{this.props.projects[1].title}</div>
            )
          }
        }
        const TestComponent = connect({
          projects: compute((get) => {
            const projects = get(state`user.projects`)

            return projects.map((projectKey) => get(state`projects.${projectKey}`))
          })
        }, TestComponentClass)
        const tree = TestUtils.renderIntoDocument((
          <Container controller={controller}>
            <TestComponent />
          </Container>
        ))
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, '1')
        controller.getSignal('changeState')()
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'woop')
      })
      it('should handle props updating state deps', () => {
        const controller = Controller({
          state: {
            foo: 'bar',
            bar: 'baz'
          },
          signals: {
            changeState: [({state}) => state.set('bar', 'baz2')]
          }
        })
        class TestComponentClass2 extends React.Component {
          render () {
            return (
              <h1>{this.props.value}</h1>
            )
          }
        }
        const TestComponent2 = connect({
          value: state`${props`path`}`
        }, TestComponentClass2)
        class TestComponentClass extends React.Component {
          constructor (props) {
            super(props)
            this.state = {path: 'foo'}
          }
          changePath () {
            this.setState({path: 'bar'})
          }
          render () {
            return (
              <div><TestComponent2 path={this.state.path} /></div>
            )
          }
        }
        const TestComponent = connect({
          foo: state`foo`
        }, TestComponentClass)
        const tree = TestUtils.renderIntoDocument((
          <Container controller={controller}>
            <TestComponent />
          </Container>
        ))
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'h1').innerHTML, 'bar')
        const component = TestUtils.findRenderedComponentWithType(tree, TestComponentClass)
        component.changePath()
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'h1').innerHTML, 'baz')
        controller.getSignal('changeState')()
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'h1').innerHTML, 'baz2')
      })
      it('should handle props composition updating value', () => {
        const controller = Controller({
          state: {
            field: {
              value: ''
            }
          },
          signals: {
            changeState: [({state}) => {
              state.set('field.value', 'foo')
              state.merge('field', {mip: 'mop'})
            }]
          }
        })
        class TestComponentClass extends React.Component {
          render () {
            return (
              <h1>{this.props.field.value}</h1>
            )
          }
        }
        const TestComponent = connect({
          field: state`${props`path`}`
        }, TestComponentClass)
        const tree = TestUtils.renderIntoDocument((
          <Container controller={controller}>
            <TestComponent path='field' />
          </Container>
        ))
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'h1').innerHTML, '')
        controller.getSignal('changeState')()
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'h1').innerHTML, 'foo')
      })
    })
  })
})
