function getProfileEmail(context) {
  return context.firebase.value(`profiles.list.${context.input.data.profileKey}.email`)
    .then((result) => {
      const profileEmail = result.data;

      if (context.path) {
        return context.path.success({profileEmail});
      }
      return {profileEmail};
    })
    .catch((error) => {
      if (context.path) {
        return context.path.error({error});
      }
      return {error};
    });
}

module.exports = getProfileEmail;
