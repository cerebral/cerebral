import {getSpecs} from '../helper/module'
import {getMedia} from '../services/matchMedia'

export default function setMedia (context) {
  const {state, path, options} = getSpecs(context)
  const moduleState = state.select(path)

  moduleState.set(['media'], getMedia(options))
}
