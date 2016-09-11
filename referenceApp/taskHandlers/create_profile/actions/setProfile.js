function setProfile(context) {
  const profile = context.input.profile;
  const data = context.input.data;

  return context.firebase.set(`profiles/list/${data.profileKey}`, profile)
    .then(context.path.success)
    .catch(context.path.error);
}

module.exports = setProfile;
