import {graphql} from 'graphql'
import {print} from 'graphql/language'
import GraphQl from '../GraphQl'
import querySignal from '../querySignal'
import createExecutableSchema from './createExecutableSchema'

function GraphQlModule (options = {}) {

  const schema = createExecutableSchema(options)
  const graphQl = new GraphQl(schema)

  return function module ({controller}) {
    return {
      state: {
        objectTypes: graphQl.objectTypes,
        queryTypes: graphQl.queryTypes,
        entities: {},
        queries: {}
      },
      signals: {
        queried: querySignal
      },
      provider(context) {
        context.graphql = {
          query(query) {
            return graphql(schema, graphQl.addQuery(query).printed, null, context)
              .then((result) => {
                if (result.errors) {
                  throw result.errors[0]
                }

                return {
                  data: graphQl.normalize(query, result.data)
                }
              })
          }
        }

        return context
      }
    }
  }
}

export default GraphQlModule
