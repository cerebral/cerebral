function VerifyInputProvider(context, functionDetails) {
  try {
    JSON.stringify(context.input)
  } catch (e) {
    throwError(`The function ${functionDetails.name} in signal ${context.execution.name} is not given a valid input`)
  }

  return context
}

export default VerifyInputProvider
