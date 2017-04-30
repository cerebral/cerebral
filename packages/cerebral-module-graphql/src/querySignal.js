export default [
  function setQueryStatus ({props, state}) {
    state.set(`graphql.queries.${props.query}`, {
      isLoading: true
    })
  },
  function query ({props, graphql}) {
    return graphql.query(props.query)
  },
  function setResult ({props, state, graphql}) {
    Object.keys(props.data.entities).forEach((type) => {
      if (!state.get(`graphql.entities.${type}`)) {
        state.set(`graphql.entities.${type}`, props.data.entities[type])
      } else {
        Object.keys(props.data.entities[type]).forEach((entityId) => {
          state.merge(`graphql.entities.${type}.${entityId}`, props.data.entities[type][entityId])
        })
      }
    })
    state.set(`graphql.queries.${props.query}`, {
      isLoading: false,
      objectIds: props.data.objectIds
    })
  }
]
