import Router from './router'

let addressbar
try {
  addressbar = require('addressbar')
} catch (e) {
  addressbar = {
    pathname: '/',
    value: '',
    origin: '',
    on () {},
    removeListener () {}
  }
}

export {default as redirect} from './redirect'
export {default as goTo} from './goTo'

export default function (options = {}) {
  if (!options.mapper || typeof options.mapper.map !== 'function') {
    throw new Error('Cerebral router - mapper option must be provided.')
  }

  return ({controller}) => {
    return new Router(controller, addressbar, options.mapper, options)
  }
}
