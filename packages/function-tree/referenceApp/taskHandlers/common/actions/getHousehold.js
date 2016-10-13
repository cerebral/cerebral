function getHousehold (context) {
  const firebase = context.firebase
  const data = context.input.data
  const householdKey = data.householdKey

  if (!householdKey) {
    return
  }

  return firebase.value(`households/list/${householdKey}`)
  .then((response) => {
    return {household: response.value}
  })
}

module.exports = getHousehold
