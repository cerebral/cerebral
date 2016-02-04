export default function setMedia ({state, services, module}) {
  const matchMedia = services.useragent.matchMedia
  const queries = module.meta.options.media

  const media = Object.keys(queries)
  .map(name => {
    return { name, queryString: queries[name] }
  })
  .reduce((result, media) => {
    result[media.name] = matchMedia(media.queryString).matches
    return result
  }, {})

  state.set(['useragent', 'media'], media)
}
