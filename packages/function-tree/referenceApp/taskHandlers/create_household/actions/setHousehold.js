function setHousehold(context) {
  const data = context.input.data;
  const householdKey = data.householdKey;
  const household = context.input.household;

  return context.firebase.set(`households/list/${householdKey}`, household)
    .then(context.path.success)
    .catch(context.path.error);
}

module.exports = setHousehold;
