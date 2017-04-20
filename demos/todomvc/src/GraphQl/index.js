import { graphql, buildSchema } from 'graphql'
import Tag from 'cerebral/lib/tags/Tag'

export {default as connect} from './connect'

export function query (strings, ...values) {
  return new Tag('query', {}, strings, values)
}

function Module (options = {}) {
  const schema = buildSchema(options.schema);

  return ({controller, path}) => {
    return {
      state: {},
      signals: {
        test: [
          ({graphql, props, state}) => {
            graphql.query(props.query)
              .then((result) => {
                // Safe insert
                state.set(`graphql.data`, result.data)
              })
          }
        ]
      },
      provider (context) {
        context.graphql = {
          query(query) {
            return graphql(schema, query, options.root);
          }
        }
        return context
      }
    }
  }
}

export default Module
