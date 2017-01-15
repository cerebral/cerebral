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
const Computed = require('../Computed').default
const {state, signal, props} = require('../tags')
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
      const state = {
        foo: 'bar'
      }
      const TestComponent = connect({
        foo: 'foo'
      }, (props) => {
        return (
          <div>{props.foo}</div>
        )
      })
      const tree = TestUtils.renderIntoDocument((
        <StateContainer state={state}>
          <TestComponent />
        </StateContainer>
      ))

      assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar')
    })
    it('should be able to expose state with connectDecorator', () => {
      const state = {
        foo: 'bar'
      }
      const TestComponent = decorator({
        foo: 'foo'
      })(
        (props) => {
          return (
            <div>{props.foo}</div>
          )
        }
      )
      const tree = TestUtils.renderIntoDocument((
        <StateContainer state={state}>
          <TestComponent />
        </StateContainer>
      ))

      assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar')
    })
    it('should support computed', () => {
      const specialName = Computed(
        {name: 'foo'},
        function specialName ({name}) {
          return 'special ' + name
        }
      )
      const state = {
        foo: 'bar'
      }
      const TestComponent = connect({
        foo: specialName
      }, (props) => {
        return (
          <div>{props.foo}</div>
        )
      })
      const tree = TestUtils.renderIntoDocument((
        <StateContainer state={state}>
          <TestComponent />
        </StateContainer>
      ))

      assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'special bar')
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
        foo: 'foo'
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
        foo: 'foo'
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
        foo: 'foo'
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
        foo: 'foo'
      }, {
        signal: 'someSignal'
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
    it('should expose signals prop with an option', () => {
      const controller = Controller({
        options: {signalsProp: true},
        state: {
          foo: 'bar'
        },
        signals: {
          someSignal: []
        },
        modules: {
          moduleA: {
            signals: {
              someOtherSignal: []
            }
          }
        }
      })
      const TestComponent = connect({
        foo: 'foo'
      }, (props) => {
        assert.ok(props.signals.someSignal)
        assert.ok(props.signals.moduleA.someOtherSignal)
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
        foo: 'foo'
      }, {
        methodCalled: 'methodCalled'
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
        foo: 'foo'
      }, {
        methodCalled: 'methodCalled'
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
    it('should be able to dynamically define state dependencies', () => {
      const controller = Controller({
        state: {
          foo: 'bar',
          foo2: 'bar2'
        }
      })
      class TestComponentClass2 extends React.Component {
        render () {
          return (
            <div>{this.props.foo}</div>
          )
        }
      }
      const TestComponent2 = connect((props) => {
        return {
          foo: props.path
        }
      }, TestComponentClass2)
      class TestComponentClass extends React.Component {
        constructor (props) {
          super(props)
          this.state = {path: 'foo'}
        }
        changePath () {
          this.setState({
            path: 'foo2'
          })
        }
        render () {
          return (
            <span><TestComponent2 path={this.state.path} /></span>
          )
        }
      }
      const TestComponent = connect({
        foo: 'foo'
      }, TestComponentClass)
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
      }, (props) => ({signal: props.path}),
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
    it('should compute Computed on state update', () => {
      const controller = Controller({
        state: {
          foo: 'bar'
        },
        signals: {
          methodCalled: [({state}) => state.set('foo', 'bar2')]
        }
      })
      const computed = Computed({
        foo: 'foo'
      }, ({foo}) => {
        return `${foo} computed`
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
        foo: computed
      }, {
        methodCalled: 'methodCalled'
      }, TestComponentClass)
      const tree = TestUtils.renderIntoDocument((
        <Container controller={controller}>
          <TestComponent />
        </Container>
      ))
      const component = TestUtils.findRenderedComponentWithType(tree, TestComponentClass)
      component.callSignal()
      assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar2 computed')
    })
    it('should be able to inject props', () => {
      const controller = Controller({})
      const TestComponent = connect({}, {}, {
        foo: 'bar'
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
        foo: 'foo'
      }, {
        fooSignal: 'foo'
      }, (stateProps, signalProps, ownProps) => {
        assert.deepEqual(stateProps, {foo: 'bar'})
        assert.equal(typeof signalProps.fooSignal, 'function')
        assert.deepEqual(ownProps, {mip: 'mop'})

        return {bar: stateProps.foo + ownProps.mip}
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
    it('should update on dynamic connect and props change', () => {
      const controller = Controller({
        state: {
          users: {0: 'foo', 1: 'bar'},
          currentUser: '0'
        },
        signals: {
          changeUser: [
            ({state}) => state.set('currentUser', '1')
          ]
        }
      })
      class TestComponentClass2 extends React.Component {
        render () {
          return (
            <div>{this.props.user}</div>
          )
        }
      }
      const TestComponent2 = connect((props) => ({
        user: `users.${props.currentUser}`
      }), TestComponentClass2)
      class TestComponentClass extends React.Component {
        render () {
          return (
            <span><TestComponent2 currentUser={this.props.currentUser} /></span>
          )
        }
      }
      const TestComponent = connect({
        currentUser: 'currentUser'
      }, TestComponentClass)
      const tree = TestUtils.renderIntoDocument((
        <Container controller={controller}>
          <TestComponent />
        </Container>
      ))
      assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'foo')
      controller.getSignal('changeUser')()
      assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar')
    })
    describe('STRICT render update', () => {
      it('should not update when parent path changes', () => {
        let renderCount = 0
        const controller = Controller({
          options: {strictRender: true},
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
          foo: 'foo.bar'
        }, {
          methodCalled: 'methodCalled'
        }, TestComponentClass)
        const tree = TestUtils.renderIntoDocument((
          <Container controller={controller}>
            <TestComponent />
          </Container>
        ))
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'baz')
        const component = TestUtils.findRenderedComponentWithType(tree, TestComponentClass)
        component.callSignal()
        assert.equal(renderCount, 1)
      })
      it('should not update when child path changes', () => {
        let renderCount = 0
        const controller = Controller({
          options: {strictRender: true},
          state: {
            foo: {
              bar: 'baz'
            }
          },
          signals: {
            methodCalled: [({state}) => state.set('foo.bar', 'baz2')]
          }
        })
        class TestComponentClass extends React.Component {
          callSignal () {
            this.props.methodCalled()
          }
          render () {
            renderCount++
            return (
              <div>{this.props.foo.bar}</div>
            )
          }
        }
        const TestComponent = connect({
          foo: 'foo'
        }, {
          methodCalled: 'methodCalled'
        }, TestComponentClass)
        const tree = TestUtils.renderIntoDocument((
          <Container controller={controller}>
            <TestComponent />
          </Container>
        ))
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'baz')
        const component = TestUtils.findRenderedComponentWithType(tree, TestComponentClass)
        component.callSignal()
        assert.equal(renderCount, 1)
      })
      it('should update when immediate child interest defined', () => {
        let renderCount = 0
        const controller = Controller({
          options: {strictRender: true},
          state: {
            foo: {
              bar: 'baz'
            }
          },
          signals: {
            methodCalled: [({state}) => state.set('foo.bar', 'baz2')]
          }
        })
        class TestComponentClass extends React.Component {
          callSignal () {
            this.props.methodCalled()
          }
          render () {
            renderCount++
            return (
              <div>{this.props.foo.bar}</div>
            )
          }
        }
        const TestComponent = connect({
          foo: 'foo.*'
        }, {
          methodCalled: 'methodCalled'
        }, TestComponentClass)
        const tree = TestUtils.renderIntoDocument((
          <Container controller={controller}>
            <TestComponent />
          </Container>
        ))
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'baz')
        const component = TestUtils.findRenderedComponentWithType(tree, TestComponentClass)
        component.callSignal()
        assert.equal(renderCount, 2)
      })
      it('should update when nested children interest defined', () => {
        let renderCount = 0
        const controller = Controller({
          options: {strictRender: true},
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
          foo: 'foo.**'
        }, {
          methodCalled: 'methodCalled'
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
      it('should throw error with devtools when replacing path, causing render not to happen', () => {
        const controller = Controller({
          options: {strictRender: true},
          devtools: {verifyStrictRender: true, init () {}, send () {}, updateComponentsMap () {}},
          state: {
            foo: {
              bar: 'baz'
            }
          },
          signals: {
            methodCalled: [({state}) => state.set('foo', 'bar')]
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
          foo: 'foo.bar'
        }, {
          methodCalled: 'methodCalled'
        }, TestComponentClass)
        const tree = TestUtils.renderIntoDocument((
          <Container controller={controller}>
            <TestComponent />
          </Container>
        ))
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'baz')
        const component = TestUtils.findRenderedComponentWithType(tree, TestComponentClass)
        assert.throws(() => {
          component.callSignal()
        })
      })
    })
    describe('DEFAULT render update', () => {
      it('should update when parent path changes', () => {
        let renderCount = 0
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
            renderCount++
            return (
              <div>{this.props.foo}</div>
            )
          }
        }
        const TestComponent = connect({
          foo: 'foo.bar'
        }, {
          methodCalled: 'methodCalled'
        }, TestComponentClass)
        const tree = TestUtils.renderIntoDocument((
          <Container controller={controller}>
            <TestComponent />
          </Container>
        ))
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'baz')
        const component = TestUtils.findRenderedComponentWithType(tree, TestComponentClass)
        component.callSignal()
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'baz2')
        assert.equal(renderCount, 2)
      })
      it('should update when child path changes', () => {
        let renderCount = 0
        const controller = Controller({
          state: {
            foo: {
              bar: 'baz'
            }
          },
          signals: {
            methodCalled: [({state}) => state.set('foo.bar', 'baz2')]
          }
        })
        class TestComponentClass extends React.Component {
          callSignal () {
            this.props.methodCalled()
          }
          render () {
            renderCount++
            return (
              <div>{this.props.foo.bar}</div>
            )
          }
        }
        const TestComponent = connect({
          foo: 'foo'
        }, {
          methodCalled: 'methodCalled'
        }, TestComponentClass)
        const tree = TestUtils.renderIntoDocument((
          <Container controller={controller}>
            <TestComponent />
          </Container>
        ))
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'baz')
        const component = TestUtils.findRenderedComponentWithType(tree, TestComponentClass)
        component.callSignal()
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'baz2')
        assert.equal(renderCount, 2)
      })
    })
    describe('Tags', () => {
      it('should support state tags', () => {
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
          foo: state`foo`
        }, TestComponentClass)
        const tree = TestUtils.renderIntoDocument((
          <Container controller={controller}>
            <TestComponent />
          </Container>
        ))
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar')
      })
      it('should support signal tags', () => {
        const controller = Controller({
          state: {
            foo: 'bar'
          },
          signals: {
            foo: []
          }
        })
        class TestComponentClass extends React.Component {
          render () {
            assert.equal(typeof this.props.fooSignal, 'function')

            return (
              <div>{this.props.foo}</div>
            )
          }
        }
        const TestComponent = connect({
          foo: state`foo`,
          fooSignal: signal`foo`
        }, TestComponentClass)

        TestUtils.renderIntoDocument((
          <Container controller={controller}>
            <TestComponent />
          </Container>
        ))
      })
      it('should rerender when using state tags', () => {
        const controller = Controller({
          state: {
            foo: 'bar'
          },
          signals: {
            foo: [
              ({state}) => state.set('foo', 'bar2')
            ]
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
          foo: state`foo`
        }, TestComponentClass)
        const tree = TestUtils.renderIntoDocument((
          <Container controller={controller}>
            <TestComponent />
          </Container>
        ))
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar')
        controller.getSignal('foo')()
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar2')
      })
      it('should rerender when using nested state tags', () => {
        const controller = Controller({
          state: {
            items: {0: 'foo', 1: 'bar'},
            currentItemKey: '0'
          },
          signals: {
            foo: [
              ({state}) => state.set('currentItemKey', '1')
            ]
          }
        })
        class TestComponentClass extends React.Component {
          render () {
            return (
              <div>{this.props.item}</div>
            )
          }
        }
        const TestComponent = connect({
          item: state`items.${state`currentItemKey`}`
        }, TestComponentClass)
        const tree = TestUtils.renderIntoDocument((
          <Container controller={controller}>
            <TestComponent />
          </Container>
        ))
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'foo')
        controller.getSignal('foo')()
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar')
      })
      it('should allow props tag', () => {
        const controller = Controller({
          state: {
            items: {0: 'foo', 1: 'bar'}
          }
        })
        class TestComponentClass extends React.Component {
          render () {
            return (
              <div>{this.props.item}</div>
            )
          }
        }
        const TestComponent = connect({
          item: state`items.${props`itemKey`}`
        }, TestComponentClass)
        const tree = TestUtils.renderIntoDocument((
          <Container controller={controller}>
            <TestComponent itemKey='0' />
          </Container>
        ))
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'foo')
      })
    })
  })
})
