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
const Controller = require('cerebral').Controller
const Container = require('cerebral/react').Container
const GraphQlModule = require('../client').default
const {connect, query} = require('./react')

describe('connect', () => {
  it('should handle queries', (done) => {
    const controller = Controller({
      modules: {
        graphql: GraphQlModule({
          schema: `
            type Author {
              id: ID!
              name: String
            }

            type Query {
              author (id: ID!): Author
            }

            schema {
              query: Query
            }
          `,
          resolvers: {
            Query: {
              author() {
                return {id: 1, name: 'Bob'}
              }
            }
          }
        })
      }
    })
    const TestComponent = connect({
      author: query`
        {
          author (id: 1) {
            name
          }
        }
      `
    },
      function Component ({author}) {
        if (author.isLoading) {
          return <div>Loading</div>
        }

        return <div>{author.name}</div>
      }
    )

    const tree = TestUtils.renderIntoDocument((
      <Container controller={controller}>
        <TestComponent />
      </Container>
    ))

    controller.once('end', () => {
      assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'Bob')
      done()
    })

    assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'Loading')
  })
  it('should handle relational queries', (done) => {
    const controller = Controller({
      modules: {
        graphql: GraphQlModule({
          schema: `
            type Author {
              id: ID!
              name: String
              posts: [Post]
            }

            type Post {
              id: ID!
              title: String
            }

            type Query {
              author (id: ID!): Author
            }

            schema {
              query: Query
            }
          `,
          resolvers: {
            Query: {
              author() {
                return {id: 1, name: 'Bob'}
              }
            },
            Author: {
              posts() {
                return [{id: 1, title: 'woop'}]
              }
            }
          }
        })
      }
    })
    const TestComponent = connect({
      author: query`
        {
          author (id: 1) {
            name
            posts {
              title
            }
          }
        }
      `
    },
      function Component ({author}) {
        if (author.isLoading) {
          return <div>Loading</div>
        }

        return <div>{author.posts[0].title}</div>
      }
    )

    const tree = TestUtils.renderIntoDocument((
      <Container controller={controller}>
        <TestComponent />
      </Container>
    ))

    controller.once('end', () => {
      assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'woop')
      done()
    })

    assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'Loading')
  })
  it('should handle multiple queries', (done) => {
    const controller = Controller({
      modules: {
        graphql: GraphQlModule({
          schema: `
            type Author {
              id: ID!
              name: String
            }

            type Post {
              id: ID!
              title: String
            }

            type Query {
              author (id: ID!): Author
              post (id: ID!): Post
            }

            schema {
              query: Query
            }
          `,
          resolvers: {
            Query: {
              author() {
                return {id: 1, name: 'Bob'}
              },
              post() {
                return {id: 1, title: 'Woop'}
              }
            }
          }
        })
      }
    })
    const TestComponent = connect({
      author: query`
        {
          author (id: 1) {
            name
          }
        }
      `,
      post: query`
        {
          post (id: 1) {
            title
          }
        }
      `
    },
      function Component ({author, post}) {
        if (author.isLoading || post.isLoading) {
          return <div>Loading</div>
        }

        return <div>{author.name + post.title}</div>
      }
    )

    const tree = TestUtils.renderIntoDocument((
      <Container controller={controller}>
        <TestComponent />
      </Container>
    ))

    let endCount = 0
    controller.on('end', () => {
      endCount++
      if (endCount === 2) {
        assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'BobWoop')
        done()
      }
    })

    assert.equal(TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML, 'Loading')
  })
})
