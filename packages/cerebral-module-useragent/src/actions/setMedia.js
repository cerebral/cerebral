import objectPath from 'object-path'
import {getSpecs} from '../helper/module'

export default function setMedia (context) {
  const {state, path, options, services} = getSpecs(context)
  const moduleState = state.select(path)
  const getMedia = objectPath.get(services, [...path, 'getMedia'])

  moduleState.set(['media'], getMedia(options))
}
