function getDepartmentKey (context) {
  const householdKey = context.input.householdKey
  const companyKey = context.input.challenge.companyKey

  return context.firebase.value(`households/list/${householdKey}/companies/${companyKey}`)
    .then((result) => {
      const departmentKey = result.value ? result.value : context.input.data.departmentKey
      return context.path.success({departmentKey})
    })
    .catch(context.path.error)
}

module.exports = getDepartmentKey
