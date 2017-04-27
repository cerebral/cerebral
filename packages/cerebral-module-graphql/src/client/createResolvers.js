function createResolvers (resolvers) {
  return Object.keys(resolvers).reduce((currentResolversType, resolveType) => {
    const resolversType = resolvers[resolveType]

    currentResolversType[resolveType] = Object.keys(resolversType).reduce((currentResolvers, resolver) => {
      const resolverFunc = resolversType[resolver]

      currentResolvers[resolver] = (obj, args, context) => {
        if (context.debugger) {
          context.debugger.send({
            method: `graphql.resolvers.${resolveType}.${resolver}`,
            args: [obj, args]
          })
        }

        return resolverFunc(obj, args, context)
      }

      return currentResolvers
    }, {})

    return currentResolversType
  }, {})
}

export default createResolvers
