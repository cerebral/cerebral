function takeAvatars(context) {
  return {
    avatars: context.input.members
      .map(member => ({url: member.avatar_url, login: member.login}))
  }
}

module.exports = takeAvatars
