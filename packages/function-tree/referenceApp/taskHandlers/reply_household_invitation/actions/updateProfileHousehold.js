function updateProfileHousehold(context) {
  const profileKey = context.input.data.profileKey;
  const notification = context.input.notification;

  return context.firebase.transaction(`profiles/list/${profileKey}`, (profile) => {
    if (!profile) {
      return null;
    }

    profile.householdKey = notification.householdKey;

    return profile;
  });
}

module.exports = updateProfileHousehold;
