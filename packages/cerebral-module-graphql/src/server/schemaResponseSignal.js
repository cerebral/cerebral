export default [
  function ({state, props}) {
    state.set('graphql.queryTypes', props.queryTypes)
    state.set('graphql.objectTypes', props.objectTypes)
  }
]
