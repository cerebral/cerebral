import {makeExecutableSchema} from 'graphql-tools'
import createResolvers from './createResolvers'

export default function createExecutableSchema ({schema, resolvers}) {
  return makeExecutableSchema({typeDefs: schema, resolvers: createResolvers(resolvers)})
}
