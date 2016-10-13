function createPost (context) {
  const data = context.input.data
  const DEFAULT_POINTS = 5
  const DEFAULT_POINTS_WITH_IMAGE = 10
  const post = {
    profileUid: data.profileUid,
    datetime: Date.now(),
    points: data.imageUrl ? DEFAULT_POINTS_WITH_IMAGE : DEFAULT_POINTS,
    category: data.category || null,
    text: data.text || '',
    link: data.link || null,
    image: {
      ratio: (data.image && data.image.ratio) || null,
      small: (data.image && data.image.small) || null,
      large: (data.image && data.image.large) || null
    },
    likesCount: 0,
    commentsCount: 0,
    bookmarksCount: 0,
    sharesCount: 0
  }

  return {post}
}

module.exports = createPost
