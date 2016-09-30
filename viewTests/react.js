const jsdom = require('jsdom');

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = {userAgent: 'node.js'};

const React = require('react')
const TestUtils = require('react-addons-test-utils')
const assert = require('assert')
const Container = require('../src/react/container').default
const connect = require('../src/react/connect').default

describe('React', () => {
  it('should work', () => {
    const Comp = connect({
      foo: 'foo'
    }, (props) => {
      return (
        <div>{props.foo}</div>
      )
    })
    const tree = TestUtils.renderIntoDocument((
      <Container state={{foo: 'bar'}}>
        <Comp />
      </Container>
    ))

    assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'bar')
  })
})
