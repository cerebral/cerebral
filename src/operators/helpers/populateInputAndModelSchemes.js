export default (input, model) => {
  return (scheme) => {
    if (scheme.target === 'model') {
      return model.get(scheme.value)
    }
    if (scheme.target === 'input') {
      return input[scheme.value]
    }
    throw new Error('Cerebral operators - The inline scheme: "' + (JSON.stringify(scheme)) + '" is not valid for the SET operator')
  }
}
