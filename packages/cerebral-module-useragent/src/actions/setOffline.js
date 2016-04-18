import {getSpecs} from '../helper/module'

export default function setOffline (context) {
  const {input, state, path} = getSpecs(context)
  const moduleState = state.select(path)

  moduleState.set(['network', 'offline'], input.offline)
}
