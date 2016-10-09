function verifyUserIsAdmin(context) {
  const profileKey = context.input.data.profileKey;
  const householdKey = context.input.data.householdKey;

  return context.firebase.value(`households/list/${householdKey}/admin`)
    .then((result) => {
      if (result.value === profileKey) {
        return context.path.success();
      }
      return context.path.error();
    }
  ).catch(context.path.error);
}

module.exports = verifyUserIsAdmin;
