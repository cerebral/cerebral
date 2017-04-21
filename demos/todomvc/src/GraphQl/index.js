import { graphql, buildSchema, typeFromAST, parse, buildASTSchema } from 'graphql'
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
          function query ({graphql, props}) {
            return graphql.query(props.query)
          },
          function setResponse ({props, state}) {
            state.set(`graphql.data`, props.data)
          }
        ]
      },
      provider (context) {
        const resolvers = Object.assign({}, options.root);

        context.graphql = {
          query(query) {
            return graphql(schema, query, resolvers);
          }
        }

        if (context.debugger) {
          context.debugger.wrapProvider('graphql');
          Object.keys(resolvers).reduce((wrappedResolvers, resolver) => {
            const origin = wrappedResolvers[resolver]
            wrappedResolvers[resolver] = (...args) => {
              context.debugger.send({
                method: `graphql.resolvers.${resolver}`,
                args
              })

              return origin.apply(null, args);
            }
            return wrappedResolvers
          }, resolvers);
        }

        return context
      }
    }
  }
}

export default Module
