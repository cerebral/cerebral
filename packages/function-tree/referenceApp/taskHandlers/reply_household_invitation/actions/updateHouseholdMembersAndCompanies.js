function updateHouseholdMembersAndCompanies(context) {
  const householdKey = context.input.notification.householdKey;
  const profile = context.input.profile;

  return context.firebase.transaction(`households/list/${householdKey}`, (household) => {
    if (!household) {
      return null;
    }

    household.members[context.input.data.profileKey] = true;
    const actualMembersCount = Object.keys(household.members).length;

    household.membersCount = Math.max(household.membersCount, actualMembersCount);

    if (profile.companyKey) {
      household.companies = household.companies || {};
      household.companies[profile.companyKey] = profile.departmentKey;
    }

    return household;
  });
}

module.exports = updateHouseholdMembersAndCompanies;
