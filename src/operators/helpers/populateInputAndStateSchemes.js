export default (input, state) => {
  return (scheme) => {
    if (scheme.target === 'state') {
      return state.get(scheme.value)
    }
    if (scheme.target === 'input') {
      return input[scheme.value]
    }
    throw new Error('Cerebral operators - The inline scheme: "' + (JSON.stringify(scheme)) + '" is not valid for the SET operator')
  }
}
