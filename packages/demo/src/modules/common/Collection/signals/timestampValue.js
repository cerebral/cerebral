export default [
  function timestampValue ({input: {value}}) {
    return {value: Object.assign(
        {},
        {updated_at: {'.sv': 'timestamp'}},
        value,
        {created_at: {'.sv': 'timestamp'}}
      )
    }
  }
]
