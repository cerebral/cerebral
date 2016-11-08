export function myAction1 ({input}) {
  return {
    value: input.value + ' extended by myAction1'
  }
}

export function myAction2 ({input}) {
  return ({
    value: input.value + ' and also by myAction2',
    aKeyAddedByMyAction2: 'testvalue'
  })
}

export function myAction3 ({input, state}) {
  return ({
    value: input.value.toUpperCase()
  })
}
