export default [
  function setQueryStatus ({props, state}) {
    state.set(`graphql.queries.${props.query}`, {
      isLoading: true
    })
  },
  function query ({props, graphql}) {
    return graphql.query(props.query)
  },
  function setResult ({props, state}) {
    Object.keys(props.data).forEach((type) => {
      if (!state.get(`graphql.entities.${type}`)) {
        state.set(`graphql.entities.${type}`, props.data[type])
      } else {
        Object.keys(props.data[type]).forEach((entityId) => {
          state.merge(`graphql.entities.${type}.${entityId}`, props.data[type][entityId])
        })
      }
    })
    state.set(`graphql.queries.${props.query}`, {
      isLoading: false
    })
  }
]
