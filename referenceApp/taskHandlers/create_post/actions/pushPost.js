function pushPost(context) {
  return context.firebase.push('posts', context.input.post)
    .then(context.path.success)
    .catch(context.path.error);
}

module.exports = pushPost;
