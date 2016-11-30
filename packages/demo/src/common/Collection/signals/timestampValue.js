export default [
  function timestampValue ({input: {value}}) {
    return {value: Object.assign(
        {},
        {created_at: {'.sv': 'timestamp'}},
        value,
        {updated_at: {'.sv': 'timestamp'}}
      )
    }
  }
]
