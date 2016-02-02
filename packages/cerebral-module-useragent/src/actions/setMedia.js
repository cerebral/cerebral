export default function setMedia ({module}) {
  const matchMedia = module.services.matchMedia
  const queries = module.meta.options.media

  const media = Object.keys(queries)
  .map(name => {
    return { name, queryString: queries[name] }
  })
  .reduce((result, media) => {
    result[media.name] = matchMedia(media.queryString).matches
    return result
  }, {})

  module.state.set(['media'], media)
}
