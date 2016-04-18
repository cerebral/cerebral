import objectPath from 'object-path'
import {getSpecs} from '../helper/module'

export default function setWindow (context) {
  const {state, services, path} = getSpecs(context)
  const window = objectPath.get(services, [...path, 'window'])
  const moduleState = state.select(path)

  moduleState.set(['window'], window.getSpecs())
}
