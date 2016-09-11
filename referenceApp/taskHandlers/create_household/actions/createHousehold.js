function createHousehold(context) {
  const data = context.input.data;

  return ({
    household: {
      admin: data.profileKey,
      income: data.income,
      type: data.type,
      sqm: data.sqm,
      memberCount: data.memberCount,
      companies: {
        [data.companyKey]: data.departmentKey
      },
      members: {
        [data.profileKey]: true
      }
    }
  });
}

module.exports = createHousehold;
