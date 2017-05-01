import {debounce} from 'cerebral/operators'

export default [
  function setQueryStatus ({props, state}) {
    state.set(`graphql.queries.${props.query}`, {
      isLoading: true
    })
    state.push('graphql.batchedQueries', props.query)
  },
  debounce(0), {
    continue: [
      function query ({state, props, graphql}) {
        return graphql.query(state.get('graphql.batchedQueries'))
      },
      function setResult ({props, state, graphql}) {
        props.data.forEach((data) => {
          Object.keys(data.entities).forEach((type) => {
            if (!state.get(`graphql.entities.${type}`)) {
              state.set(`graphql.entities.${type}`, data.entities[type])
            } else {
              Object.keys(data.entities[type]).forEach((entityId) => {
                state.merge(`graphql.entities.${type}.${entityId}`, data.entities[type][entityId])
              })
            }
          })
        })
      },
      function updateQueries ({state, props}) {
        state.get('graphql.batchedQueries').forEach((query, index) => {
          const data = props.data[index]

          state.set(`graphql.queries.${query}`, {
            isLoading: false,
            objectIds: data.objectIds
          })
        })

        state.set('graphql.batchedQueries', [])
      }
    ],
    discard: []
  }
]
