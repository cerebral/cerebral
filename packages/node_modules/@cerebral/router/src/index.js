import urlMapper from 'url-mapper'
import baseRouter from './base'

const defaultMapper = urlMapper({ query: true })

export default function(options = {}) {
  return baseRouter(Object.assign(options, { mapper: defaultMapper }))
}
