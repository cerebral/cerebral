function createPostComment (context) {
  const data = context.input.data

  return {
    postComment: {
      profileUid: data.profileUid,
      datetime: Date.now(),
      text: data.text || ''
    }
  }
}

module.exports = createPostComment
