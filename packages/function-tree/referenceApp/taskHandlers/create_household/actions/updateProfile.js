function updateProfile(context) {
  const data = context.input.data;
  const householdKey = data.householdKey;

  return context.firebase.set(`profiles/list/${data.profileKey}/householdKey`, householdKey)
    .then(context.path.success)
    .catch(context.path.error);
}

module.exports = updateProfile;
