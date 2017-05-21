import ControllerClass from './Controller'
import UniversalControllerClass from './UniversalController'

export function Controller (options) {
  return new ControllerClass(options)
}
export function UniversalController (options) {
  return new UniversalControllerClass(options)
}
export {default as compute} from './Compute'
export {default as provide} from './Provide'
export {sequence, parallel} from 'function-tree'
