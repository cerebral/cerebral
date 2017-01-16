import urlMapper from 'url-mapper'
import baseRouter from './base'

export {default as redirect} from './redirect'
export {default as goTo} from './goTo'

export default function (options = {}) {
  return baseRouter(Object.assign(options, {mapper: urlMapper({query: true})}))
}
