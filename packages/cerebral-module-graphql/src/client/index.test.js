/* eslint-env mocha */
import assert from 'assert'
import GraphQlModule from './'
import {Controller} from 'cerebral'

describe('GraphQlModule - Client', () => {
  it('should store object and query types in state tree', () => {
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

    assert.deepEqual(controller.getState(), {
      graphql: {
        objectTypes: {
          Author: {
            fields: {
              firstName: {name: 'String'},
              id: {name: 'ID'}
            },
            name: 'Author'
          }
        },
        queryTypes: {
          author: {
            name: 'Author'
          }
        },
        entities: {},
        queries: {}
      }
    })
  })
  it('should store normalized result in state tree', (done) => {
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

    controller.once('end', () => {
      assert.deepEqual(controller.getState().graphql.entities, {
        Author: {
          '1': {
            id: '1',
            firstName: 'Bob'
          }
        }
      })
      assert.deepEqual(controller.getState().graphql.queries, {
        [query]: {
          isLoading: false,
          objectIds: {
            author: 1
          }
        }
      })
      done()
    })
    controller.getSignal('graphql.queried')({
      query
    })
  })
})
