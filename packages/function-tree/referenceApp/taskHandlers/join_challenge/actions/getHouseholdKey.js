function getHouseholdKey(context) {
  const profileKey = context.input.data.profileKey;

  return context.firebase.value(`profiles/list/${profileKey}/householdKey`)
    .then(result => ({householdKey: result.value}));
}

module.exports = getHouseholdKey;
