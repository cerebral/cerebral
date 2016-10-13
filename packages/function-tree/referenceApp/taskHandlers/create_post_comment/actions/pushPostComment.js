function pushPostComment (context) {
  const data = context.input.data
  const postComment = context.input.postComment

  return context.firebase.push(`postComments/${data.postKey}`, postComment)
        .then(context.path.success)
        .catch(context.path.error)
}

module.exports = pushPostComment
