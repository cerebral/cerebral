function createNotificationJoinHousehold (context) {
  const data = context.input.data

  return ({
    notification: {
      type: 'joinHousehold',
      householdKey: data.householdKey
    }
  })
}

module.exports = createNotificationJoinHousehold
