/* eslint-env mocha */
import assert from 'assert'
import createComputed from './createComputed'
import GraphQlModule from '../client'
import {Controller} from 'cerebral'

describe('createComputed', () => {
  it('should return loading state', () => {
    const controller = Controller({
      modules: {
        graphql: GraphQlModule({
          schema: `
            type Author {
              id: ID!
              firstName: String
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
                return {id: 1, firstName: 'Bob'}
              }
            }
          }
        })
      }
    })

    const computed = createComputed(`
      {
        author (id: 1) {
          id
          firstName
        }
      }
    `)

    assert.deepEqual(computed.getValue({
      state: controller.getState.bind(controller)
    }), {
      isLoading: true
    })
  })
  it('should return normalized state denormalized', (done) => {
    const controller = Controller({
      modules: {
        graphql: GraphQlModule({
          schema: `
            type Author {
              id: ID!
              firstName: String
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
                return {id: 1, firstName: 'Bob'}
              }
            }
          }
        })
      }
    })

    const query = `
      {
        author (id: 1) {
          id
          firstName
        }
      }
    `
    const computed = createComputed(query)

    controller.once('end', () => {
      assert.deepEqual(computed.getValue({
        state: controller.getState.bind(controller)
      }), {
        author: {
          id: '1',
          firstName: 'Bob'
        }
      })
      done()
    })

    controller.getSignal('graphql.queried')({
      query
    })
  })
  it('should return relational normalized state denormalized', (done) => {
    const controller = Controller({
      modules: {
        graphql: GraphQlModule({
          schema: `
            type Author {
              id: ID!
              firstName: String
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
                return {id: 1, firstName: 'Bob'}
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

    const query = `
      {
        author (id: 1) {
          id
          firstName
          posts {
            id
            title
          }
        }
      }
    `
    const computed = createComputed(query)

    controller.once('end', () => {
      assert.deepEqual(computed.getValue({
        state: controller.getState.bind(controller)
      }), {
        author: {
          id: '1',
          firstName: 'Bob',
          posts: [{
            id: '1',
            title: 'woop'
          }]
        }
      })
      done()
    })

    controller.getSignal('graphql.queried')({
      query
    })
  })
  it('should find entity when not id is used', (done) => {
    const controller = Controller({
      modules: {
        graphql: GraphQlModule({
          schema: `
            type Author {
              id: ID!
              firstName: String
              login: String
            }

            type Query {
              author (login: String): Author
            }

            schema {
              query: Query
            }
          `,
          resolvers: {
            Query: {
              author() {
                return {id: 1, firstName: 'Bob', login: 'test'}
              }
            }
          }
        })
      }
    })

    const query = `
      {
        author (login: "test") {
          firstName
        }
      }
    `
    const computed = createComputed(query)

    controller.once('end', () => {
      assert.deepEqual(computed.getValue({
        state: controller.getState.bind(controller)
      }), {
        author: {
          id: '1',
          firstName: 'Bob',
          login: 'test'
        }
      })
      done()
    })

    controller.getSignal('graphql.queried')({
      query
    })
  })
  it('should find entity when no argument is used', (done) => {
    const controller = Controller({
      modules: {
        graphql: GraphQlModule({
          schema: `
            type User {
              id: ID!
              name: String
            }

            type Query {
              me: User
            }

            schema {
              query: Query
            }
          `,
          resolvers: {
            Query: {
              me() {
                return {id: 1, name: 'Bob'}
              }
            }
          }
        })
      }
    })

    const query = `
      {
        me {
          name
        }
      }
    `
    const computed = createComputed(query)

    controller.once('end', () => {
      assert.deepEqual(computed.getValue({
        state: controller.getState.bind(controller)
      }), {
        me: {
          id: '1',
          name: 'Bob'
        }
      })
      done()
    })

    controller.getSignal('graphql.queried')({
      query
    })
  })
})
