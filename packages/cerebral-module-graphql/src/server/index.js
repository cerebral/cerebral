import {graphql, print} from 'graphql'
import GraphQl from '../GraphQl'
import querySignal from '../querySignal'
import schemaResponseSignal from './schemaResponseSignal'
import http from './http'

function GraphQlModule (options = {}) {
  return function module ({controller}) {
    let graphQlPromise = null

    if (options.schema) {
      graphQlPromise = Promise.resolve(new GraphQl(otpions.schema))
    } else {
      graphQlPromise = http.getSchema(options)
        .then((schema) => {
          const graphQl = new GraphQl(schema)
          controller.getSignal('graphql.schemaResponded')({
            queryTypes: graphQl.queryTypes,
            objectTypes: graphQl.objectTypes
          })

          return graphQl
        })
    }

    return {
      state: {
        objectTypes: null,
        queryTypes: null,
        entities: {},
        queries: {},
        batchedQueries: []
      },
      signals: {
        schemaResponded: schemaResponseSignal,
        queried: querySignal
      },
      provider(context) {
        context.graphql = {
          query(queries) {
            return graphQlPromise
              .then((graphQl) => {
                return http.query(print(graphQl.addQuery(queries)), options)
                  .then((result) => {
                    if (result.errors) {
                      throw result.errors[0]
                    }

                    return {
                      data: queries.map((query) => {
                        return graphQl.normalize(query, result.data)
                      })
                    }
                  })
              })
          }
        }

        return context
      }
    }
  }
}

export default GraphQlModule
