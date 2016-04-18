import objectPath from 'object-path'
import {getSpecs} from '../helper/module'

export default function setMedia (context) {
  const {state, services, options, path} = getSpecs(context)
  const queries = options.media
  const matchMedia = objectPath.get(services, [...path, 'matchMedia'])
  const moduleState = state.select(path)

  const media = Object.keys(queries)
  .map((name) => {
    return { name, queryString: queries[name] }
  })
  .reduce((result, media) => {
    result[media.name] = matchMedia(media.queryString).matches
    return result
  }, {})

  moduleState.set(['media'], media)
}
