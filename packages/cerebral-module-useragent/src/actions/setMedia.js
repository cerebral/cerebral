import objectPath from 'object-path'

export default function setMedia ({state, services, module}) {
  const queries = module.meta.options.media
  const matchMedia = objectPath.get(services, [...module.path, 'matchMedia'])
  const moduleState = state.select(module.path)

  const media = Object.keys(queries)
  .map(name => {
    return { name, queryString: queries[name] }
  })
  .reduce((result, media) => {
    result[media.name] = matchMedia(media.queryString).matches
    return result
  }, {})

  moduleState.set(['media'], media)
}
